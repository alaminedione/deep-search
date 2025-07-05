import { useState, useCallback, useEffect } from "react";
import { Search, Sparkles, Copy, Share2, History, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "../hooks/use-toast";
import { useSettingApi } from "../contexts/settingApi";

interface UnifiedSearchProps {
  onSearch: (query: string) => void;
  onAddToHistory: (query: string) => void;
}

export function UnifiedSearch({ onSearch, onAddToHistory }: UnifiedSearchProps) {
  const { toast } = useToast();
  const { apikey, endpoint, modele, configured } = useSettingApi();

  // État de recherche
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Charger l'historique depuis localStorage
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

  // Générer des suggestions
  const generateSuggestions = useCallback((input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const commonTerms = [
      "tutorial", "guide", "documentation", "example", "template",
      "python", "javascript", "react", "machine learning", "api"
    ];

    const historyMatches = searchHistory.filter(term => 
      term.toLowerCase().includes(input.toLowerCase())
    );

    const termMatches = commonTerms.filter(term => 
      term.toLowerCase().includes(input.toLowerCase())
    );

    const allSuggestions = [...historyMatches, ...termMatches]
      .filter((term, index, arr) => arr.indexOf(term) === index)
      .slice(0, 6);

    setSuggestions(allSuggestions);
  }, [searchHistory]);

  // Mettre à jour le texte de recherche
  const updateSearchText = useCallback((text: string) => {
    setSearchText(text);
    generateSuggestions(text);
    setShowSuggestions(true);
  }, [generateSuggestions]);

  // Recherche IA
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
        description: "Configurez votre API dans les paramètres.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apikey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": modele,
          "messages": [
            {
              "role": "system",
              "content": "Tu es un expert en opérateurs Google Dorks. Génère une requête optimisée avec les opérateurs appropriés. Réponds uniquement avec la requête."
            },
            {
              "role": "user",
              "content": `Améliore cette recherche: ${searchText}`
            }
          ],
          "max_tokens": 200,
          "temperature": 0.2
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content || data.message?.content || "";
      content = content.trim().replace(/^["']|["']$/g, '');

      if (content) {
        onSearch(content);
        onAddToHistory(content);
        
        toast({
          title: "Recherche IA lancée",
          description: `Requête optimisée: "${content.substring(0, 50)}..."`,
        });
        
        setSearchText("");
        setShowSuggestions(false);
      }
    } catch (error) {
      toast({
        title: "Erreur de recherche IA",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [searchText, configured, apikey, endpoint, modele, onSearch, onAddToHistory, toast]);

  // Recherche normale
  const executeSearch = useCallback(() => {
    if (!searchText.trim()) {
      toast({
        title: "Recherche vide",
        description: "Veuillez entrer au moins un terme de recherche.",
        variant: "destructive"
      });
      return;
    }

    onSearch(searchText);
    onAddToHistory(searchText);
    setSearchText("");
    setShowSuggestions(false);
  }, [searchText, onSearch, onAddToHistory, toast]);

  // Copier la requête
  const copyQuery = useCallback(() => {
    navigator.clipboard.writeText(searchText).then(() => {
      toast({
        title: "Copié",
        description: "La requête a été copiée dans le presse-papiers.",
      });
    });
  }, [searchText, toast]);

  return (
    <motion.div 
      className="w-full space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Interface de recherche principale */}
      <div className="space-y-4">
        {/* Barre de recherche améliorée */}
        <div className="relative">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Entrez votre recherche..."
                value={searchText}
                onChange={(e) => updateSearchText(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="h-12 text-base pr-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 focus:border-primary/50 transition-all duration-200"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              
              {/* Suggestions */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div 
                    className="absolute top-full left-0 right-0 bg-white dark:bg-zinc-800 border rounded-lg shadow-lg z-50 mt-1"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                        whileHover={{ x: 4 }}
                        onClick={() => {
                          updateSearchText(suggestion);
                          setShowSuggestions(false);
                        }}
                      >
                        {searchHistory.includes(suggestion) ? (
                          <History className="h-4 w-4 text-gray-400" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-sm">{suggestion}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              onClick={executeAISearch}
              disabled={isLoading || !searchText.trim() || !configured}
              className="h-12 min-w-[140px] gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:shadow-lg disabled:opacity-50"
            >
              <motion.div
                animate={{ rotate: isLoading ? 360 : 0 }}
                transition={{ duration: isLoading ? 1 : 0, repeat: isLoading ? Infinity : 0, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
              {isLoading ? "Génération..." : "Recherche IA"}
            </Button>

            <Button
              onClick={executeSearch}
              disabled={!searchText.trim()}
              variant="default"
              className="h-12 px-6 gap-2 transition-all duration-200 hover:shadow-md disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              Rechercher
            </Button>
          </div>
        </div>

        {/* Aperçu de la requête */}
        <AnimatePresence>
          {searchText && (
            <motion.div 
              className="bg-muted/50 rounded-lg p-4 border"
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm">Aperçu de la requête:</h3>
                <div className="flex gap-2">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button variant="ghost" size="sm" onClick={copyQuery}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigator.share?.({ text: searchText })}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
              <code className="text-sm bg-background p-2 rounded block overflow-x-auto">
                {searchText}
              </code>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}