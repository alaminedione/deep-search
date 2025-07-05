import { useState, useCallback, useMemo } from "react";
import { Brain, Lightbulb, Copy, Search, Wand2, BookOpen, Code, Shield, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "../hooks/use-toast";

// Suggestions intelligentes basées sur l'analyse du contexte
interface SmartSuggestion {
  query: string;
  description: string;
  category: 'academic' | 'development' | 'security' | 'general';
  confidence: number;
  operators: string[];
}

interface GoogleDorkAIProps {
  onQueryGenerated: (query: string) => void;
  initialQuery?: string;
}

export function GoogleDorkAI({ onQueryGenerated, initialQuery = "" }: GoogleDorkAIProps) {
  const { toast } = useToast();
  const [userInput, setUserInput] = useState(initialQuery);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);

  // Analyse intelligente du contexte pour générer des suggestions
  const analyzeContext = useCallback((input: string): SmartSuggestion[] => {
    const lowercaseInput = input.toLowerCase();
    const suggestions: SmartSuggestion[] = [];

    // Détection de mots-clés académiques
    if (lowercaseInput.includes('research') || lowercaseInput.includes('study') || 
        lowercaseInput.includes('paper') || lowercaseInput.includes('thesis') ||
        lowercaseInput.includes('académique') || lowercaseInput.includes('étude')) {
      suggestions.push({
        query: `"${input}" (site:scholar.google.com OR site:arxiv.org OR site:researchgate.net) filetype:pdf`,
        description: "Recherche académique sur des plateformes scientifiques",
        category: 'academic',
        confidence: 0.9,
        operators: ['site:', 'filetype:']
      });
      
      suggestions.push({
        query: `"${input}" site:pubmed.ncbi.nlm.nih.gov OR site:ieee.org after:2020-01-01`,
        description: "Publications récentes dans les bases de données scientifiques",
        category: 'academic',
        confidence: 0.85,
        operators: ['site:', 'after:']
      });
    }

    // Détection de mots-clés de développement
    if (lowercaseInput.includes('code') || lowercaseInput.includes('programming') || 
        lowercaseInput.includes('development') || lowercaseInput.includes('api') ||
        lowercaseInput.includes('framework') || lowercaseInput.includes('library') ||
        lowercaseInput.includes('python') || lowercaseInput.includes('javascript') ||
        lowercaseInput.includes('react') || lowercaseInput.includes('node')) {
      suggestions.push({
        query: `"${input}" (site:github.com OR site:gitlab.com) (filetype:py OR filetype:js OR filetype:ts)`,
        description: "Code source et projets sur les plateformes de développement",
        category: 'development',
        confidence: 0.9,
        operators: ['site:', 'filetype:']
      });
      
      suggestions.push({
        query: `"${input}" site:stackoverflow.com intitle:"how to" OR intitle:"tutorial"`,
        description: "Tutoriels et solutions sur Stack Overflow",
        category: 'development',
        confidence: 0.8,
        operators: ['site:', 'intitle:']
      });
    }

    // Détection de mots-clés de sécurité
    if (lowercaseInput.includes('security') || lowercaseInput.includes('vulnerability') || 
        lowercaseInput.includes('exploit') || lowercaseInput.includes('penetration') ||
        lowercaseInput.includes('hacking') || lowercaseInput.includes('cve') ||
        lowercaseInput.includes('sécurité') || lowercaseInput.includes('vulnérabilité')) {
      suggestions.push({
        query: `"${input}" site:cve.mitre.org OR site:nvd.nist.gov intext:"CVE-"`,
        description: "Vulnérabilités dans les bases de données officielles",
        category: 'security',
        confidence: 0.95,
        operators: ['site:', 'intext:']
      });
      
      suggestions.push({
        query: `"${input}" (filetype:conf OR filetype:log OR filetype:bak) intext:"password" OR intext:"key"`,
        description: "Fichiers de configuration potentiellement exposés",
        category: 'security',
        confidence: 0.7,
        operators: ['filetype:', 'intext:']
      });
    }

    // Suggestions générales basées sur le type de contenu
    if (input.length > 3) {
      suggestions.push({
        query: `"${input}" (filetype:pdf OR filetype:doc OR filetype:ppt) -site:scribd.com`,
        description: "Documents et présentations (excluant Scribd)",
        category: 'general',
        confidence: 0.6,
        operators: ['filetype:', '-site:']
      });
      
      suggestions.push({
        query: `"${input}" intitle:"tutorial" OR intitle:"guide" OR intitle:"how to" after:2022-01-01`,
        description: "Tutoriels et guides récents",
        category: 'general',
        confidence: 0.65,
        operators: ['intitle:', 'after:']
      });
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 6);
  }, []);

  // Générer des suggestions intelligentes
  const generateSmartSuggestions = useCallback(() => {
    if (!userInput.trim()) {
      setSuggestions([]);
      return;
    }

    setIsAnalyzing(true);
    
    // Simulation d'analyse (en production, cela pourrait être un appel API)
    setTimeout(() => {
      const newSuggestions = analyzeContext(userInput);
      setSuggestions(newSuggestions);
      setIsAnalyzing(false);
      
      if (newSuggestions.length > 0) {
        toast({
          title: "Suggestions générées",
          description: `${newSuggestions.length} suggestions intelligentes disponibles.`,
        });
      }
    }, 1000);
  }, [userInput, analyzeContext, toast]);

  // Appliquer une suggestion
  const applySuggestion = useCallback((suggestion: SmartSuggestion) => {
    onQueryGenerated(suggestion.query);
    toast({
      title: "Suggestion appliquée",
      description: suggestion.description,
    });
  }, [onQueryGenerated, toast]);

  // Copier une suggestion
  const copySuggestion = useCallback((query: string) => {
    navigator.clipboard.writeText(query);
    toast({
      title: "Copié",
      description: "La requête a été copiée dans le presse-papiers.",
    });
  }, [toast]);

  // Icône de catégorie
  const getCategoryIcon = (category: SmartSuggestion['category']) => {
    switch (category) {
      case 'academic': return <BookOpen className="h-4 w-4" />;
      case 'development': return <Code className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      default: return <TrendingUp className="h-4 w-4" />;
    }
  };

  // Couleur de badge par catégorie
  const getCategoryColor = (category: SmartSuggestion['category']) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'development': return 'bg-green-100 text-green-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-purple-500" />
        <h3 className="text-lg font-semibold">Assistant IA Google Dorks</h3>
      </div>

      {/* Interface d'entrée */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ai-input">Décrivez ce que vous recherchez</Label>
          <div className="flex gap-2">
            <Input
              id="ai-input"
              placeholder="Ex: recherche académique sur l'intelligence artificielle, code Python pour machine learning..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={generateSmartSuggestions}
              disabled={!userInput.trim() || isAnalyzing}
              className="min-w-[120px]"
            >
              {isAnalyzing ? (
                <>
                  <Brain className="mr-2 h-4 w-4 animate-pulse" />
                  Analyse...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Analyser
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Suggestions intelligentes */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              Suggestions intelligentes
            </h4>
            <div className="grid gap-3">
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(suggestion.category)}
                        <CardTitle className="text-sm">{suggestion.description}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getCategoryColor(suggestion.category)}`}
                        >
                          {suggestion.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(suggestion.confidence * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <Textarea
                        value={suggestion.query}
                        readOnly
                        className="text-xs font-mono resize-none"
                        rows={2}
                      />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {suggestion.operators.map((operator, opIndex) => (
                            <Badge key={opIndex} variant="outline" className="text-xs">
                              {operator}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copySuggestion(suggestion.query)}
                            className="h-7 px-2"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => applySuggestion(suggestion)}
                            className="h-7 px-3 text-xs"
                          >
                            <Search className="h-3 w-3 mr-1" />
                            Utiliser
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Guide d'utilisation */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500" />
            <div className="text-sm space-y-1">
              <p className="font-medium">Comment utiliser l'assistant IA :</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Décrivez votre recherche en langage naturel</li>
                <li>• L'IA analyse le contexte et génère des requêtes optimisées</li>
                <li>• Chaque suggestion est évaluée avec un score de confiance</li>
                <li>• Les opérateurs utilisés sont affichés pour votre apprentissage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}