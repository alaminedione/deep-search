import { useState, useCallback } from "react";
import { Search, Sparkles, Settings, Code2, Brain, History, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
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

  const tabsConfig = [
    {
      value: "simple",
      label: "Recherche Simple",
      icon: Search,
      description: "Recherche rapide avec suggestions intelligentes",
      color: "blue"
    },
    {
      value: "advanced",
      label: "Recherche Avancée",
      icon: Settings,
      description: "Filtres avancés et presets personnalisés",
      color: "purple"
    },
    {
      value: "ai",
      label: "Assistant IA",
      icon: Brain,
      description: "Optimisation automatique avec IA",
      color: "green"
    },
    {
      value: "builder",
      label: "Constructeur Dorks",
      icon: Code2,
      description: "Construction manuelle de requêtes Google Dorks",
      color: "orange"
    },
    {
      value: "history",
      label: "Historique",
      icon: History,
      description: "Gérer et réutiliser vos recherches",
      color: "gray"
    },
    {
      value: "suggestions",
      label: "Suggestions",
      icon: Star,
      description: "Raccourcis et suggestions intelligentes",
      color: "yellow"
    }
  ];

  const getTabIcon = (IconComponent: any, color: string) => (
    <IconComponent className={`h-4 w-4 mr-2 text-${color}-500`} />
  );

  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Interface de Recherche Avancée
              </CardTitle>
              <CardDescription className="mt-2">
                Explorez toutes les possibilités de recherche avec nos outils spécialisés
              </CardDescription>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge variant="outline" className="px-3 py-1">
                <Sparkles className="h-3 w-3 mr-1" />
                Powered by AI
              </Badge>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Navigation des onglets avec design amélioré */}
            <div className="relative mb-8">
              <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl">
                {tabsConfig.map((tab, index) => (
                  <motion.div
                    key={tab.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <TabsTrigger 
                      value={tab.value}
                      className="flex flex-col items-center justify-center p-3 h-auto data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-md rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      <div className="flex items-center mb-1">
                        {getTabIcon(tab.icon, tab.color)}
                        <span className="font-medium text-sm">{tab.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground text-center leading-tight">
                        {tab.description}
                      </span>
                    </TabsTrigger>
                  </motion.div>
                ))}
              </TabsList>
            </div>

            {/* Contenu des onglets avec animations */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Onglet Recherche Simple */}
                <TabsContent value="simple" className="mt-0">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg">
                        <Search className="h-5 w-5 mr-2 text-blue-500" />
                        Recherche Simple et Rapide
                      </CardTitle>
                      <CardDescription>
                        Interface simplifiée avec suggestions intelligentes et recherche IA
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <UnifiedSearch 
                        onSearch={onSearch}
                        onAddToHistory={onAddToHistory}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Onglet Recherche Avancée */}
                <TabsContent value="advanced" className="mt-0">
                  <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg">
                        <Settings className="h-5 w-5 mr-2 text-purple-500" />
                        Recherche Avancée avec Filtres
                      </CardTitle>
                      <CardDescription>
                        Filtres détaillés, presets personnalisés et options avancées
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AdvancedSearch
                        onApplySearch={handleApplyAdvancedSearch}
                        currentSearchData={currentSearchData}
                        isEmbedded={true}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Onglet Assistant IA */}
                <TabsContent value="ai" className="mt-0">
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg">
                        <Brain className="h-5 w-5 mr-2 text-green-500" />
                        Assistant IA pour Google Dorks
                      </CardTitle>
                      <CardDescription>
                        Génération automatique de requêtes optimisées par intelligence artificielle
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <GoogleDorkAI onQueryGenerated={onSearch} />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Onglet Constructeur */}
                <TabsContent value="builder" className="mt-0">
                  <Card className="border-l-4 border-l-orange-500">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg">
                        <Code2 className="h-5 w-5 mr-2 text-orange-500" />
                        Constructeur Google Dorks
                      </CardTitle>
                      <CardDescription>
                        Construction manuelle et précise de requêtes Google Dorks avancées
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <GoogleDorkBuilder onQueryGenerated={onSearch} />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Onglet Historique */}
                <TabsContent value="history" className="mt-0">
                  <Card className="border-l-4 border-l-gray-500">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg">
                        <History className="h-5 w-5 mr-2 text-gray-500" />
                        Historique des Recherches
                      </CardTitle>
                      <CardDescription>
                        Gérez, organisez et réutilisez vos recherches précédentes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <EnhancedSearchHistory
                        searchHistory={searchHistory}
                        onLoadFromHistory={onLoadFromHistory}
                        onExportHistory={onExportHistory}
                        onClearHistory={onClearHistory}
                        onUpdateHistory={onUpdateHistory}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Onglet Suggestions */}
                <TabsContent value="suggestions" className="mt-0">
                  <Card className="border-l-4 border-l-yellow-500">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center text-lg">
                        <Star className="h-5 w-5 mr-2 text-yellow-500" />
                        Suggestions Intelligentes
                      </CardTitle>
                      <CardDescription>
                        Raccourcis de recherche et suggestions basées sur vos habitudes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SmartSearchSuggestions onApplyShortcut={onApplyShortcut} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>

          {/* Indicateur de tab actif */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Badge variant="secondary" className="px-4 py-2">
              {tabsConfig.find(tab => tab.value === activeTab)?.label} - {tabsConfig.find(tab => tab.value === activeTab)?.description}
            </Badge>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}