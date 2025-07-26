import { createContext, useState, useContext, useEffect, useCallback } from 'react';

export type AIProvider = 'gemini' | 'openai' | 'claude' | 'custom';

// Définition de l'interface pour les props du contexte
export interface PropsSettingApi {
  provider: AIProvider;
  setProvider: React.Dispatch<React.SetStateAction<AIProvider>>;
  model: string;
  setModel: React.Dispatch<React.SetStateAction<string>>;
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
  configured: boolean;
  setConfigured: React.Dispatch<React.SetStateAction<boolean>>;
  saveConfig: (provider: AIProvider, model: string, apiKey: string) => void;
  clearConfig: () => void;
  isValidConfig: boolean;
}

type PropsSettingApiProvider = {
  children: React.ReactNode;
}

// Création du contexte
const SettingApiContext = createContext<PropsSettingApi | undefined>(undefined);

// Composant Provider
export const SettingApiProvider = ({ children }: PropsSettingApiProvider) => {
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const [model, setModel] = useState('gemini-1.5-flash'); // Default to a working Gemini model
  const [apiKey, setApiKey] = useState('');
  const [configured, setConfigured] = useState(false);

  // Load configuration from localStorage on mount
  useEffect(() => {
    const loadConfig = () => {
      try {
        const storedProvider = localStorage.getItem('deepSearch_provider') as AIProvider;
        const storedModel = localStorage.getItem('deepSearch_model');
        const storedApiKey = localStorage.getItem('deepSearch_apiKey');
        const storedConfigured = localStorage.getItem('deepSearch_configured');

        if (storedProvider) setProvider(storedProvider);
        if (storedModel) setModel(storedModel);
        if (storedApiKey) setApiKey(storedApiKey);
        if (storedConfigured === 'true') setConfigured(true);
      } catch (error) {
        console.error('Error loading API configuration:', error);
      }
    };

    loadConfig();
  }, []);

  // Save configuration to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('deepSearch_provider', provider);
    localStorage.setItem('deepSearch_model', model);
    localStorage.setItem('deepSearch_apiKey', apiKey);
    localStorage.setItem('deepSearch_configured', configured.toString());
  }, [provider, model, apiKey, configured]);

  // Check if current configuration is valid
  const isValidConfig = configured && !!apiKey && !!model;

  // Save configuration
  const saveConfig = useCallback((newProvider: AIProvider, newModel: string, newApiKey: string) => {
    setProvider(newProvider);
    setModel(newModel);
    setApiKey(newApiKey);
    setConfigured(!!newApiKey && !!newModel);
  }, []);

  // Clear all configuration
  const clearConfig = useCallback(() => {
    setProvider('gemini');
    setModel('gemini-1.5-flash');
    setApiKey('');
    setConfigured(false);
    
    // Clear from localStorage
    localStorage.removeItem('deepSearch_provider');
    localStorage.removeItem('deepSearch_model');
    localStorage.removeItem('deepSearch_apiKey');
    localStorage.removeItem('deepSearch_configured');
  }, []);

  // Création de l'objet settingsApi
  const settingsApi: PropsSettingApi = {
    provider,
    setProvider,
    model,
    setModel,
    apiKey,
    setApiKey,
    configured,
    setConfigured,
    saveConfig,
    clearConfig,
    isValidConfig,
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