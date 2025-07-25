import { useState, useCallback, useMemo } from "react";
import { Clock, Star, Trash2, Download, Upload, Copy, ExternalLink, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { useToast } from "../hooks/use-toast";
import { TSearchEngine } from "../types";

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

interface EnhancedSearchHistoryProps {
  searchHistory: SearchHistory[];
  onLoadFromHistory: (historyItem: SearchHistory) => void;
  onClearHistory: () => void;
  onExportHistory: () => void;
  onUpdateHistory: (updatedHistory: SearchHistory[]) => void;
}

const categories = [
  "Recherche générale",
  "Recherche académique", 
  "Développement",
  "Documentation",
  "Actualités",
  "Ressources",
  "Autre"
];

export function SearchHistory({ 
  searchHistory, 
  onLoadFromHistory, 
  onClearHistory, 
  onExportHistory,
  onUpdateHistory 
}: EnhancedSearchHistoryProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedEngine, setSelectedEngine] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "frequency" | "alphabetical">("date");
  const [dateRange, setDateRange] = useState<"all" | "today" | "week" | "month">("all");

  // Enhanced filtering and sorting
  const filteredAndSortedHistory = useMemo(() => {
    let filtered = searchHistory.filter(item => {
      // Text filter
      const matchesText = !filterText || 
        item.query.toLowerCase().includes(filterText.toLowerCase()) ||
        item.notes?.toLowerCase().includes(filterText.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

      // Engine filter
      const matchesEngine = selectedEngine === "all" || item.searchEngine === selectedEngine;

      // Favorites filter
      const matchesFavorites = !showFavoritesOnly || item.isFavorite;

      // Date range filter
      const now = new Date();
      let matchesDate = true;
      
      if (dateRange === "today") {
        matchesDate = item.timestamp.toDateString() === now.toDateString();
      } else if (dateRange === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = item.timestamp >= weekAgo;
      } else if (dateRange === "month") {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = item.timestamp >= monthAgo;
      }

      return matchesText && matchesCategory && matchesEngine && matchesFavorites && matchesDate;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return a.query.localeCompare(b.query);
        case "frequency":
          // Count occurrences of similar queries
          const aCount = searchHistory.filter(h => h.query === a.query).length;
          const bCount = searchHistory.filter(h => h.query === b.query).length;
          return bCount - aCount;
        case "date":
        default:
          return b.timestamp.getTime() - a.timestamp.getTime();
      }
    });

    return filtered;
  }, [searchHistory, filterText, selectedCategory, selectedEngine, showFavoritesOnly, sortBy, dateRange]);

  // Statistics
  const stats = useMemo(() => {
    const totalSearches = searchHistory.length;
    const favoritesCount = searchHistory.filter(h => h.isFavorite).length;
    const uniqueQueries = new Set(searchHistory.map(h => h.query)).size;
    const mostUsedEngine = searchHistory.reduce((acc, h) => {
      acc[h.searchEngine] = (acc[h.searchEngine] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topEngine = Object.entries(mostUsedEngine).sort(([,a], [,b]) => b - a)[0];

    return {
      totalSearches,
      favoritesCount,
      uniqueQueries,
      mostUsedEngine: topEngine ? topEngine[0] : "Aucun"
    };
  }, [searchHistory]);

  const toggleFavorite = useCallback((itemId: string) => {
    const updatedHistory = searchHistory.map(item => 
      item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
    );
    onUpdateHistory(updatedHistory);
    
    toast({
      title: "Favori mis à jour",
      description: "Le statut favori a été modifié.",
    });
  }, [searchHistory, onUpdateHistory, toast]);

  const updateCategory = useCallback((itemId: string, category: string) => {
    const updatedHistory = searchHistory.map(item => 
      item.id === itemId ? { ...item, category } : item
    );
    onUpdateHistory(updatedHistory);
    
    toast({
      title: "Catégorie mise à jour",
      description: "La catégorie a été modifiée.",
    });
  }, [searchHistory, onUpdateHistory, toast]);

  const updateNotes = useCallback((itemId: string, notes: string) => {
    const updatedHistory = searchHistory.map(item => 
      item.id === itemId ? { ...item, notes } : item
    );
    onUpdateHistory(updatedHistory);
  }, [searchHistory, onUpdateHistory]);

  const deleteHistoryItem = useCallback((itemId: string) => {
    const updatedHistory = searchHistory.filter(item => item.id !== itemId);
    onUpdateHistory(updatedHistory);
    
    toast({
      title: "Élément supprimé",
      description: "L'élément a été supprimé de l'historique.",
    });
  }, [searchHistory, onUpdateHistory, toast]);

  const copyQuery = useCallback((query: string) => {
    navigator.clipboard.writeText(query).then(() => {
      toast({
        title: "Copié",
        description: "La requête a été copiée dans le presse-papiers.",
      });
    });
  }, [toast]);

  const openSearch = useCallback((item: SearchHistory) => {
    const encodedQuery = encodeURIComponent(item.query);
    let searchUrl = '';

    if (item.searchEngine === 'google.com') {
      searchUrl = `https://www.google.com/search?q=${encodedQuery}`;
    } else if (item.searchEngine === 'duckduckgo.com') {
      searchUrl = `https://duckduckgo.com/?q=${encodedQuery}`;
    }

    if (searchUrl) {
      window.open(searchUrl, '_blank');
    }
  }, []);

  const importHistory = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedHistory = JSON.parse(e.target?.result as string);
        const validHistory = importedHistory.filter((item: any) => 
          item.id && item.query && item.timestamp
        ).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
          id: `imported-${item.id}-${Date.now()}` // Avoid ID conflicts
        }));

        onUpdateHistory([...searchHistory, ...validHistory]);
        
        toast({
          title: "Historique importé",
          description: `${validHistory.length} éléments ont été importés avec succès.`,
        });
      } catch (error) {
        toast({
          title: "Erreur d'importation",
          description: "Le fichier n'est pas valide.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  }, [searchHistory, onUpdateHistory, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Clock className="h-4 w-4 mr-2" />
          Historique avancé ({searchHistory.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historique de recherche avancé
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalSearches}</div>
              <div className="text-sm text-muted-foreground">Recherches totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.favoritesCount}</div>
              <div className="text-sm text-muted-foreground">Favoris</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.uniqueQueries}</div>
              <div className="text-sm text-muted-foreground">Requêtes uniques</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{stats.mostUsedEngine}</div>
              <div className="text-sm text-muted-foreground">Moteur préféré</div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={onExportHistory}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Importer
                  </span>
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={importHistory}
                  className="hidden"
                />
              </label>
              <Button variant="outline" size="sm" onClick={onClearHistory}>
                <Trash2 className="h-4 w-4 mr-2" />
                Effacer tout
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="search-filter">Rechercher</Label>
                <Input
                  id="search-filter"
                  placeholder="Filtrer..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="category-filter">Catégorie</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="engine-filter">Moteur</Label>
                <Select value={selectedEngine} onValueChange={setSelectedEngine}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="google.com">Google</SelectItem>
                    <SelectItem value="duckduckgo.com">DuckDuckGo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort-filter">Trier par</Label>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="alphabetical">Alphabétique</SelectItem>
                    <SelectItem value="frequency">Fréquence</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date-filter">Période</Label>
                <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tout</SelectItem>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="favorites-only"
                    checked={showFavoritesOnly}
                    onCheckedChange={(checked) => setShowFavoritesOnly(checked === true)}
                  />
                  <Label htmlFor="favorites-only" className="text-sm">Favoris</Label>
                </div>
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                Résultats ({filteredAndSortedHistory.length})
              </h3>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredAndSortedHistory.map((item) => (
                <Accordion key={item.id} type="single" collapsible>
                  <AccordionItem value={item.id} className="border rounded-lg">
                    <AccordionTrigger className="px-4 py-2 hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {item.isFavorite && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current shrink-0" />
                          )}
                          <code className="text-sm truncate flex-1 text-left">
                            {item.query}
                          </code>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0 ml-2">
                          <Calendar className="h-3 w-3" />
                          {item.timestamp.toLocaleDateString()}
                          <span className="px-2 py-1 bg-muted rounded text-xs">
                            {item.searchEngine}
                          </span>
                          <span className="px-2 py-1 bg-muted rounded text-xs">
                            Recherché {searchHistory.filter(h => h.query === item.query).length} fois
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onLoadFromHistory(item)}
                          >
                            Charger
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyQuery(item.query)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openSearch(item)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Ouvrir
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleFavorite(item.id)}
                          >
                            <Star className={`h-4 w-4 mr-1 ${item.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
                            {item.isFavorite ? 'Retirer' : 'Favori'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteHistoryItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`category-${item.id}`} className="text-sm">
                              Catégorie
                            </Label>
                            <Select
                              value={item.category || "Recherche générale"}
                              onValueChange={(value) => updateCategory(item.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(cat => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor={`notes-${item.id}`} className="text-sm">
                              Notes
                            </Label>
                            <Input
                              id={`notes-${item.id}`}
                              placeholder="Ajouter des notes..."
                              value={item.notes || ""}
                              onChange={(e) => updateNotes(item.id, e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
              
              {filteredAndSortedHistory.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun résultat trouvé pour les filtres appliqués.
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}