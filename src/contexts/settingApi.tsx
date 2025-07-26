import { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';


export type AIProvider = 'gemini' | 'openai' | 'claude' | 'custom';

// Map des modèles supportés par provider (pour validation)
const SUPPORTED_MODELS: Record<AIProvider, string[]> = {
  gemini: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-1.0-pro', 'gemini-2.5-flash', 'gemini-2.5-pro'],
  openai: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
  claude: ['claude-2', 'claude-3-sonnet', 'claude-3-opus', 'claude-sonnet-4'],
  custom: [], // Pour 'custom', on accepte tout modèle non vide
};

// Modèles par défaut par provider
const DEFAULT_MODELS: Record<AIProvider, string> = {
  gemini: 'gemini-2.5-flash',
  openai: 'gpt-3.5-turbo',
  claude: 'claude-3-sonnet',
  custom: '',
};

// Génération d'une clé de 32 bytes exactement pour AES-256
function generateEncryptionKey(): Promise<CryptoKey> {
  const keyString = 'your-secret-key-here-must-be-32b'; // Exactement 32 caractères = 32 bytes
  const keyData = new TextEncoder().encode(keyString);

  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

// Cache pour la clé de chiffrement
let encryptionKeyPromise: Promise<CryptoKey> | null = null;

function getEncryptionKey(): Promise<CryptoKey> {
  if (!encryptionKeyPromise) {
    encryptionKeyPromise = generateEncryptionKey();
  }
  return encryptionKeyPromise;
}

// Fonctions utilitaires pour chiffrer/déchiffrer (optionnel, pour plus de sécurité)
async function encryptApiKey(key: string): Promise<string> {
  try {
    const encoded = new TextEncoder().encode(key);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cryptoKey = await getEncryptionKey();

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encoded
    );

    // Combine IV and encrypted data, then encode to base64
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt API key');
  }
}

async function decryptApiKey(encrypted: string): Promise<string> {
  try {
    const combined = new Uint8Array(
      atob(encrypted).split('').map(char => char.charCodeAt(0))
    );

    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const cryptoKey = await getEncryptionKey();

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt API key');
  }
}

// Interface du contexte
export interface PropsSettingApi {
  provider: AIProvider;
  setProvider: React.Dispatch<React.SetStateAction<AIProvider>>;
  model: string;
  setModel: React.Dispatch<React.SetStateAction<string>>;
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
  configured: boolean;
  isLoading: boolean;
  saveConfig: (provider: AIProvider, model: string, apiKey: string) => Promise<void>;
  clearConfig: () => void;
  isValidConfig: boolean;
  validateModel: (provider: AIProvider, model: string) => boolean;
}

type PropsSettingApiProvider = {
  children: React.ReactNode;
};

// Création du contexte
const SettingApiContext = createContext<PropsSettingApi | undefined>(undefined);

// Composant Provider
export const SettingApiProvider = ({ children }: PropsSettingApiProvider) => {
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const [model, setModel] = useState<string>(DEFAULT_MODELS.gemini);
  const [apiKey, setApiKey] = useState<string>('');
  const [configured, setConfigured] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validation d'un modèle pour un provider
  const validateModel = useCallback((prov: AIProvider, mod: string): boolean => {
    if (prov === 'custom') return !!mod; // Accepte tout non vide pour custom
    return SUPPORTED_MODELS[prov].includes(mod);
  }, []);

  // isValidConfig comme valeur dérivée (avec useMemo pour perf)
  const isValidConfig = useMemo(() => {
    return !!apiKey && !!model && validateModel(provider, model);
  }, [apiKey, model, provider, validateModel]);

  // Synchronise 'configured' avec isValidConfig
  useEffect(() => {
    setConfigured(isValidConfig);
  }, [isValidConfig]);

  // Reset du modèle au default lors du changement de provider
  useEffect(() => {
    setModel(DEFAULT_MODELS[provider]);
  }, [provider]);

  // Chargement de la config depuis localStorage (avec déchiffrement)
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const storedProvider = localStorage.getItem('deepSearch_provider') as AIProvider | null;
        const storedModel = localStorage.getItem('deepSearch_model');
        const storedEncryptedApiKey = localStorage.getItem('deepSearch_apiKey');
        const storedConfigured = localStorage.getItem('deepSearch_configured') === 'true';

        if (storedProvider) setProvider(storedProvider);
        if (storedModel) setModel(storedModel);
        if (storedEncryptedApiKey) {
          try {
            const decrypted = await decryptApiKey(storedEncryptedApiKey);
            setApiKey(decrypted);
          } catch (decryptError) {
            console.warn('Failed to decrypt stored API key, clearing storage');
            localStorage.removeItem('deepSearch_apiKey');
          }
        }
        setConfigured(storedConfigured);

        console.warn('API key loaded from localStorage. Note: This is not secure for production use!');
      } catch (error) {
        console.error('Error loading API configuration:', error);
        clearConfig(); // Reset en cas d'erreur
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sauvegarde dans localStorage lors des changements (avec chiffrement)
  useEffect(() => {
    const saveToStorage = async () => {
      try {
        localStorage.setItem('deepSearch_provider', provider);
        localStorage.setItem('deepSearch_model', model);
        if (apiKey) {
          try {
            const encrypted = await encryptApiKey(apiKey);
            localStorage.setItem('deepSearch_apiKey', encrypted);
          } catch (encryptError) {
            console.error('Failed to encrypt API key:', encryptError);
            // Fallback: store unencrypted (not recommended for production)
            localStorage.setItem('deepSearch_apiKey_fallback', apiKey);
          }
        } else {
          localStorage.removeItem('deepSearch_apiKey');
          localStorage.removeItem('deepSearch_apiKey_fallback');
        }
        localStorage.setItem('deepSearch_configured', configured.toString());
      } catch (error) {
        console.error('Error saving API configuration:', error);
      }
    };

    if (!isLoading) saveToStorage();
  }, [provider, model, apiKey, configured, isLoading]);

  // Sauvegarde de la config (async pour chiffrement)
  const saveConfig = useCallback(async (newProvider: AIProvider, newModel: string, newApiKey: string) => {
    if (!validateModel(newProvider, newModel)) {
      throw new Error(`Invalid model "${newModel}" for provider "${newProvider}"`);
    }
    setProvider(newProvider);
    setModel(newModel);
    setApiKey(newApiKey);
    // 'configured' sera mis à jour via useEffect
  }, [validateModel]);

  // Reset de la config
  const clearConfig = useCallback(() => {
    setProvider('gemini');
    setModel(DEFAULT_MODELS.gemini);
    setApiKey('');
    setConfigured(false);

    // Clear localStorage
    localStorage.removeItem('deepSearch_provider');
    localStorage.removeItem('deepSearch_model');
    localStorage.removeItem('deepSearch_apiKey');
    localStorage.removeItem('deepSearch_apiKey_fallback');
    localStorage.removeItem('deepSearch_configured');
  }, []);

  // Objet du contexte
  const settingsApi: PropsSettingApi = {
    provider,
    setProvider,
    model,
    setModel,
    apiKey,
    setApiKey,
    configured,
    isLoading,
    saveConfig,
    clearConfig,
    isValidConfig,
    validateModel,
  };

  return (
    <SettingApiContext.Provider value={settingsApi}>
      {children}
    </SettingApiContext.Provider>
  );
};

export const useSettingApi = () => {
  const context = useContext(SettingApiContext);
  if (!context) {
    throw new Error('useSettingApi must be used within a SettingApiProvider');
  }
  return context;
};
