import { useState, useCallback, useEffect, useMemo } from "react";
import { Search, Sparkles, Settings, Copy, Share2, Trash2, History, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useToast } from "../hooks/use-toast";
import { useSettingApi } from "../contexts/settingApi";
import { Tag } from "emblor";
import InputTags from "./input-tags";

interface UnifiedSearchProps {
  onSearch: (query: string) => void;
  onAddToHistory: (query: string) => void;
}

interface SearchData {
  searchText: string;
  tags: {
    sites: Tag[];
    excludeSites: Tag[];
    fileTypes: Tag[];
    wordsInTitle: Tag[];
    wordsInUrl: Tag[];
    excludeWords: Tag[];
  };
}

const searchPresets = [
  {
    id: "academic",
    name: "Recherche académique",
    icon: "🎓",
    searchText: "",
    tags: {
      sites: ["scholar.google.com", "arxiv.org", "researchgate.net"],
      excludeSites: ["wikipedia.org"],
      fileTypes: ["pdf"],
      wordsInTitle: ["research", "study"],
      wordsInUrl: ["paper", "article"],
      excludeWords: ["blog", "commercial"]
    }
  },
  {
    id: "code",
    name: "Code source",
    icon: "💻",
    searchText: "",
    tags: {
      sites: ["github.com", "gitlab.com", "stackoverflow.com"],
      excludeSites: [],
      fileTypes: ["py", "js", "ts", "java"],
      wordsInTitle: ["library", "framework"],
      wordsInUrl: ["repo", "code"],
      excludeWords: ["fork", "archived"]
    }
  },
  {
    id: "docs",
    name: "Documentation",
    icon: "📚",
    searchText: "",
    tags: {
      sites: ["docs.python.org", "developer.mozilla.org"],
      excludeSites: [],
      fileTypes: ["pdf", "md"],
      wordsInTitle: ["guide", "documentation", "tutorial"],
      wordsInUrl: ["docs", "help"],
      excludeWords: ["outdated", "deprecated"]
    }
  }
];

export function UnifiedSearch({ onSearch, onAddToHistory }: UnifiedSearchProps) {
  const { toast } = useToast();
  const { apikey, endpoint, modele, configured } = useSettingApi();

  // État unifié pour la recherche
  const [searchData, setSearchData] = useState<SearchData>({
    searchText: "",
    tags: {
      sites: [],
      excludeSites: [],
      fileTypes: [],
      wordsInTitle: [],
      wordsInUrl: [],
      excludeWords: []
    }
  });

  // État de l'interface
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("search");

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

  // Construire la requête de recherche
  const buildQuery = useCallback(() => {
    const { searchText, tags } = searchData;
    
    const sitesIncluded = tags.sites.length > 0
      ? `(${tags.sites.map(tag => `site:${tag.text}`).join(' OR ')})`
      : '';

    const excludeSites = tags.excludeSites.length > 0
      ? tags.excludeSites.map(tag => `-site:${tag.text}`).join(' ')
      : '';

    const wordsExcluded = tags.excludeWords.length > 0
      ? tags.excludeWords.map(tag => `-"${tag.text}"`).join(' ')
      : '';

    const fileTypes = tags.fileTypes.length > 0
      ? `(${tags.fileTypes.map(tag => `filetype:${tag.text}`).join(' OR ')})`
      : '';

    const wordsInTitle = tags.wordsInTitle.length > 0
      ? `(${tags.wordsInTitle.map(tag => `intitle:"${tag.text}"`).join(' OR ')})`
      : '';

    const wordsInUrl = tags.wordsInUrl.length > 0
      ? `(${tags.wordsInUrl.map(tag => `inurl:"${tag.text}"`).join(' OR ')})`
      : '';

    const queryParts = [sitesIncluded, excludeSites, fileTypes, wordsExcluded, wordsInTitle, wordsInUrl]
      .filter(part => part)
      .join(' ');

    return `${searchText.trim()} ${queryParts}`.trim();
  }, [searchData]);

  const queryPreview = useMemo(() => buildQuery(), [buildQuery]);

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
    setSearchData(prev => ({ ...prev, searchText: text }));
    generateSuggestions(text);
    setShowSuggestions(true);
  }, [generateSuggestions]);

  // Appliquer un preset
  const applyPreset = useCallback((preset: typeof searchPresets[0]) => {
    setSearchData({
      searchText: preset.searchText,
      tags: {
        sites: preset.tags.sites.map((site, index) => ({ id: `site-${index}`, text: site })),
        excludeSites: preset.tags.excludeSites.map((site, index) => ({ id: `exclude-site-${index}`, text: site })),
        fileTypes: preset.tags.fileTypes.map((type, index) => ({ id: `filetype-${index}`, text: type })),
        wordsInTitle: preset.tags.wordsInTitle.map((word, index) => ({ id: `title-${index}`, text: word })),
        wordsInUrl: preset.tags.wordsInUrl.map((word, index) => ({ id: `url-${index}`, text: word })),
        excludeWords: preset.tags.excludeWords.map((word, index) => ({ id: `exclude-word-${index}`, text: word }))
      }
    });
    setActiveTab("search");
    toast({
      title: "Preset appliqué",
      description: `Le preset "${preset.name}" a été appliqué.`,
    });
  }, [toast]);

  // Effacer tous les tags
  const clearAllTags = useCallback(() => {
    setSearchData(prev => ({
      ...prev,
      tags: {
        sites: [],
        excludeSites: [],
        fileTypes: [],
        wordsInTitle: [],
        wordsInUrl: [],
        excludeWords: []
      }
    }));
    toast({
      title: "Tags supprimés",
      description: "Tous les tags ont été supprimés.",
    });
  }, [toast]);

  // Recherche IA
  const executeAISearch = useCallback(async () => {
    if (!searchData.searchText.trim()) {
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
              "content": `Améliore cette recherche: ${searchData.searchText}`
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
  }, [searchData.searchText, configured, apikey, endpoint, modele, onSearch, onAddToHistory, toast]);

  // Recherche normale
  const executeSearch = useCallback(() => {
    const query = buildQuery();
    if (!query.trim()) {
      toast({
        title: "Recherche vide",
        description: "Veuillez entrer au moins un terme de recherche.",
        variant: "destructive"
      });
      return;
    }

    onSearch(query);
    onAddToHistory(query);
  }, [buildQuery, onSearch, onAddToHistory, toast]);

  // Copier la requête
  const copyQuery = useCallback(() => {
    navigator.clipboard.writeText(queryPreview).then(() => {
      toast({
        title: "Copié",
        description: "La requête a été copiée dans le presse-papiers.",
      });
    });
  }, [queryPreview, toast]);

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Interface de recherche principale */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {/* Barre de recherche */}
        <div className="relative">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Input
                  placeholder="Entrez votre recherche..."
                  value={searchData.searchText}
                  onChange={(e) => updateSearchText(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0.6 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </motion.div>
              
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

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                onClick={() => setShowAdvanced(!showAdvanced)}
                title="Options avancées"
                className="transition-all duration-200 hover:shadow-md"
              >
                <motion.div
                  animate={{ rotate: showAdvanced ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Settings className="h-4 w-4" />
                </motion.div>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={executeAISearch}
                disabled={isLoading || !searchData.searchText.trim() || !configured}
                className="min-w-[120px] transition-all duration-200 hover:shadow-md disabled:opacity-50"
              >
                <motion.div
                  animate={{ rotate: isLoading ? 360 : 0 }}
                  transition={{ duration: isLoading ? 1 : 0, repeat: isLoading ? Infinity : 0, ease: "linear" }}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                </motion.div>
                {isLoading ? "Génération..." : "Recherche IA"}
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={executeSearch}
                disabled={!queryPreview.trim()}
                variant="default"
                className="transition-all duration-200 hover:shadow-md disabled:opacity-50"
              >
                <Search className="mr-2 h-4 w-4" />
                Rechercher
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Aperçu de la requête */}
        <AnimatePresence>
          {queryPreview && (
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
                      onClick={() => navigator.share?.({ text: queryPreview })}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
              <code className="text-sm bg-background p-2 rounded block overflow-x-auto">
                {queryPreview}
              </code>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Options avancées */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div 
            className="border rounded-lg p-4 bg-muted/20"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="search">Recherche avancée</TabsTrigger>
                  <TabsTrigger value="presets">Presets rapides</TabsTrigger>
                </TabsList>

                <TabsContent value="search" className="space-y-4 mt-4">
                  <motion.div 
                    className="grid gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <Label className="text-sm font-medium mb-2 block">Sites à inclure</Label>
                      <InputTags
                        placeholder="ex: github.com, stackoverflow.com"
                        tags={searchData.tags.sites}
                        setTags={(newTags) => {
                          const tags = typeof newTags === 'function' ? newTags(searchData.tags.sites) : newTags;
                      setSearchData(prev => ({
                        ...prev,
                        tags: { ...prev.tags, sites: tags }
                      }));
                    }}
                  />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      <Label className="text-sm font-medium mb-2 block">Sites à exclure</Label>
                      <InputTags
                        placeholder="ex: wikipedia.org, blog.com"
                        tags={searchData.tags.excludeSites}
                        setTags={(newTags) => {
                          const tags = typeof newTags === 'function' ? newTags(searchData.tags.excludeSites) : newTags;
                          setSearchData(prev => ({
                            ...prev,
                            tags: { ...prev.tags, excludeSites: tags }
                          }));
                        }}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      <Label className="text-sm font-medium mb-2 block">Types de fichiers</Label>
                      <InputTags
                        placeholder="ex: pdf, docx, mp4"
                        tags={searchData.tags.fileTypes}
                        setTags={(newTags) => {
                          const tags = typeof newTags === 'function' ? newTags(searchData.tags.fileTypes) : newTags;
                          setSearchData(prev => ({
                            ...prev,
                        tags: { ...prev.tags, fileTypes: tags }
                      }));
                    }}
                  />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.3 }}
                    >
                      <Label className="text-sm font-medium mb-2 block">Mots dans le titre</Label>
                      <InputTags
                        placeholder="ex: guide, tutorial"
                        tags={searchData.tags.wordsInTitle}
                        setTags={(newTags) => {
                          const tags = typeof newTags === 'function' ? newTags(searchData.tags.wordsInTitle) : newTags;
                          setSearchData(prev => ({
                            ...prev,
                            tags: { ...prev.tags, wordsInTitle: tags }
                          }));
                        }}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.3 }}
                    >
                      <Label className="text-sm font-medium mb-2 block">Mots dans l'URL</Label>
                      <InputTags
                        placeholder="ex: blog, article"
                        tags={searchData.tags.wordsInUrl}
                        setTags={(newTags) => {
                          const tags = typeof newTags === 'function' ? newTags(searchData.tags.wordsInUrl) : newTags;
                          setSearchData(prev => ({
                            ...prev,
                            tags: { ...prev.tags, wordsInUrl: tags }
                          }));
                        }}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.3 }}
                    >
                      <Label className="text-sm font-medium mb-2 block">Mots à exclure</Label>
                      <InputTags
                        placeholder="ex: publicité, spam"
                        tags={searchData.tags.excludeWords}
                        setTags={(newTags) => {
                          const tags = typeof newTags === 'function' ? newTags(searchData.tags.excludeWords) : newTags;
                          setSearchData(prev => ({
                        ...prev,
                        tags: { ...prev.tags, excludeWords: tags }
                      }));
                        }}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.3 }}
                    >
                      <div className="flex justify-center pt-2">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button variant="outline" onClick={clearAllTags}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Effacer tous les tags
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="presets" className="space-y-4 mt-4">
                  <motion.div 
                    className="grid gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    {searchPresets.map((preset, index) => (
                      <motion.div 
                        key={preset.id} 
                        className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <motion.span 
                              className="text-2xl"
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              {preset.icon}
                            </motion.span>
                            <div>
                              <h4 className="font-medium">{preset.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {preset.tags.sites.length} sites, {preset.tags.fileTypes.length} types de fichiers
                              </p>
                            </div>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => applyPreset(preset)}
                            >
                              Appliquer
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}