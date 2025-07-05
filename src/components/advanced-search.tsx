import { useState, useCallback, useEffect, useMemo } from "react";
import { Filter, Star, Trash2, Download, Upload, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useToast } from "../hooks/use-toast";
import { GoogleDorkBuilder } from "./google-dork-builder";
import { GoogleDorkAI } from "./google-dork-ai";

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
  isEmbedded?: boolean;
}

const defaultPresets: SearchPreset[] = [
  {
    id: "academic-papers",
    name: "Articles académiques",
    description: "Recherche d'articles scientifiques et académiques",
    query: "",
    tags: {
      sites: ["scholar.google.com", "arxiv.org", "researchgate.net", "ieee.org", "acm.org"],
      excludeSites: ["wikipedia.org"],
      fileTypes: ["pdf"],
      wordsInTitle: ["research", "study", "analysis", "paper", "journal"],
      wordsInUrl: ["paper", "article", "research"],
      excludeWords: ["advertisement", "commercial", "blog"]
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
      sites: ["github.com", "gitlab.com", "bitbucket.org", "sourceforge.net"],
      excludeSites: [],
      fileTypes: ["py", "js", "ts", "java", "cpp", "go", "rs", "php"],
      wordsInTitle: ["library", "framework", "api", "tool"],
      wordsInUrl: ["repo", "project", "code"],
      excludeWords: ["fork", "mirror", "archived"]
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
      sites: ["docs.python.org", "developer.mozilla.org", "docs.microsoft.com"],
      excludeSites: [],
      fileTypes: ["pdf", "doc", "docx", "md"],
      wordsInTitle: ["guide", "documentation", "manual", "tutorial", "handbook"],
      wordsInUrl: ["docs", "help", "guide", "manual"],
      excludeWords: ["outdated", "deprecated", "old"]
    },
    isFavorite: false,
    createdAt: new Date()
  },
  {
    id: "security-research",
    name: "Recherche sécurité",
    description: "Fichiers et vulnérabilités de sécurité",
    query: "",
    tags: {
      sites: [],
      excludeSites: [],
      fileTypes: ["log", "txt", "conf", "config"],
      wordsInTitle: ["index of", "directory listing"],
      wordsInUrl: ["admin", "config", "backup"],
      excludeWords: ["safe", "protected"]
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
      sites: ["bbc.com", "cnn.com", "reuters.com", "lemonde.fr", "lefigaro.fr", "liberation.fr"],
      excludeSites: ["blog."],
      fileTypes: [],
      wordsInTitle: ["breaking", "news", "report"],
      wordsInUrl: ["news", "article", "story"],
      excludeWords: ["opinion", "blog", "editorial"]
    },
    isFavorite: false,
    createdAt: new Date()
  },
  {
    id: "educational-content",
    name: "Contenu éducatif",
    description: "Cours, tutoriels et ressources éducatives",
    query: "",
    tags: {
      sites: ["coursera.org", "edx.org", "khan.academy.org", "mit.edu", "stanford.edu"],
      excludeSites: [],
      fileTypes: ["pdf", "ppt", "pptx"],
      wordsInTitle: ["course", "tutorial", "lesson", "lecture"],
      wordsInUrl: ["course", "tutorial", "learn"],
      excludeWords: ["paid", "premium", "subscription"]
    },
    isFavorite: false,
    createdAt: new Date()
  },
  {
    id: "social-media",
    name: "Réseaux sociaux",
    description: "Recherche sur les plateformes sociales",
    query: "",
    tags: {
      sites: ["twitter.com", "facebook.com", "linkedin.com", "reddit.com", "instagram.com"],
      excludeSites: [],
      fileTypes: [],
      wordsInTitle: [],
      wordsInUrl: ["post", "status", "tweet"],
      excludeWords: ["spam", "bot", "fake"]
    },
    isFavorite: false,
    createdAt: new Date()
  },
  {
    id: "file-sharing",
    name: "Partage de fichiers",
    description: "Recherche de fichiers partagés publiquement",
    query: "",
    tags: {
      sites: ["drive.google.com", "dropbox.com", "mega.nz"],
      excludeSites: [],
      fileTypes: ["zip", "rar", "tar", "gz", "7z"],
      wordsInTitle: ["shared", "public", "download"],
      wordsInUrl: ["share", "download", "file"],
      excludeWords: ["private", "restricted", "password"]
    },
    isFavorite: false,
    createdAt: new Date()
  }
];

const commonSuggestions = {
  sites: [
    "github.com", "stackoverflow.com", "medium.com", "dev.to", "reddit.com",
    "youtube.com", "wikipedia.org", "arxiv.org", "scholar.google.com",
    "researchgate.net", "ieee.org", "acm.org", "springer.com", "nature.com",
    "docs.python.org", "developer.mozilla.org", "w3schools.com", "freecodecamp.org",
    "coursera.org", "edx.org", "khan.academy.org", "mit.edu", "stanford.edu",
    "pubmed.ncbi.nlm.nih.gov", "science.org", "bbc.com", "cnn.com", "reuters.com",
    "lemonde.fr", "lefigaro.fr", "liberation.fr", "drive.google.com", "dropbox.com",
    "mega.nz", "twitter.com", "facebook.com", "linkedin.com", "instagram.com",
    "gitlab.com", "bitbucket.org", "sourceforge.net", "cve.mitre.org", "nvd.nist.gov"
  ],
  fileTypes: [
    "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx",
    "txt", "md", "py", "js", "ts", "java", "cpp", "html", "css",
    "json", "xml", "csv", "sql", "zip", "rar", "mp4", "mp3", "png", "jpg",
    "log", "conf", "config", "ini", "yaml", "toml", "env", "bak", "backup",
    "old", "tmp", "db", "mdb", "sqlite", "tar", "gz", "7z", "iso",
    "exe", "msi", "dmg", "deb", "rpm", "apk", "jar", "war", "ear"
  ],
  commonWords: [
    "tutorial", "guide", "documentation", "example", "sample",
    "template", "framework", "library", "tool", "resource",
    "course", "training", "workshop", "conference", "research",
    "paper", "study", "analysis", "report", "handbook",
    "manual", "reference", "api", "sdk", "plugin", "extension",
    "download", "free", "open source", "license", "installation",
    "configuration", "setup", "troubleshooting", "error", "bug",
    "security", "vulnerability", "exploit", "patch", "update"
  ],
  operators: [
    { name: "site:", description: "Recherche sur un site spécifique", example: "site:github.com" },
    { name: "filetype:", description: "Type de fichier", example: "filetype:pdf" },
    { name: "ext:", description: "Extension de fichier", example: "ext:docx" },
    { name: "intext:", description: "Texte dans le contenu", example: 'intext:"python"' },
    { name: "intitle:", description: "Mot dans le titre", example: 'intitle:"guide"' },
    { name: "inurl:", description: "Mot dans l'URL", example: "inurl:admin" },
    { name: "before:", description: "Avant une date", example: "before:2023-01-01" },
    { name: "after:", description: "Après une date", example: "after:2022-01-01" },
    { name: "allintext:", description: "Tous les mots dans le contenu", example: 'allintext:"machine learning"' },
    { name: "allintitle:", description: "Tous les mots dans le titre", example: 'allintitle:"data science"' },
    { name: "allinurl:", description: "Tous les mots dans l'URL", example: 'allinurl:"admin config"' },
    { name: "inanchor:", description: "Texte dans les liens", example: 'inanchor:"download"' },
    { name: "link:", description: "Pages avec liens vers URL", example: "link:example.com" },
    { name: "related:", description: "Sites similaires", example: "related:stackoverflow.com" },
    { name: "cache:", description: "Version en cache", example: "cache:example.com" },
    { name: "info:", description: "Informations sur URL", example: "info:github.com" },
    { name: "numrange:", description: "Plage numérique", example: "numrange:100-500" },
    { name: "location:", description: "Contenu géolocalisé", example: 'location:"Paris"' },
    { name: "source:", description: "Source spécifique", example: "source:reuters" },
    { name: "define:", description: "Définition", example: "define:machine learning" },
    { name: "stocks:", description: "Info boursière", example: "stocks:AAPL" },
    { name: "weather:", description: "Météo", example: "weather:Paris" },
    { name: "map:", description: "Carte", example: "map:Eiffel Tower" },
    { name: "movie:", description: "Info film", example: "movie:Inception" }
  ]
};

export function AdvancedSearch({ onApplySearch, currentSearchData, isEmbedded = false }: AdvancedSearchProps) {
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

  // Render embedded version
  if (isEmbedded) {
    return (
      <div className="w-full">
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="builder">Constructeur</TabsTrigger>
            <TabsTrigger value="ai">Assistant IA</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="space-y-4 mt-4">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={saveCurrentAsPreset}>
                <Star className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
              <Button variant="outline" size="sm" onClick={exportPresets}>
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
                  onChange={importPresets}
                  className="hidden"
                />
              </label>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Input
                  placeholder="Filtrer les presets..."
                  value={filterHistory}
                  onChange={(e) => setFilterHistory(e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="favorites-embedded"
                  checked={showFavoritesOnly}
                  onCheckedChange={(checked) => setShowFavoritesOnly(checked === true)}
                />
                <Label htmlFor="favorites-embedded" className="text-sm">Favoris</Label>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {filteredPresets.slice(0, 6).map((preset) => (
                <div key={preset.id} className="border rounded p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{preset.name}</h4>
                      {preset.isFavorite && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(preset.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Star className={`h-3 w-3 ${preset.isFavorite ? 'text-yellow-500 fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => applyPreset(preset.id)}
                        className="h-6 px-2 text-xs"
                      >
                        Appliquer
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{preset.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {preset.tags.sites.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                        Sites: {preset.tags.sites.length}
                      </span>
                    )}
                    {preset.tags.fileTypes.length > 0 && (
                      <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                        Types: {preset.tags.fileTypes.length}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="builder" className="mt-4">
            <GoogleDorkBuilder 
              onQueryGenerated={(query) => {
                onApplySearch({
                  searchText: query,
                  tags: {}
                });
              }}
            />
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-6">
            <GoogleDorkAI
              onQueryGenerated={(query) => {
                onApplySearch({
                  searchText: query,
                  tags: {
                    sites: [],
                    excludeSites: [],
                    fileTypes: [],
                    wordsInTitle: [],
                    wordsInUrl: [],
                    excludeWords: []
                  }
                });
                setIsOpen(false);
              }}
              initialQuery={currentSearchData?.searchText || ""}
            />
          </TabsContent>
          
          <TabsContent value="ai" className="mt-4">
            <GoogleDorkAI 
              onQueryGenerated={(query) => {
                onApplySearch({
                  searchText: query,
                  tags: {}
                });
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

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

        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="builder">Constructeur</TabsTrigger>
            <TabsTrigger value="ai">Assistant IA</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="space-y-6">
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
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium">Sites populaires</Label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {commonSuggestions.sites.slice(0, 6).map((site) => (
                      <Button
                        key={site}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6"
                        onClick={() => {
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
                    {commonSuggestions.fileTypes.slice(0, 6).map((type) => (
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
                    {commonSuggestions.commonWords.slice(0, 6).map((word) => (
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
                
                <div>
                  <Label className="text-sm font-medium">Opérateurs Dorks</Label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {commonSuggestions.operators.slice(0, 6).map((operator) => (
                      <Button
                        key={operator.name}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6"
                        onClick={() => {
                          toast({
                            title: "Opérateur ajouté",
                            description: `${operator.name} - ${operator.description}`,
                          });
                        }}
                        title={`${operator.description} - Exemple: ${operator.example}`}
                      >
                        {operator.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="builder" className="space-y-6">
            <GoogleDorkBuilder
              onQueryGenerated={(query) => {
                onApplySearch({
                  searchText: query,
                  tags: {
                    sites: [],
                    excludeSites: [],
                    fileTypes: [],
                    wordsInTitle: [],
                    wordsInUrl: [],
                    excludeWords: []
                  }
                });
                setIsOpen(false);
              }}
              initialQuery={currentSearchData?.searchText || ""}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}