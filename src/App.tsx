import './App.css'
import { useState, useEffect, useCallback, useMemo } from "react";
import InputTags from '@/components/input-tags'
import { Tag } from "emblor";
import { SearchBar } from './components/search-bar';
import { DockBottom } from '@/components/dock';
import { Button } from './components/ui/button';
import { TSearchEngine } from "./types";
import { tagsSites, tagsWords, tagsFileType, tagsWordsInTitle, tagsWordsInUrl, tagsSitesToExclude } from "./lib/tags-examples";
import { SettingApiProvider } from "./contexts/settingApi";
import { useToast } from "./hooks/use-toast";
import { Copy, Share2, Trash2, ChevronDown, ChevronUp } from "lucide-react";

import { EnhancedSearchHistory } from "./components/enhanced-search-history";
import { SmartSearchSuggestions } from "./components/smart-search-suggestions";
import { HomeStats } from "./components/home-stats";
import { QuickStartGuide } from "./components/quick-start-guide";
import { FeatureShowcase } from "./components/feature-showcase";

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

  // State management with better organization
  const [TagsFileType, setExampleTagsFileType] = useState<Tag[]>(tagsFileType);
  const [TagsSitesToExclude, setExampleTagsSitesToExclude] = useState<Tag[]>(tagsSitesToExclude);
  const [TagsWords, setExampleTagsWords] = useState<Tag[]>(tagsWords);
  const [TagsWordsInTitle, setExampleTagsWordsInTitle] = useState<Tag[]>(tagsWordsInTitle);
  const [TagsWordsInUrl, setExampleTagsWordsInUrl] = useState<Tag[]>(tagsWordsInUrl);
  const [TagsSites, setExampleTagsSites] = useState<Tag[]>(tagsSites);
  const [searchText, setSearchText] = useState("");
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
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

  // Memoized query builder for better performance
  const buildQuery = useCallback(() => {
    const sitesIncluded = TagsSites.length > 0
      ? `(${TagsSites.map(tag => `site:${tag.text}`).join(' OR ')})`
      : '';

    const excludeSites = TagsSitesToExclude.length > 0
      ? TagsSitesToExclude.map(tag => `-site:${tag.text}`).join(' ')
      : '';

    const wordsExcluded = TagsWords.length > 0
      ? TagsWords.map(tag => `-"${tag.text}"`).join(' ')
      : '';

    const fileTypes = TagsFileType.length > 0
      ? `(${TagsFileType.map(tag => `filetype:${tag.text}`).join(' OR ')})`
      : '';

    const wordsInTitle = TagsWordsInTitle.length > 0
      ? `(${TagsWordsInTitle.map(tag => `intitle:"${tag.text}"`).join(' OR ')})`
      : '';

    const wordsInUrl = TagsWordsInUrl.length > 0
      ? `(${TagsWordsInUrl.map(tag => `inurl:"${tag.text}"`).join(' OR ')})`
      : '';

    const queryParts = [sitesIncluded, excludeSites, fileTypes, wordsExcluded, wordsInTitle, wordsInUrl]
      .filter(part => part)
      .join(' ');

    return `${searchText.trim()} ${queryParts}`.trim();
  }, [TagsSites, TagsSitesToExclude, TagsWords, TagsFileType, TagsWordsInTitle, TagsWordsInUrl, searchText]);

  // Preview of the generated query
  const queryPreview = useMemo(() => buildQuery(), [buildQuery]);

  const deleteAllTags = useCallback(() => {
    setExampleTagsSites([])
    setExampleTagsWordsInUrl([])
    setExampleTagsWordsInTitle([])
    setExampleTagsWords([])
    setExampleTagsFileType([])
    setExampleTagsSitesToExclude([])
    toast({
      title: "Tags supprimés",
      description: "Tous les tags ont été supprimés avec succès.",
    });
  }, [toast]);

  const addToHistory = useCallback((query: string) => {
    const newEntry: SearchHistory = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
      searchEngine
    };
    
    setSearchHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep only 10 most recent
  }, [searchEngine]);

  const search = useCallback(() => {
    const queryString = buildQuery();
    
    if (!queryString.trim()) {
      toast({
        title: "Recherche vide",
        description: "Veuillez entrer au moins un terme de recherche.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
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
      addToHistory(queryString);
      
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
    } finally {
      setIsLoading(false);
    }
  }, [buildQuery, searchEngine, addToHistory, toast]);

  const copyQuery = useCallback(() => {
    navigator.clipboard.writeText(queryPreview).then(() => {
      toast({
        title: "Copié",
        description: "La requête a été copiée dans le presse-papiers.",
      });
    }).catch(() => {
      toast({
        title: "Erreur",
        description: "Impossible de copier la requête.",
        variant: "destructive"
      });
    });
  }, [queryPreview, toast]);

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

  const loadFromHistory = useCallback((historyItem: SearchHistory) => {
    // Parse the query to extract components (simplified implementation)
    setSearchText(historyItem.query);
    toast({
      title: "Recherche chargée",
      description: "La recherche de l'historique a été chargée.",
    });
  }, [toast]);

  const applySearchShortcut = useCallback((shortcut: any) => {
    // Apply shortcut query
    if (shortcut.query) {
      setSearchText(shortcut.query);
    }

    // Apply shortcut tags
    if (shortcut.tags) {
      if (shortcut.tags.sites) {
        const siteTags = shortcut.tags.sites.map((site: string) => ({ 
          id: Date.now().toString() + Math.random(), 
          text: site 
        }));
        setExampleTagsSites(prev => [...prev, ...siteTags]);
      }

      if (shortcut.tags.fileTypes) {
        const fileTypeTags = shortcut.tags.fileTypes.map((type: string) => ({ 
          id: Date.now().toString() + Math.random(), 
          text: type 
        }));
        setExampleTagsFileType(prev => [...prev, ...fileTypeTags]);
      }

      if (shortcut.tags.operators) {
        // Parse operators and apply them to appropriate fields
        shortcut.tags.operators.forEach((operator: string) => {
          if (operator.startsWith('intitle:')) {
            const title = operator.replace('intitle:', '').replace(/"/g, '');
            const titleTag = { id: Date.now().toString() + Math.random(), text: title };
            setExampleTagsWordsInTitle(prev => [...prev, titleTag]);
          } else if (operator.startsWith('inurl:')) {
            const url = operator.replace('inurl:', '').replace(/"/g, '');
            const urlTag = { id: Date.now().toString() + Math.random(), text: url };
            setExampleTagsWordsInUrl(prev => [...prev, urlTag]);
          } else if (operator.startsWith('-site:')) {
            const site = operator.replace('-site:', '');
            const siteTag = { id: Date.now().toString() + Math.random(), text: site };
            setExampleTagsSitesToExclude(prev => [...prev, siteTag]);
          }
        });
      }
    }

    // Switch to search view when applying shortcut
    setCurrentView('search');

    toast({
      title: "Raccourci appliqué",
      description: `Le raccourci "${shortcut.title}" a été appliqué avec succès.`,
    });
  }, [setSearchText, setExampleTagsSites, setExampleTagsFileType, setExampleTagsWordsInTitle, setExampleTagsWordsInUrl, setExampleTagsSitesToExclude, toast]);

  const applyQuickExample = useCallback((example: any) => {
    if (example.searchText) {
      setSearchText(example.searchText);
    }

    if (example.tags) {
      if (example.tags.sites) {
        const siteTags = example.tags.sites.map((site: string) => ({ 
          id: Date.now().toString() + Math.random(), 
          text: site 
        }));
        setExampleTagsSites(siteTags);
      }

      if (example.tags.fileTypes) {
        const fileTypeTags = example.tags.fileTypes.map((type: string) => ({ 
          id: Date.now().toString() + Math.random(), 
          text: type 
        }));
        setExampleTagsFileType(fileTypeTags);
      }

      if (example.tags.wordsInTitle) {
        const titleTags = example.tags.wordsInTitle.map((title: string) => ({ 
          id: Date.now().toString() + Math.random(), 
          text: title 
        }));
        setExampleTagsWordsInTitle(titleTags);
      }

      if (example.tags.wordsInUrl) {
        const urlTags = example.tags.wordsInUrl.map((url: string) => ({ 
          id: Date.now().toString() + Math.random(), 
          text: url 
        }));
        setExampleTagsWordsInUrl(urlTags);
      }
    }

    // Switch to search view when applying example
    setCurrentView('search');

    toast({
      title: "Exemple appliqué",
      description: "L'exemple de recherche a été configuré avec succès.",
    });
  }, [setSearchText, setExampleTagsSites, setExampleTagsFileType, setExampleTagsWordsInTitle, setExampleTagsWordsInUrl, toast]);

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
            {/* Home Statistics */}
            <HomeStats searchHistory={searchHistory} />
            
            {/* Quick Start Guide */}
            <QuickStartGuide onApplyExample={applyQuickExample} />
            
            {/* Feature Showcase */}
            <FeatureShowcase onStartTour={startTour} />
          </div>
        ) : (
          /* Search View */
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <header className="mb-8">
              <SearchBar 
                setSearchText={setSearchText} 
                searchText={searchText} 
                searchEngine={searchEngine}
                currentSearchData={{
                  searchText,
                  tags: {
                    sites: TagsSites.map(tag => tag.text),
                    excludeSites: TagsSitesToExclude.map(tag => tag.text),
                    fileTypes: TagsFileType.map(tag => tag.text),
                    wordsInTitle: TagsWordsInTitle.map(tag => tag.text),
                    wordsInUrl: TagsWordsInUrl.map(tag => tag.text),
                    excludeWords: TagsWords.map(tag => tag.text)
                  }
                }}
                onApplyAdvancedSearch={(searchData) => {
                  setSearchText(searchData.searchText || "");
                  if (searchData.tags) {
                    setExampleTagsSites(searchData.tags.sites?.map((text: string) => ({ id: Date.now().toString() + Math.random(), text })) || []);
                    setExampleTagsSitesToExclude(searchData.tags.excludeSites?.map((text: string) => ({ id: Date.now().toString() + Math.random(), text })) || []);
                    setExampleTagsFileType(searchData.tags.fileTypes?.map((text: string) => ({ id: Date.now().toString() + Math.random(), text })) || []);
                    setExampleTagsWordsInTitle(searchData.tags.wordsInTitle?.map((text: string) => ({ id: Date.now().toString() + Math.random(), text })) || []);
                    setExampleTagsWordsInUrl(searchData.tags.wordsInUrl?.map((text: string) => ({ id: Date.now().toString() + Math.random(), text })) || []);
                    setExampleTagsWords(searchData.tags.excludeWords?.map((text: string) => ({ id: Date.now().toString() + Math.random(), text })) || []);
                  }
                }}
              />
            </header>

            {/* Query Preview */}
            {queryPreview && (
              <div className="bg-muted/50 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">Aperçu de la requête:</h3>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={copyQuery}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => navigator.share?.({ text: queryPreview })}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <code className="text-sm bg-background p-2 rounded block overflow-x-auto">
                  {queryPreview}
                </code>
              </div>
            )}

            {/* Advanced Options Toggle */}
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="flex items-center gap-2"
              >
                Options avancées
                {showAdvancedOptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>

            {/* Advanced Search Options */}
            {showAdvancedOptions && (
              <div className="grid gap-4 space-y-2">
                <InputTags
                  id='websites'
                  placeholder='Sites à inclure (ex: example.com, .org)'
                  tags={TagsSites}
                  setTags={setExampleTagsSites}
                />

                <InputTags
                  id='site-toExclude'
                  placeholder='Sites à exclure (ex: site1.com, site2.com)'
                  tags={TagsSitesToExclude}
                  setTags={setExampleTagsSitesToExclude}
                />

                <InputTags
                  id='word-toExclude'
                  placeholder='Mots à exclure du texte (ex: publicité, spam)'
                  tags={TagsWords}
                  setTags={setExampleTagsWords}
                />

                <InputTags
                  id='filetypes'
                  placeholder="Types de fichiers (ex: pdf, docx, mp4, png)"
                  tags={TagsFileType}
                  setTags={setExampleTagsFileType}
                />

                <InputTags
                  id="intitle"
                  placeholder="Mots dans le titre (ex: guide, tutoriel)"
                  tags={TagsWordsInTitle}
                  setTags={setExampleTagsWordsInTitle}
                />

                <InputTags
                  id="inurl"
                  placeholder="Mots dans l'URL (ex: blog, article)"
                  tags={TagsWordsInUrl}
                  setTags={setExampleTagsWordsInUrl}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className='flex flex-wrap items-center gap-3 justify-center'>
              <Button 
                className="min-w-[120px]" 
                onClick={search}
                disabled={isLoading || !queryPreview.trim()}
                size="lg"
              >
                {isLoading ? "Recherche..." : "Rechercher"}
              </Button>
              <Button variant={'outline'} onClick={deleteAllTags}>
                <Trash2 className="h-4 w-4 mr-2" />
                Effacer tous les tags
              </Button>
              <Button variant={'outline'} onClick={copyQuery} disabled={!queryPreview.trim()}>
                <Copy className="h-4 w-4 mr-2" />
                Copier la requête
              </Button>
            </div>

            {/* Enhanced Search History */}
            <div className="flex justify-center mb-6">
              <EnhancedSearchHistory
                searchHistory={searchHistory}
                onLoadFromHistory={loadFromHistory}
                onClearHistory={clearHistory}
                onExportHistory={exportHistory}
                onUpdateHistory={setSearchHistory}
              />
            </div>

            {/* Smart Search Suggestions */}
            <div className="mb-8">
              <SmartSearchSuggestions onApplyShortcut={applySearchShortcut} />
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 mt-8">
          <DockBottom searchEngine={searchEngine} setSearchEngine={setSearchEngine} />
        </div>
      </div>
    </SettingApiProvider>
  )
}

export default App