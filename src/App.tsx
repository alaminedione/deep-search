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
import { Sheet, SheetContent, SheetTrigger } from './components/ui/sheet';
import { Menu } from 'lucide-react';
import { useMediaQuery } from './hooks/use-media-query';

const App = () => {
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<'home' | 'search'>('home');
  const defaultSearchEngine: TSearchEngine = "google.com"
  const [searchEngine, setSearchEngine] = useState<TSearchEngine>(defaultSearchEngine)
  const [searchTimestamps, setSearchTimestamps] = useState<number[]>(() => {
    const storedTimestamps = localStorage.getItem("searchTimestamps");
    if (storedTimestamps) {
      try {
        return JSON.parse(storedTimestamps);
      } catch (error) {
        console.error("Error parsing search timestamps from localStorage:", error);
        return [];
      }
    }
    return [];
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSearchEngine = localStorage.getItem("searchEngine");
    if (storedSearchEngine) {
      setSearchEngine(storedSearchEngine as TSearchEngine);
    }
  }, []);

  // Save search timestamps to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("searchTimestamps", JSON.stringify(searchTimestamps));
  }, [searchTimestamps]);

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
      
      // Record the timestamp of the successful search
      setSearchTimestamps(prev => [...prev, Date.now()]);

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

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const navLinks = (
    <>
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
    </>
  );

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
              {isDesktop ? (
                <div className="flex items-center gap-3">
                  {navLinks}
                </div>
              ) : (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <div className="flex flex-col gap-4 py-6">
                      {navLinks}
                    </div>
                  </SheetContent>
                </Sheet>
              )}
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
                <HomeStats searchTimestamps={searchTimestamps} />
              </div>
            </div>
          ) : (
            /* Search View */
            <div className="space-y-8 py-8">
              {/* Interface de recherche unifiée avec onglets améliorés */}
              <AiSearchPage
                onSearch={executeSearch}
              />
            </div>
          )}
        </main>
      </div>
    </SettingApiProvider>
  );
};

export default App;