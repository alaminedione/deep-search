import { Loader2, Sparkles, History, TrendingUp, Settings } from "lucide-react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast"
import { SearchBarProps } from "../types";
import { useSettingApi } from "../contexts/settingApi";
import { AdvancedSearch } from "./advanced-search";

export function SearchBar({ setSearchText, searchText, searchEngine, currentSearchData, onApplyAdvancedSearch }: SearchBarProps) {
  const { apikey, endpoint, modele, configured } = useSettingApi()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem("searchTermHistory");
    if (storedHistory) {
      try {
        setSearchHistory(JSON.parse(storedHistory));
      } catch (error) {
        console.error("Error loading search history:", error);
      }
    }
  }, []);

  // Save search term to history
  const addToSearchHistory = useCallback((term: string) => {
    if (term.trim()) {
      setSearchHistory(prev => {
        const newHistory = [term, ...prev.filter(h => h !== term)].slice(0, 10);
        localStorage.setItem("searchTermHistory", JSON.stringify(newHistory));
        return newHistory;
      });
    }
  }, []);

  // Generate suggestions based on input
  const generateSuggestions = useCallback((input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const commonSearchTerms = [
      "tutorial", "guide", "documentation", "example", "template",
      "framework", "library", "api", "github", "stackoverflow",
      "python", "javascript", "react", "nodejs", "machine learning",
      "artificial intelligence", "data science", "web development",
      "mobile development", "cybersecurity", "blockchain", "cloud computing"
    ];

    const historyMatches = searchHistory.filter(term => 
      term.toLowerCase().includes(input.toLowerCase())
    );

    const termMatches = commonSearchTerms.filter(term => 
      term.toLowerCase().includes(input.toLowerCase())
    );

    const allSuggestions = [...historyMatches, ...termMatches]
      .filter((term, index, arr) => arr.indexOf(term) === index)
      .slice(0, 8);

    setSuggestions(allSuggestions);
  }, [searchHistory]);

  // Handle input change with suggestions
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    generateSuggestions(value);
    setShowSuggestions(true);
    setSelectedSuggestionIndex(-1);
  }, [setSearchText, generateSuggestions]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          setSearchText(suggestions[selectedSuggestionIndex]);
          setShowSuggestions(false);
          addToSearchHistory(suggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  }, [showSuggestions, suggestions, selectedSuggestionIndex, setSearchText, addToSearchHistory]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchText(suggestion);
    setShowSuggestions(false);
    addToSearchHistory(suggestion);
  }, [setSearchText, addToSearchHistory]);

  const placeholders = [
    "Recherchez avec l'IA ou les opérateurs Dorks...",
    "Essayez: 'tutoriels python filetype:pdf'",
    "Exemple: 'site:github.com machine learning'",
    "Recherche académique: 'site:scholar.google.com'",
    "Documents: 'intitle:\"guide\" filetype:pdf'",
    "Code source: 'site:github.com language:python'",
    "Actualités: 'after:2023-01-01 before:2024-01-01'",
    "Recherche avancée avec Deep Search",
  ];

  const fetchQuery = useCallback(async (query: string) => {
    if (!apikey || !endpoint) {
      toast({
        title: "Configuration manquante",
        description: "Veuillez configurer votre API dans les paramètres.",
        variant: "destructive"
      });
      return null;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apikey}`,
          "X-Title": "Deep-Search",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": modele,
          "messages": [
            {
              "role": "system",
              "content": "Tu es un expert en opérateurs Google Dorks avec une connaissance approfondie de tous les opérateurs disponibles. Analyse la requête utilisateur et génère une requête de recherche optimisée en utilisant les opérateurs Google Dorks les plus appropriés. \n\nOpérateurs disponibles: site:, filetype:, ext:, intext:, intitle:, inurl:, allintext:, allintitle:, allinurl:, inanchor:, allinanchor:, link:, related:, cache:, info:, before:, after:, daterange:, numrange:, location:, source:, define:, stocks:, weather:, map:, movie:, group:, insubject:, msgid:, blogurl:, NEAR:, et les opérateurs de sécurité pour l'audit.\n\nConsidère également les combinaisons avec les opérateurs logiques (OR, AND, NOT) et les exclusions (-). Réponds uniquement avec la requête optimisée, sans explications."
            },
            {
              "role": "user",
              "content": `Améliore cette recherche avec des opérateurs Google Dorks appropriés: ${query}`
            }
          ],
          "max_tokens": 200,
          "temperature": 0.2
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Délai d\'attente dépassé');
        }
        throw error;
      }
      throw new Error('Erreur inconnue');
    }
  }, [apikey, endpoint, modele, toast]);

  const executeAISearch = useCallback(async () => {
    if (!searchText.trim()) {
      toast({
        title: "Champ de recherche vide",
        description: "Veuillez entrer votre recherche avant de continuer.",
        variant: "destructive"
      });
      return;
    }

    if (!configured) {
      toast({
        title: "Configuration requise",
        description: "Configurez votre API en cliquant sur le bouton API en bas de page.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    addToSearchHistory(searchText); // Add to history before processing

    try {
      const data = await fetchQuery(searchText);
      
      if (!data) return;

      let content = '';
      
      // Handle different API response formats
      if (data.choices && data.choices.length > 0) {
        content = data.choices[0]?.message?.content;
      } else if (data.message && data.message.content) {
        content = data.message.content;
      } else if (typeof data === 'string') {
        content = data;
      }

      if (!content) {
        throw new Error('Aucun contenu reçu de l\'API');
      }

      // Clean up the content
      content = content.trim().replace(/^["']|["']$/g, '');
      
      const encodedContent = encodeURIComponent(content);
      let searchUrl = '';

      if (searchEngine === 'google.com') {
        searchUrl = `https://www.google.com/search?q=${encodedContent}`;
      } else if (searchEngine === 'duckduckgo.com') {
        searchUrl = `https://duckduckgo.com/?q=${encodedContent}`;
      } else {
        throw new Error("Moteur de recherche non pris en charge");
      }

      window.open(searchUrl, '_blank');
      
      toast({
        title: "Recherche IA lancée",
        description: `Requête optimisée: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
      });

      setSearchText(""); // Clear after successful search
      setShowSuggestions(false);

    } catch (error) {
      console.error("AI Search error:", error);
      
      let errorMessage = "Une erreur est survenue lors de la recherche IA.";
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = "Clé API invalide. Vérifiez votre configuration.";
        } else if (error.message.includes('403')) {
          errorMessage = "Accès refusé. Vérifiez vos permissions API.";
        } else if (error.message.includes('429')) {
          errorMessage = "Limite de taux atteinte. Attendez un moment.";
        } else if (error.message.includes('timeout') || error.message.includes('Délai')) {
          errorMessage = "Délai d'attente dépassé. Réessayez.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Erreur de recherche IA",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [searchText, configured, fetchQuery, searchEngine, toast, setSearchText, addToSearchHistory]);

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowSuggestions(false);
    executeAISearch();
  }, [executeAISearch]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 space-y-4">
      {/* Main Search Interface */}
      <div className="flex justify-center gap-3 items-center">
        <div className="flex-1 max-w-2xl relative" ref={suggestionRef}>
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleInputChange}
            onSubmit={onSubmit}
            onKeyDown={handleKeyDown}
          />
          
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  className={`px-4 py-2 cursor-pointer transition-colors ${
                    index === selectedSuggestionIndex 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                      : 'hover:bg-gray-50 dark:hover:bg-zinc-700'
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center gap-2">
                    {searchHistory.includes(suggestion) ? (
                      <History className="h-4 w-4 text-gray-400" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm">{suggestion}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="lg"
            onClick={() => setShowAdvanced(!showAdvanced)}
            title="Options de recherche avancée"
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Button 
            className="min-w-[140px]" 
            onClick={executeAISearch}
            disabled={isSubmitting || !searchText.trim() || !configured}
            title={!configured ? 'Configurez votre API d\'abord' : 'Générer une requête optimisée avec l\'IA'}
            size="lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              'Recherche IA'
            )}
          </Button>
        </div>
      </div>

      {/* Advanced Search Panel */}
      {showAdvanced && (
        <div className="border rounded-lg bg-gray-50 dark:bg-zinc-900 p-4">
          <AdvancedSearch 
            onApplySearch={(searchData) => {
              if (onApplyAdvancedSearch) {
                onApplyAdvancedSearch(searchData);
              }
              setShowAdvanced(false); // Close panel after applying
            }}
            currentSearchData={currentSearchData || {
              searchText,
              tags: {}
            }}
            isEmbedded={true}
          />
        </div>
      )}
    </div>
  );
}