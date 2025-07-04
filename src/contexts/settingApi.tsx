import { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Définition de l'interface pour les props du contexte
export interface PropsSettingApi {
  apikey: string;
  setApikey: React.Dispatch<React.SetStateAction<string>>;
  endpoint: string;
  setEndpoint: React.Dispatch<React.SetStateAction<string>>;
  modele: string;
  setModele: React.Dispatch<React.SetStateAction<string>>;
  configured: boolean;
  setConfigured: React.Dispatch<React.SetStateAction<boolean>>;
  validateAndSaveConfig: (key: string, endpoint: string, model: string) => Promise<boolean>;
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
  const [apikey, setApikey] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [modele, setModele] = useState('');
  const [configured, setConfigured] = useState(false);

  // Load configuration from localStorage on mount
  useEffect(() => {
    const loadConfig = () => {
      try {
        const storedApikey = localStorage.getItem('deepSearch_apikey');
        const storedEndpoint = localStorage.getItem('deepSearch_endpoint');
        const storedModele = localStorage.getItem('deepSearch_modele');
        const storedConfigured = localStorage.getItem('deepSearch_configured');

        if (storedApikey) setApikey(storedApikey);
        if (storedEndpoint) setEndpoint(storedEndpoint);
        if (storedModele) setModele(storedModele);
        if (storedConfigured === 'true') setConfigured(true);
      } catch (error) {
        console.error('Error loading API configuration:', error);
      }
    };

    loadConfig();
  }, []);

  // Save configuration to localStorage whenever it changes
  useEffect(() => {
    if (apikey) localStorage.setItem('deepSearch_apikey', apikey);
    if (endpoint) localStorage.setItem('deepSearch_endpoint', endpoint);
    if (modele) localStorage.setItem('deepSearch_modele', modele);
    localStorage.setItem('deepSearch_configured', configured.toString());
  }, [apikey, endpoint, modele, configured]);

  // Check if current configuration is valid
  const isValidConfig = Boolean(apikey && endpoint && modele);

  // Validate API configuration by making a test request
  const validateAndSaveConfig = useCallback(async (key: string, endpointUrl: string, model: string): Promise<boolean> => {
    if (!key || !endpointUrl || !model) {
      return false;
    }

    try {
      // Test the API with a simple request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout for validation

      const response = await fetch(endpointUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": model,
          "messages": [
            {
              "role": "user",
              "content": "Test"
            }
          ],
          "max_tokens": 5
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok || response.status === 400) { // 400 might be expected for minimal test
        setApikey(key);
        setEndpoint(endpointUrl);
        setModele(model);
        setConfigured(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('API validation failed:', error);
      return false;
    }
  }, []);

  // Clear all configuration
  const clearConfig = useCallback(() => {
    setApikey('');
    setEndpoint('');
    setModele('');
    setConfigured(false);
    
    // Clear from localStorage
    localStorage.removeItem('deepSearch_apikey');
    localStorage.removeItem('deepSearch_endpoint');
    localStorage.removeItem('deepSearch_modele');
    localStorage.removeItem('deepSearch_configured');
  }, []);

  // Création de l'objet settingsApi
  const settingsApi: PropsSettingApi = {
    apikey,
    setApikey,
    endpoint,
    setEndpoint,
    modele,
    setModele,
    configured,
    setConfigured,
    validateAndSaveConfig,
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