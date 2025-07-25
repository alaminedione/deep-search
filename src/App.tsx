import './App.css'
import { useState, useEffect, useCallback } from "react";
import { Button } from './components/ui/button';
import { TSearchEngine } from "./types";
import { SettingApiProvider } from "./contexts/settingApi";
import { useToast } from "./hooks/use-toast";
import { SettingsPage } from '@/components/settings-page';
import { AiSearchPage } from './components/ai-search-page';
import { HomeStats } from "./components/home-stats";
import { HeroSection } from "./components/hero-section";

interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
  searchEngine: TSearchEngine;
  isFavorite?: boolean;

  category?: string;
  notes?: string;
}

const App = () => {
  const { toast } = useToast();
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'search'>('home');
  const defaultSearchEngine: TSearchEngine = "google.com"
  const [searchEngine, setSearchEngine] = useState<TSearchEngine>(defaultSearchEngine)

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSearchEngine = localStorage.getItem("searchEngine");
    const storedHistory = localStorage.getItem("searchHistory");
    
    if (storedSearchEngine) {
      setSearchEngine(storedSearchEngine as TSearchEngine);
    }
    
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setSearchHistory(parsedHistory);
      } catch (error) {
        console.error("Error parsing search history:", error);
      }
    }
  }, []);

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);



  const executeSearch = useCallback((queryString: string) => {
    if (!queryString.trim()) {
      toast({
        title: "Recherche vide",
        description: "Veuillez entrer au moins un terme de recherche.",
        variant: "destructive"
      });
      return;
    }

    try {
      const encodedQueryString = encodeURIComponent(queryString);
      let searchUrl = '';

      if (searchEngine === 'google.com') {
        searchUrl = `https://www.google.com/search?q=${encodedQueryString}`;
      } else if (searchEngine === 'duckduckgo.com') {
        searchUrl = `https://duckduckgo.com/?q=${encodedQueryString}`;
      } else {
        throw new Error("Moteur de recherche non pris en charge");
      }

      window.open(searchUrl, '_blank');
      
      toast({
        title: "Recherche lancée",
        description: "Votre recherche a été ouverte dans un nouvel onglet.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive"
      });
    }
  }, [searchEngine, toast]);

  const exportHistory = useCallback(() => {
    const dataStr = JSON.stringify(searchHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'deep-search-history.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Historique exporté",
      description: "L'historique a été téléchargé avec succès.",
    });
  }, [searchHistory, toast]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    toast({
      title: "Historique effacé",
      description: "L'historique des recherches a été supprimé.",
    });
  }, [toast]);

  const loadFromHistory = useCallback((_historyItem: SearchHistory) => {
    toast({
      title: "Recherche chargée",
      description: "La recherche de l'historique a été chargée.",
    });
  }, [toast]);



  return (
    <SettingApiProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/30">
        {/* Navigation Header */}
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' 
                  style={{ fontFamily: "JetBrains Mono" }}>
                Deep Search
              </h1>
              <div className="flex items-center gap-3">
                <Button 
                  variant={currentView === 'home' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('home')}
                  className="font-medium"
                >
                  Accueil
                </Button>
                <Button 
                  variant={currentView === 'search' ? 'default' : 'ghost'}
                  onClick={() => setCurrentView('search')}
                  className="font-medium"
                >
                  Recherche
                </Button>
                <SettingsPage searchEngine={searchEngine} setSearchEngine={setSearchEngine} />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4">
          {currentView === 'home' ? (
            /* Home View */
            <div className="space-y-16 py-8">
              {/* Hero Section */}
              <HeroSection onStartSearch={() => setCurrentView('search')} />
              
              {/* Home Statistics */}
              <div className="flex justify-center">
                <HomeStats searchHistory={searchHistory} />
              </div>
            </div>
          ) : (
            /* Search View */
            <div className="space-y-8 py-8">
              {/* Interface de recherche unifiée avec onglets améliorés */}
              <AiSearchPage
                onSearch={executeSearch}
                
                searchHistory={searchHistory}
                onLoadFromHistory={loadFromHistory}
                onExportHistory={exportHistory}
                onClearHistory={clearHistory}
                onUpdateHistory={setSearchHistory}

              />
            </div>
          )}
        </main>
      </div>
    </SettingApiProvider>
  );
};

export default App;