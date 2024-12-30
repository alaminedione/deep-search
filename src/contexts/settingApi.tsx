import { createContext, useState, useContext } from 'react';

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

