import { createContext, useState, useContext, useEffect, useCallback } from 'react';

export type AIModel = 'gemini' | 'openai' | 'claude';

// Définition de l'interface pour les props du contexte
export interface PropsSettingApi {
  openaiApiKey: string;
  setOpenaiApiKey: React.Dispatch<React.SetStateAction<string>>;
  geminiApiKey: string;
  setGeminiApiKey: React.Dispatch<React.SetStateAction<string>>;
  claudeApiKey: string;
  setClaudeApiKey: React.Dispatch<React.SetStateAction<string>>;
  selectedModel: AIModel;
  setSelectedModel: React.Dispatch<React.SetStateAction<AIModel>>;
  configured: boolean;
  setConfigured: React.Dispatch<React.SetStateAction<boolean>>;
  saveConfig: (model: AIModel, keys: { openai?: string; gemini?: string; claude?: string }) => void;
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
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel>('gemini');
  const [configured, setConfigured] = useState(false);

  // Load configuration from localStorage on mount
  useEffect(() => {
    const loadConfig = () => {
      try {
        const storedOpenaiKey = localStorage.getItem('deepSearch_openaiApiKey');
        const storedGeminiKey = localStorage.getItem('deepSearch_geminiApiKey');
        const storedClaudeKey = localStorage.getItem('deepSearch_claudeApiKey');
        const storedModel = localStorage.getItem('deepSearch_selectedModel') as AIModel;
        const storedConfigured = localStorage.getItem('deepSearch_configured');

        if (storedOpenaiKey) setOpenaiApiKey(storedOpenaiKey);
        if (storedGeminiKey) setGeminiApiKey(storedGeminiKey);
        if (storedClaudeKey) setClaudeApiKey(storedClaudeKey);
        if (storedModel) setSelectedModel(storedModel);
        if (storedConfigured === 'true') setConfigured(true);
      } catch (error) {
        console.error('Error loading API configuration:', error);
      }
    };

    loadConfig();
  }, []);

  // Save configuration to localStorage whenever it changes
  useEffect(() => {
    if (openaiApiKey) localStorage.setItem('deepSearch_openaiApiKey', openaiApiKey);
    if (geminiApiKey) localStorage.setItem('deepSearch_geminiApiKey', geminiApiKey);
    if (claudeApiKey) localStorage.setItem('deepSearch_claudeApiKey', claudeApiKey);
    localStorage.setItem('deepSearch_selectedModel', selectedModel);
    localStorage.setItem('deepSearch_configured', configured.toString());
  }, [openaiApiKey, geminiApiKey, claudeApiKey, selectedModel, configured]);

  // Check if current configuration is valid
  const isValidConfig = configured &&
    (selectedModel === 'openai' ? !!openaiApiKey :
     selectedModel === 'gemini' ? !!geminiApiKey :
     selectedModel === 'claude' ? !!claudeApiKey : false);

  // Save configuration
  const saveConfig = useCallback((model: AIModel, keys: { openai?: string; gemini?: string; claude?: string }) => {
    setSelectedModel(model);
    if (keys.openai) setOpenaiApiKey(keys.openai);
    if (keys.gemini) setGeminiApiKey(keys.gemini);
    if (keys.claude) setClaudeApiKey(keys.claude);
    
    const isConfigured = 
      (model === 'openai' && !!keys.openai) ||
      (model === 'gemini' && !!keys.gemini) ||
      (model === 'claude' && !!keys.claude);
      
    setConfigured(isConfigured);
  }, []);

  // Clear all configuration
  const clearConfig = useCallback(() => {
    setOpenaiApiKey('');
    setGeminiApiKey('');
    setClaudeApiKey('');
    setSelectedModel('gemini');
    setConfigured(false);
    
    // Clear from localStorage
    localStorage.removeItem('deepSearch_openaiApiKey');
    localStorage.removeItem('deepSearch_geminiApiKey');
    localStorage.removeItem('deepSearch_claudeApiKey');
    localStorage.removeItem('deepSearch_selectedModel');
    localStorage.removeItem('deepSearch_configured');
  }, []);

  // Création de l'objet settingsApi
  const settingsApi: PropsSettingApi = {
    openaiApiKey,
    setOpenaiApiKey,
    geminiApiKey,
    setGeminiApiKey,
    claudeApiKey,
    setClaudeApiKey,
    selectedModel,
    setSelectedModel,
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