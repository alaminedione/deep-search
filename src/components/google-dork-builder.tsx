import { useState, useCallback, useMemo } from "react";
import { Code2, Copy, RefreshCw, Lightbulb, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { useToast } from "../hooks/use-toast";

// Types pour les opérateurs Google Dorks
interface DorkOperator {
  name: string;
  syntax: string;
  description: string;
  example: string;
  category: 'basic' | 'advanced' | 'file' | 'site' | 'content' | 'time';
  requiresValue: boolean;
}

// Liste complète des opérateurs Google Dorks basée sur la recherche
const GOOGLE_DORK_OPERATORS: DorkOperator[] = [
  // Basic operators
  { name: 'Site', syntax: 'site:', description: 'Recherche sur un site spécifique', example: 'site:github.com', category: 'site', requiresValue: true },
  { name: 'Filetype', syntax: 'filetype:', description: 'Recherche par type de fichier', example: 'filetype:pdf', category: 'file', requiresValue: true },
  { name: 'Intext', syntax: 'intext:', description: 'Texte dans le contenu', example: 'intext:"mot-clé"', category: 'content', requiresValue: true },
  { name: 'Intitle', syntax: 'intitle:', description: 'Mot dans le titre', example: 'intitle:"guide"', category: 'content', requiresValue: true },
  { name: 'Inurl', syntax: 'inurl:', description: 'Mot dans l\'URL', example: 'inurl:admin', category: 'content', requiresValue: true },
  
  // Advanced operators
  { name: 'Allintext', syntax: 'allintext:', description: 'Tous les mots dans le contenu', example: 'allintext:"python tutorial"', category: 'advanced', requiresValue: true },
  { name: 'Allintitle', syntax: 'allintitle:', description: 'Tous les mots dans le titre', example: 'allintitle:"machine learning"', category: 'advanced', requiresValue: true },
  { name: 'Allinurl', syntax: 'allinurl:', description: 'Tous les mots dans l\'URL', example: 'allinurl:"admin login"', category: 'advanced', requiresValue: true },
  { name: 'Link', syntax: 'link:', description: 'Pages avec liens vers URL', example: 'link:example.com', category: 'advanced', requiresValue: true },
  { name: 'Related', syntax: 'related:', description: 'Sites similaires', example: 'related:github.com', category: 'advanced', requiresValue: true },
  { name: 'Cache', syntax: 'cache:', description: 'Version en cache', example: 'cache:example.com', category: 'advanced', requiresValue: true },
  
  // Time-based operators
  { name: 'Before', syntax: 'before:', description: 'Avant une date', example: 'before:2023-01-01', category: 'time', requiresValue: true },
  { name: 'After', syntax: 'after:', description: 'Après une date', example: 'after:2022-01-01', category: 'time', requiresValue: true },
  
  // Numeric operators
  { name: 'Numrange', syntax: 'numrange:', description: 'Plage numérique', example: 'numrange:100-200', category: 'advanced', requiresValue: true },
  
  // Blog-specific operators
  { name: 'Inanchor', syntax: 'inanchor:', description: 'Texte dans les liens', example: 'inanchor:"cliquez ici"', category: 'advanced', requiresValue: true },
  { name: 'Allinanchor', syntax: 'allinanchor:', description: 'Tous les mots dans les liens', example: 'allinanchor:"télécharger pdf"', category: 'advanced', requiresValue: true },
];

// Templates de requêtes prédéfinies
const QUERY_TEMPLATES = {
  academic: {
    name: 'Recherche académique',
    template: 'site:scholar.google.com OR site:arxiv.org OR site:researchgate.net "{query}" filetype:pdf',
    description: 'Recherche d\'articles scientifiques et académiques'
  },
  code: {
    name: 'Code source',
    template: 'site:github.com OR site:gitlab.com "{query}" filetype:py OR filetype:js OR filetype:ts',
    description: 'Recherche de code source et projets'
  },
  documentation: {
    name: 'Documentation',
    template: 'intitle:"documentation" OR intitle:"guide" OR intitle:"manual" "{query}" filetype:pdf OR filetype:doc',
    description: 'Guides et documentation technique'
  },
  vulnerabilities: {
    name: 'Fichiers sensibles',
    template: 'intext:"index of /" "{query}" -inurl:jsp -inurl:php -inurl:html',
    description: 'Recherche de répertoires exposés'
  },
  news: {
    name: 'Articles de presse',
    template: 'site:bbc.com OR site:cnn.com OR site:reuters.com "{query}" after:2023-01-01',
    description: 'Actualités récentes'
  },
  social: {
    name: 'Réseaux sociaux',
    template: 'site:twitter.com OR site:facebook.com OR site:linkedin.com "{query}"',
    description: 'Recherche sur les réseaux sociaux'
  }
};

interface GoogleDorkBuilderProps {
  onQueryGenerated: (query: string) => void;
  initialQuery?: string;
}

export function GoogleDorkBuilder({ onQueryGenerated, initialQuery = "" }: GoogleDorkBuilderProps) {
  const { toast } = useToast();
  const [baseQuery, setBaseQuery] = useState(initialQuery);
  const [selectedOperators, setSelectedOperators] = useState<Array<{operator: DorkOperator, value: string}>>([]);
  const [excludeTerms, setExcludeTerms] = useState<string[]>([]);
  const [includeTerms, setIncludeTerms] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Génération de la requête finale
  const generatedQuery = useMemo(() => {
    let query = baseQuery.trim();
    
    // Ajouter les termes obligatoires
    if (includeTerms.length > 0) {
      const terms = includeTerms.map(term => `+"${term}"`).join(' ');
      query = `${query} ${terms}`.trim();
    }
    
    // Ajouter les opérateurs
    selectedOperators.forEach(({ operator, value }) => {
      if (value.trim()) {
        if (operator.syntax === 'site:' && !value.includes('.')) {
          // Auto-compléter les sites communs
          query += ` ${operator.syntax}${value}.com`;
        } else {
          query += ` ${operator.syntax}${value}`;
        }
      }
    });
    
    // Exclure les termes
    if (excludeTerms.length > 0) {
      const terms = excludeTerms.map(term => `-"${term}"`).join(' ');
      query = `${query} ${terms}`.trim();
    }
    
    return query;
  }, [baseQuery, selectedOperators, excludeTerms, includeTerms]);

  // Ajouter un opérateur
  const addOperator = useCallback((operator: DorkOperator) => {
    setSelectedOperators(prev => [...prev, { operator, value: '' }]);
  }, []);

  // Supprimer un opérateur
  const removeOperator = useCallback((index: number) => {
    setSelectedOperators(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Mettre à jour la valeur d'un opérateur
  const updateOperatorValue = useCallback((index: number, value: string) => {
    setSelectedOperators(prev => prev.map((item, i) => 
      i === index ? { ...item, value } : item
    ));
  }, []);

  // Appliquer un template
  const applyTemplate = useCallback((templateKey: string) => {
    const template = QUERY_TEMPLATES[templateKey as keyof typeof QUERY_TEMPLATES];
    if (template) {
      const query = template.template.replace('{query}', baseQuery || 'recherche');
      onQueryGenerated(query);
      setSelectedTemplate(templateKey);
      toast({
        title: "Template appliqué",
        description: `Template "${template.name}" appliqué avec succès.`,
      });
    }
  }, [baseQuery, onQueryGenerated, toast]);

  // Copier la requête
  const copyQuery = useCallback(() => {
    navigator.clipboard.writeText(generatedQuery);
    toast({
      title: "Requête copiée",
      description: "La requête a été copiée dans le presse-papiers.",
    });
  }, [generatedQuery, toast]);

  // Réinitialiser
  const resetBuilder = useCallback(() => {
    setBaseQuery('');
    setSelectedOperators([]);
    setExcludeTerms([]);
    setIncludeTerms([]);
    setSelectedTemplate('');
  }, []);

  // Ajouter un terme à exclure
  const addExcludeTerm = useCallback((term: string) => {
    if (term.trim() && !excludeTerms.includes(term.trim())) {
      setExcludeTerms(prev => [...prev, term.trim()]);
    }
  }, [excludeTerms]);

  // Ajouter un terme à inclure
  const addIncludeTerm = useCallback((term: string) => {
    if (term.trim() && !includeTerms.includes(term.trim())) {
      setIncludeTerms(prev => [...prev, term.trim()]);
    }
  }, [includeTerms]);

  // Grouper les opérateurs par catégorie
  const operatorsByCategory = useMemo(() => {
    return GOOGLE_DORK_OPERATORS.reduce((acc, operator) => {
      if (!acc[operator.category]) {
        acc[operator.category] = [];
      }
      acc[operator.category].push(operator);
      return acc;
    }, {} as Record<string, DorkOperator[]>);
  }, []);

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-2">
        <Code2 className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Constructeur Google Dorks</h3>
      </div>

      {/* Requête de base */}
      <div className="space-y-2">
        <Label htmlFor="base-query">Requête de base</Label>
        <Input
          id="base-query"
          placeholder="Entrez vos mots-clés principaux..."
          value={baseQuery}
          onChange={(e) => setBaseQuery(e.target.value)}
        />
      </div>

      {/* Templates rapides */}
      <div className="space-y-3">
        <Label>Templates rapides</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(QUERY_TEMPLATES).map(([key, template]) => (
            <Button
              key={key}
              variant={selectedTemplate === key ? "default" : "outline"}
              size="sm"
              onClick={() => applyTemplate(key)}
              className="text-xs"
            >
              {template.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Opérateurs par catégorie */}
      <div className="space-y-4">
        <Label>Opérateurs Google Dorks</Label>
        {Object.entries(operatorsByCategory).map(([category, operators]) => (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-medium capitalize">{category}</h4>
            <div className="flex flex-wrap gap-1">
              {operators.map((operator) => (
                <Button
                  key={operator.syntax}
                  variant="outline"
                  size="sm"
                  onClick={() => addOperator(operator)}
                  className="text-xs h-7"
                  title={operator.description}
                >
                  {operator.name}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Opérateurs sélectionnés */}
      {selectedOperators.length > 0 && (
        <div className="space-y-3">
          <Label>Opérateurs configurés</Label>
          <div className="space-y-2">
            {selectedOperators.map(({ operator, value }, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="secondary">{operator.syntax}</Badge>
                <Input
                  placeholder={operator.example}
                  value={value}
                  onChange={(e) => updateOperatorValue(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOperator(index)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Termes à inclure/exclure */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Termes obligatoires</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Terme à inclure"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addIncludeTerm(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {includeTerms.map((term, index) => (
              <Badge key={index} variant="default" className="text-xs">
                +{term}
                <button
                  onClick={() => setIncludeTerms(prev => prev.filter((_, i) => i !== index))}
                  className="ml-1"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Termes à exclure</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Terme à exclure"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addExcludeTerm(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {excludeTerms.map((term, index) => (
              <Badge key={index} variant="destructive" className="text-xs">
                -{term}
                <button
                  onClick={() => setExcludeTerms(prev => prev.filter((_, i) => i !== index))}
                  className="ml-1"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Requête générée */}
      <div className="space-y-2">
        <Label>Requête générée</Label>
        <Textarea
          value={generatedQuery}
          readOnly
          className="min-h-[80px] font-mono text-sm"
          placeholder="Votre requête Google Dorks apparaîtra ici..."
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={() => onQueryGenerated(generatedQuery)}
          disabled={!generatedQuery.trim()}
          className="flex-1"
        >
          <Search className="h-4 w-4 mr-2" />
          Utiliser cette requête
        </Button>
        <Button variant="outline" onClick={copyQuery} disabled={!generatedQuery.trim()}>
          <Copy className="h-4 w-4 mr-2" />
          Copier
        </Button>
        <Button variant="outline" onClick={resetBuilder}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
      </div>

      {/* Conseils */}
      <div className="bg-muted p-3 rounded-lg">
        <div className="flex items-start gap-2">
          <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500" />
          <div className="text-sm space-y-1">
            <p className="font-medium">Conseils pour de meilleures recherches :</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Utilisez des guillemets pour les phrases exactes</li>
              <li>• Combinez plusieurs opérateurs avec AND/OR</li>
              <li>• Utilisez - pour exclure des termes</li>
              <li>• Les opérateurs before:/after: acceptent le format YYYY-MM-DD</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}