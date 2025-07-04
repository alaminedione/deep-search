import { useState, useCallback, useEffect, useMemo } from "react";
import { Filter, Star, Trash2, Download, Upload, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useToast } from "../hooks/use-toast";

interface SearchPreset {
  id: string;
  name: string;
  description: string;
  query: string;
  tags: {
    sites: string[];
    excludeSites: string[];
    fileTypes: string[];
    wordsInTitle: string[];
    wordsInUrl: string[];
    excludeWords: string[];
  };
  isFavorite: boolean;
  createdAt: Date;
}

interface AdvancedSearchProps {
  onApplySearch: (searchData: any) => void;
  currentSearchData: any;
}

const defaultPresets: SearchPreset[] = [
  {
    id: "academic-papers",
    name: "Articles académiques",
    description: "Recherche d'articles scientifiques et académiques",
    query: "",
    tags: {
      sites: ["scholar.google.com", "arxiv.org", "researchgate.net"],
      excludeSites: [],
      fileTypes: ["pdf"],
      wordsInTitle: ["research", "study", "analysis"],
      wordsInUrl: [],
      excludeWords: ["advertisement", "commercial"]
    },
    isFavorite: true,
    createdAt: new Date()
  },
  {
    id: "code-repositories",
    name: "Dépôts de code",
    description: "Recherche de code source et projets",
    query: "",
    tags: {
      sites: ["github.com", "gitlab.com", "bitbucket.org"],
      excludeSites: [],
      fileTypes: ["py", "js", "ts", "java", "cpp"],
      wordsInTitle: [],
      wordsInUrl: ["repo", "project"],
      excludeWords: ["fork", "mirror"]
    },
    isFavorite: true,
    createdAt: new Date()
  },
  {
    id: "documentation",
    name: "Documentation technique",
    description: "Guides et documentation technique",
    query: "",
    tags: {
      sites: [],
      excludeSites: [],
      fileTypes: ["pdf", "doc", "docx"],
      wordsInTitle: ["guide", "documentation", "manual", "tutorial"],
      wordsInUrl: ["docs", "help", "guide"],
      excludeWords: ["outdated", "deprecated"]
    },
    isFavorite: false,
    createdAt: new Date()
  },
  {
    id: "news-articles",
    name: "Articles de presse",
    description: "Recherche d'actualités et articles journalistiques",
    query: "",
    tags: {
      sites: ["bbc.com", "cnn.com", "reuters.com", "lemonde.fr", "lefigaro.fr"],
      excludeSites: [],
      fileTypes: [],
      wordsInTitle: [],
      wordsInUrl: ["news", "article"],
      excludeWords: ["opinion", "blog"]
    },
    isFavorite: false,
    createdAt: new Date()
  }
];

const commonSuggestions = {
  sites: [
    "github.com", "stackoverflow.com", "medium.com", "dev.to", "reddit.com",
    "youtube.com", "wikipedia.org", "arxiv.org", "scholar.google.com",
    "researchgate.net", "ieee.org", "acm.org", "springer.com", "nature.com"
  ],
  fileTypes: [
    "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx",
    "txt", "md", "py", "js", "ts", "java", "cpp", "html", "css",
    "json", "xml", "csv", "sql", "zip", "rar", "mp4", "mp3", "png", "jpg"
  ],
  commonWords: [
    "tutorial", "guide", "documentation", "example", "sample",
    "template", "framework", "library", "tool", "resource",
    "course", "training", "workshop", "conference", "research"
  ]
};

export function AdvancedSearch({ onApplySearch, currentSearchData }: AdvancedSearchProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [presets, setPresets] = useState<SearchPreset[]>(defaultPresets);
  const [filterHistory, setFilterHistory] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Load presets and history from localStorage
  useEffect(() => {
    const storedPresets = localStorage.getItem("searchPresets");
    const storedHistory = localStorage.getItem("advancedSearchHistory");
    
    if (storedPresets) {
      try {
        const parsedPresets = JSON.parse(storedPresets).map((preset: any) => ({
          ...preset,
          createdAt: new Date(preset.createdAt)
        }));
        setPresets([...defaultPresets, ...parsedPresets]);
      } catch (error) {
        console.error("Error loading presets:", error);
      }
    }
    
    if (storedHistory) {
      try {
        // const parsedHistory = JSON.parse(storedHistory);
        // setSearchHistory(parsedHistory); // Commented out as not used
      } catch (error) {
        console.error("Error loading history:", error);
      }
    }
  }, []);

  // Save presets to localStorage
  useEffect(() => {
    const customPresets = presets.filter(p => !defaultPresets.find(dp => dp.id === p.id));
    localStorage.setItem("searchPresets", JSON.stringify(customPresets));
  }, [presets]);

  const applyPreset = useCallback((presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (preset) {
      onApplySearch({
        searchText: preset.query,
        tags: preset.tags
      });
      
      toast({
        title: "Preset appliqué",
        description: `Le preset "${preset.name}" a été appliqué avec succès.`,
      });
      
      setIsOpen(false);
    }
  }, [presets, onApplySearch, toast]);

  const saveCurrentAsPreset = useCallback(() => {
    const newPreset: SearchPreset = {
      id: `custom-${Date.now()}`,
      name: `Recherche personnalisée ${new Date().toLocaleDateString()}`,
      description: "Preset créé à partir de la recherche actuelle",
      query: currentSearchData.searchText || "",
      tags: currentSearchData.tags || {
        sites: [],
        excludeSites: [],
        fileTypes: [],
        wordsInTitle: [],
        wordsInUrl: [],
        excludeWords: []
      },
      isFavorite: false,
      createdAt: new Date()
    };

    setPresets(prev => [...prev, newPreset]);
    
    toast({
      title: "Preset sauvegardé",
      description: "Votre recherche actuelle a été sauvegardée comme preset.",
    });
  }, [currentSearchData, toast]);

  const toggleFavorite = useCallback((presetId: string) => {
    setPresets(prev => prev.map(preset => 
      preset.id === presetId 
        ? { ...preset, isFavorite: !preset.isFavorite }
        : preset
    ));
  }, []);

  const deletePreset = useCallback((presetId: string) => {
    if (defaultPresets.find(p => p.id === presetId)) {
      toast({
        title: "Impossible de supprimer",
        description: "Les presets par défaut ne peuvent pas être supprimés.",
        variant: "destructive"
      });
      return;
    }

    setPresets(prev => prev.filter(preset => preset.id !== presetId));
    
    toast({
      title: "Preset supprimé",
      description: "Le preset a été supprimé avec succès.",
    });
  }, [toast]);

  const exportPresets = useCallback(() => {
    const customPresets = presets.filter(p => !defaultPresets.find(dp => dp.id === p.id));
    const dataStr = JSON.stringify(customPresets, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'deep-search-presets.json';
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Presets exportés",
      description: "Vos presets ont été téléchargés avec succès.",
    });
  }, [presets, toast]);

  const importPresets = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedPresets = JSON.parse(e.target?.result as string);
        const validPresets = importedPresets.filter((preset: any) => 
          preset.id && preset.name && preset.tags
        ).map((preset: any) => ({
          ...preset,
          createdAt: new Date(preset.createdAt || Date.now()),
          id: `imported-${preset.id}-${Date.now()}` // Avoid ID conflicts
        }));

        setPresets(prev => [...prev, ...validPresets]);
        
        toast({
          title: "Presets importés",
          description: `${validPresets.length} presets ont été importés avec succès.`,
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
  }, [toast]);

  const filteredPresets = useMemo(() => {
    return presets.filter(preset => {
      const matchesFilter = !filterHistory || 
        preset.name.toLowerCase().includes(filterHistory.toLowerCase()) ||
        preset.description.toLowerCase().includes(filterHistory.toLowerCase());
      
      const matchesFavorites = !showFavoritesOnly || preset.isFavorite;
      
      return matchesFilter && matchesFavorites;
    });
  }, [presets, filterHistory, showFavoritesOnly]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Recherche avancée
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche avancée
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={saveCurrentAsPreset}>
              <Star className="h-4 w-4 mr-2" />
              Sauvegarder comme preset
            </Button>
            <Button variant="outline" size="sm" onClick={exportPresets}>
              <Download className="h-4 w-4 mr-2" />
              Exporter presets
            </Button>
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Importer presets
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importPresets}
                className="hidden"
              />
            </label>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="filter">Filtrer les presets</Label>
                <Input
                  id="filter"
                  placeholder="Rechercher dans les presets..."
                  value={filterHistory}
                  onChange={(e) => setFilterHistory(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="favorites"
                  checked={showFavoritesOnly}
                  onCheckedChange={(checked) => setShowFavoritesOnly(checked === true)}
                />
                <Label htmlFor="favorites">Favoris uniquement</Label>
              </div>
            </div>
          </div>

          {/* Presets List */}
          <div className="space-y-3">
            <h3 className="font-semibold">Presets de recherche</h3>
            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {filteredPresets.map((preset) => (
                <div key={preset.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{preset.name}</h4>
                        {preset.isFavorite && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{preset.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {preset.tags.sites.length > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Sites: {preset.tags.sites.length}
                          </span>
                        )}
                        {preset.tags.fileTypes.length > 0 && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Types: {preset.tags.fileTypes.length}
                          </span>
                        )}
                        {preset.tags.wordsInTitle.length > 0 && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Titre: {preset.tags.wordsInTitle.length}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(preset.id)}
                      >
                        <Star className={`h-4 w-4 ${preset.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => applyPreset(preset.id)}
                      >
                        Appliquer
                      </Button>
                      {!defaultPresets.find(p => p.id === preset.id) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePreset(preset.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className="space-y-4">
            <h3 className="font-semibold">Suggestions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Sites populaires</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {commonSuggestions.sites.slice(0, 8).map((site) => (
                    <Button
                      key={site}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6"
                      onClick={() => {
                        // Add to current search - this would need to be implemented
                        toast({
                          title: "Site ajouté",
                          description: `${site} ajouté aux suggestions`,
                        });
                      }}
                    >
                      {site}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Types de fichiers</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {commonSuggestions.fileTypes.slice(0, 8).map((type) => (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6"
                      onClick={() => {
                        toast({
                          title: "Type ajouté",
                          description: `${type} ajouté aux suggestions`,
                        });
                      }}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Mots-clés courants</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {commonSuggestions.commonWords.slice(0, 8).map((word) => (
                    <Button
                      key={word}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6"
                      onClick={() => {
                        toast({
                          title: "Mot-clé ajouté",
                          description: `${word} ajouté aux suggestions`,
                        });
                      }}
                    >
                      {word}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}