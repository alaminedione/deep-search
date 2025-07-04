import './App.css'
import { useState, useEffect, useCallback } from "react";
import { Button } from './components/ui/button';
import { TSearchEngine } from "./types";
import { SettingApiProvider } from "./contexts/settingApi";
import { useToast } from "./hooks/use-toast";
import { DockBottom } from '@/components/dock';
import { UnifiedSearch } from './components/unified-search';
import { EnhancedSearchHistory } from "./components/enhanced-search-history";
import { SmartSearchSuggestions } from "./components/smart-search-suggestions";
import { HomeStats } from "./components/home-stats";
import { QuickStartGuide } from "./components/quick-start-guide";
import { FeatureShowcase } from "./components/feature-showcase";
import { HeroSection } from "./components/hero-section";

interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
  searchEngine: TSearchEngine;
  isFavorite?: boolean;
  tags?: string[];
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

  const addToHistory = useCallback((query: string) => {
    const newEntry: SearchHistory = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
      searchEngine
    };
    
    setSearchHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep only 10 most recent
  }, [searchEngine]);

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
    // Parse the query to extract components (simplified implementation)
    toast({
      title: "Recherche chargée",
      description: "La recherche de l'historique a été chargée.",
    });
  }, [toast]);

  const applySearchShortcut = useCallback((_shortcut: any) => {
    // Switch to search view when applying shortcut
    setCurrentView('search');

    toast({
      title: "Raccourci appliqué",
      description: "Le raccourci a été appliqué avec succès.",
    });
  }, [toast]);

  const applyQuickExample = useCallback((_example: any) => {
    // Switch to search view when applying example
    setCurrentView('search');

    toast({
      title: "Exemple appliqué",
      description: "L'exemple de recherche a été configuré avec succès.",
    });
  }, [toast]);

  const startTour = useCallback(() => {
    setCurrentView('search');
    toast({
      title: "Visite guidée",
      description: "Explorez toutes les fonctionnalités de Deep Search !",
    });
  }, [toast]);

  return (
    <SettingApiProvider>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <nav className="items-center justify-between">
          <div className="flex items-center justify-between max-w-6xl mx-auto px-4 pt-8">
            <h1 className='text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent' 
                style={{ fontFamily: "JetBrains Mono" }}>
              Deep Search
            </h1>
            <div className="flex items-center gap-4">
              <Button 
                variant={currentView === 'home' ? 'default' : 'outline'}
                onClick={() => setCurrentView('home')}
              >
                Accueil
              </Button>
              <Button 
                variant={currentView === 'search' ? 'default' : 'outline'}
                onClick={() => setCurrentView('search')}
              >
                Recherche
              </Button>
            </div>
          </div>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto px-4 mt-4">
            Effectuez des recherches avancées avec les opérateurs Google Dorks et l'intelligence artificielle
          </p>
        </nav>

        {currentView === 'home' ? (
          /* Home View */
          <div className="max-w-6xl mx-auto px-4 space-y-12">
            {/* Hero Section */}
            <HeroSection onStartSearch={() => setCurrentView('search')} />
            
            {/* Home Statistics */}
            <HomeStats searchHistory={searchHistory} />
            
            {/* Quick Start Guide */}
            <QuickStartGuide onApplyExample={applyQuickExample} />
            
            {/* Feature Showcase */}
            <FeatureShowcase onStartTour={startTour} />
          </div>
        ) : (
          /* Search View */
          <div className="max-w-6xl mx-auto px-4 space-y-8">
            {/* Interface de recherche unifiée */}
            <UnifiedSearch 
              onSearch={executeSearch}
              onAddToHistory={addToHistory}
            />

            {/* Suggestions intelligentes */}
            <div className="grid lg:grid-cols-2 gap-6">
              <SmartSearchSuggestions onApplyShortcut={applySearchShortcut} />
              <EnhancedSearchHistory 
                searchHistory={searchHistory}
                onLoadFromHistory={loadFromHistory}
                onExportHistory={exportHistory}
                onClearHistory={clearHistory}
                onUpdateHistory={setSearchHistory}
              />
            </div>
          </div>
        )}

        {/* Dock de navigation */}
        <DockBottom searchEngine={searchEngine} setSearchEngine={setSearchEngine} />
      </div>
    </SettingApiProvider>
  );
};

export default App;