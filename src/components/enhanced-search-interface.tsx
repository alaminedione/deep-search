import { useState, useCallback } from "react";
import { Search, Sparkles, Settings, Code2, Brain, History, Star, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { UnifiedSearch } from "./unified-search";
import { AdvancedSearch } from "./advanced-search";
import { GoogleDorkBuilder } from "./google-dork-builder";
import { GoogleDorkAI } from "./google-dork-ai";
import { EnhancedSearchHistory } from "./enhanced-search-history";
import { SmartSearchSuggestions } from "./smart-search-suggestions";

interface EnhancedSearchInterfaceProps {
  onSearch: (query: string) => void;
  onAddToHistory: (query: string) => void;
  searchHistory: any[];
  onLoadFromHistory: (historyItem: any) => void;
  onExportHistory: () => void;
  onClearHistory: () => void;
  onUpdateHistory: (updatedHistory: any[]) => void;
  onApplyShortcut: (shortcut: any) => void;
}

interface SearchData {
  searchText: string;
  tags: {
    sites: any[];
    excludeSites: any[];
    fileTypes: any[];
    wordsInTitle: any[];
    wordsInUrl: any[];
    excludeWords: any[];
  };
}

export function EnhancedSearchInterface({
  onSearch,
  onAddToHistory,
  searchHistory,
  onLoadFromHistory,
  onExportHistory,
  onClearHistory,
  onUpdateHistory,
  onApplyShortcut
}: EnhancedSearchInterfaceProps) {
  const [activeTab, setActiveTab] = useState("simple");
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [currentSearchData, setCurrentSearchData] = useState<SearchData>({
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

  const handleApplyAdvancedSearch = useCallback((searchData: SearchData) => {
    setCurrentSearchData(searchData);
  }, []);

  // Configuration simplifiée des onglets principaux
  const mainTabsConfig = [
    {
      value: "simple",
      label: "Recherche",
      icon: Search,
      description: "Recherche simple avec IA",
      primary: true
    },
    {
      value: "advanced",
      label: "Avancé",
      icon: Settings,
      description: "Filtres et options",
      primary: true
    }
  ];

  // Outils avancés regroupés
  const advancedToolsConfig = [
    {
      value: "builder",
      label: "Constructeur",
      icon: Code2,
      description: "Construction manuelle de Dorks"
    },
    {
      value: "history",
      label: "Historique",
      icon: History,
      description: "Gérer vos recherches"
    },
    {
      value: "suggestions",
      label: "Suggestions",
      icon: Star,
      description: "Raccourcis intelligents"
    }
  ];

  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* En-tête simplifié */}
      <div className="text-center space-y-3">
        <motion.h2 
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Interface de Recherche Avancée
        </motion.h2>
        <motion.p 
          className="text-muted-foreground max-w-2xl mx-auto text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Explorez toutes les possibilités de recherche avec nos outils spécialisés
        </motion.p>
      </div>

      {/* Interface principale */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm">
        <CardContent className="p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Navigation principale simplifiée */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <TabsList className="grid grid-cols-2 w-full lg:w-auto h-auto p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl">
                {mainTabsConfig.map((tab) => (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center justify-center p-4 h-auto data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-lg rounded-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-semibold">{tab.label}</div>
                        <div className="text-xs text-muted-foreground hidden sm:block">
                          {tab.description}
                        </div>
                      </div>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Bouton pour les outils avancés */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={showAdvancedTools ? "default" : "outline"}
                  onClick={() => setShowAdvancedTools(!showAdvancedTools)}
                  className="w-full lg:w-auto gap-2 h-12"
                >
                  <Sparkles className="h-4 w-4" />
                  Outils Avancés
                  <motion.div
                    animate={{ rotate: showAdvancedTools ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </Button>
              </motion.div>
            </div>

            {/* Outils avancés (collapsible) */}
            <AnimatePresence>
              {showAdvancedTools && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mb-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
                    {advancedToolsConfig.map((tool, index) => (
                      <motion.button
                        key={tool.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          setActiveTab(tool.value);
                          setShowAdvancedTools(false);
                        }}
                        className={`p-4 rounded-lg border transition-all duration-200 text-left hover:shadow-md hover:scale-105 ${
                          activeTab === tool.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <tool.icon className="h-5 w-5" />
                          <span className="font-medium text-sm">{tool.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {tool.description}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Contenu des onglets */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[400px]"
              >
                {/* Recherche Simple */}
                <TabsContent value="simple" className="mt-0">
                  <div className="space-y-8">
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                        <Search className="h-5 w-5" />
                        <h3 className="text-xl font-semibold">Recherche Simple et Rapide</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Interface simplifiée avec suggestions intelligentes et assistant IA intégré
                      </p>
                    </div>

                    {/* Assistant IA intégré */}
                    <div className="space-y-4">
                      <div className="text-center space-y-3">
                        <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                          <Brain className="h-5 w-5" />
                          <h4 className="text-lg font-semibold">🤖 Assistant IA - Traducteur Google Dork</h4>
                        </div>
                        <div className="max-w-4xl mx-auto">
                          <p className="text-muted-foreground mb-3">
                            <strong>Vous ne connaissez pas les opérateurs Google Dork ?</strong> Pas de problème ! 
                            Posez simplement votre question en français et l'IA la traduira automatiquement.
                          </p>
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                            <span className="flex items-center gap-1">
                              <span className="text-green-500">✅</span>
                              <strong>Vous dites:</strong> "Je veux des PDF gratuits"
                            </span>
                            <span className="hidden sm:block">→</span>
                            <span className="flex items-center gap-1">
                              <span className="text-blue-500">🤖</span>
                              <strong>IA génère:</strong> <code className="bg-white dark:bg-gray-700 px-2 py-1 rounded text-xs">filetype:pdf free</code>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl p-6">
                        <GoogleDorkAI onQueryGenerated={onSearch} />
                      </div>
                    </div>

                    {/* Séparateur */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">ou</span>
                      </div>
                    </div>

                    {/* Recherche classique */}
                    <div className="space-y-4">
                      <div className="text-center space-y-2">
                        <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400">Recherche Classique</h4>
                        <p className="text-muted-foreground">
                          Recherche traditionnelle avec suggestions intelligentes
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6">
                        <UnifiedSearch 
                          onSearch={onSearch}
                          onAddToHistory={onAddToHistory}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Recherche Avancée */}
                <TabsContent value="advanced" className="mt-0">
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400">
                        <Settings className="h-5 w-5" />
                        <h3 className="text-xl font-semibold">Recherche Avancée avec Filtres</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Filtres détaillés, presets personnalisés et options avancées
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-6">
                      <AdvancedSearch
                        onApplySearch={handleApplyAdvancedSearch}
                        currentSearchData={currentSearchData}
                        isEmbedded={true}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Constructeur */}
                <TabsContent value="builder" className="mt-0">
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400">
                        <Code2 className="h-5 w-5" />
                        <h3 className="text-xl font-semibold">Constructeur Google Dorks</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Construction manuelle et précise de requêtes Google Dorks avancées
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl p-6">
                      <GoogleDorkBuilder onQueryGenerated={onSearch} />
                    </div>
                  </div>
                </TabsContent>

                {/* Historique */}
                <TabsContent value="history" className="mt-0">
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                        <History className="h-5 w-5" />
                        <h3 className="text-xl font-semibold">Historique des Recherches</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Gérez, organisez et réutilisez vos recherches précédentes
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 rounded-xl p-6">
                      <EnhancedSearchHistory
                        searchHistory={searchHistory}
                        onLoadFromHistory={onLoadFromHistory}
                        onExportHistory={onExportHistory}
                        onClearHistory={onClearHistory}
                        onUpdateHistory={onUpdateHistory}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Suggestions */}
                <TabsContent value="suggestions" className="mt-0">
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400">
                        <Star className="h-5 w-5" />
                        <h3 className="text-xl font-semibold">Suggestions Intelligentes</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Raccourcis de recherche et suggestions basées sur vos habitudes
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 rounded-xl p-6">
                      <SmartSearchSuggestions onApplyShortcut={onApplyShortcut} />
                    </div>
                  </div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>

          {/* Indicateur de statut */}
          <motion.div 
            className="mt-8 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Badge variant="outline" className="px-4 py-2 text-sm">
              <Sparkles className="h-3 w-3 mr-2" />
              {activeTab === "simple" ? "Mode Simple avec Assistant IA" : 
               activeTab === "advanced" ? "Mode Avancé" :
               activeTab === "builder" ? "Constructeur" :
               activeTab === "history" ? "Historique" :
               "Suggestions"}
            </Badge>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}