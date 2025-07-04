import { useState, useCallback } from "react";
import { Zap, BookOpen, Code, FileText, Globe, Lightbulb, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useToast } from "../hooks/use-toast";

interface SearchShortcut {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  query: string;
  tags: {
    sites?: string[];
    fileTypes?: string[];
    operators?: string[];
  };
  category: string;
  popularity: number;
}

interface SmartSearchSuggestionsProps {
  onApplyShortcut: (shortcut: SearchShortcut) => void;
}

const searchShortcuts: SearchShortcut[] = [
  {
    id: "academic-research",
    title: "Recherche académique",
    description: "Trouvez des articles scientifiques et des publications académiques",
    icon: <BookOpen className="h-5 w-5" />,
    query: "",
    tags: {
      sites: ["scholar.google.com", "arxiv.org", "pubmed.ncbi.nlm.nih.gov"],
      fileTypes: ["pdf"],
      operators: ["intitle:research", "intitle:study"]
    },
    category: "Académique",
    popularity: 95
  },
  {
    id: "code-examples",
    title: "Exemples de code",
    description: "Recherchez des exemples de code et des tutoriels de programmation",
    icon: <Code className="h-5 w-5" />,
    query: "",
    tags: {
      sites: ["github.com", "stackoverflow.com", "codepen.io"],
      fileTypes: ["py", "js", "java", "cpp"],
      operators: ["intitle:example", "intitle:tutorial"]
    },
    category: "Développement",
    popularity: 88
  },
  {
    id: "documentation",
    title: "Documentation technique",
    description: "Accédez à la documentation officielle et aux guides",
    icon: <FileText className="h-5 w-5" />,
    query: "",
    tags: {
      sites: ["docs.python.org", "developer.mozilla.org", "reactjs.org"],
      operators: ["inurl:docs", "intitle:documentation", "intitle:guide"]
    },
    category: "Documentation",
    popularity: 82
  },
  {
    id: "free-resources",
    title: "Ressources gratuites",
    description: "Trouvez des ressources, outils et contenus gratuits",
    icon: <Globe className="h-5 w-5" />,
    query: "free",
    tags: {
      operators: ["intitle:free", "intitle:\"open source\"", "-site:pinterest.com"]
    },
    category: "Ressources",
    popularity: 76
  },
  {
    id: "tutorials",
    title: "Tutoriels et guides",
    description: "Découvrez des tutoriels étape par étape",
    icon: <Lightbulb className="h-5 w-5" />,
    query: "",
    tags: {
      sites: ["youtube.com", "medium.com", "dev.to"],
      operators: ["intitle:tutorial", "intitle:\"how to\"", "intitle:guide"]
    },
    category: "Apprentissage",
    popularity: 91
  },
  {
    id: "trending-tech",
    title: "Technologies tendances",
    description: "Explorez les dernières tendances technologiques",
    icon: <TrendingUp className="h-5 w-5" />,
    query: "2024 trends",
    tags: {
      sites: ["techcrunch.com", "wired.com", "arstechnica.com"],
      operators: ["intitle:2024", "intitle:trends", "intitle:future"]
    },
    category: "Actualités",
    popularity: 73
  }
];

const categories = ["Tous", "Académique", "Développement", "Documentation", "Ressources", "Apprentissage", "Actualités"];

export function SmartSearchSuggestions({ onApplyShortcut }: SmartSearchSuggestionsProps) {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filteredShortcuts = selectedCategory === "Tous" 
    ? searchShortcuts 
    : searchShortcuts.filter(s => s.category === selectedCategory);

  const handleShortcutClick = useCallback((shortcut: SearchShortcut) => {
    onApplyShortcut(shortcut);
    
    toast({
      title: "Raccourci appliqué",
      description: `"${shortcut.title}" a été appliqué à votre recherche.`,
    });
  }, [onApplyShortcut, toast]);

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return "bg-green-500";
    if (popularity >= 80) return "bg-blue-500";
    if (popularity >= 70) return "bg-yellow-500";
    return "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Raccourcis de recherche intelligents
        </h3>
        <p className="text-sm text-muted-foreground">
          Accélérez vos recherches avec des configurations prédéfinies
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Shortcuts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredShortcuts.map((shortcut) => (
          <Card 
            key={shortcut.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleShortcutClick(shortcut)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {shortcut.icon}
                  <CardTitle className="text-base">{shortcut.title}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <div 
                    className={`w-2 h-2 rounded-full ${getPopularityColor(shortcut.popularity)}`}
                    title={`Popularité: ${shortcut.popularity}%`}
                  />
                  <span className="text-xs text-muted-foreground">{shortcut.popularity}%</span>
                </div>
              </div>
              <CardDescription className="text-sm">
                {shortcut.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {/* Tags Preview */}
                <div className="flex flex-wrap gap-1">
                  {shortcut.tags.sites?.slice(0, 2).map((site) => (
                    <Badge key={site} variant="secondary" className="text-xs">
                      {site}
                    </Badge>
                  ))}
                  {shortcut.tags.fileTypes?.slice(0, 2).map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      .{type}
                    </Badge>
                  ))}
                  {(shortcut.tags.sites?.length || 0) + (shortcut.tags.fileTypes?.length || 0) > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{((shortcut.tags.sites?.length || 0) + (shortcut.tags.fileTypes?.length || 0)) - 4}
                    </Badge>
                  )}
                </div>

                {/* Category Badge */}
                <div className="flex justify-between items-center">
                  <Badge variant="default" className="text-xs">
                    {shortcut.category}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                    Utiliser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredShortcuts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Aucun raccourci trouvé pour cette catégorie.
        </div>
      )}

      {/* Tips */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          Conseils pour optimiser vos recherches
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Combinez plusieurs raccourcis pour des recherches plus précises</li>
          <li>• Utilisez les opérateurs Google Dorks pour affiner vos résultats</li>
          <li>• Sauvegardez vos recherches fréquentes comme presets personnalisés</li>
          <li>• Explorez différentes catégories selon vos besoins</li>
        </ul>
      </div>
    </div>
  );
}