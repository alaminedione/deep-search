import { useState, useCallback } from "react";
import { Brain, Lightbulb, Copy, Search, Wand2, BookOpen, Code, Shield, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
    <div className="space-y-6 p-6 border rounded-xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
      {/* En-tête explicatif */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Assistant IA - Traducteur Google Dork
          </h3>
        </div>
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-muted-foreground mb-2">
            <strong>Vous ne connaissez pas les opérateurs Google Dork ?</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Posez simplement votre question en français et l'IA la transformera automatiquement en requête de recherche avancée avec les bons opérateurs !
          </p>
        </div>
        
        {/* Exemples visuels */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg border">
            <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">✅ Vous dites :</div>
            <p className="text-sm italic">"Je cherche des documents PDF sur l'intelligence artificielle publiés après 2020"</p>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-lg border">
            <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">🤖 L'IA génère :</div>
            <p className="text-xs font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
              "intelligence artificielle" filetype:pdf after:2020-01-01
            </p>
          </div>
        </div>
      </div>

      {/* Interface d'entrée */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ai-input" className="text-base font-medium">
            💬 Posez votre question en français
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            Décrivez ce que vous cherchez comme si vous parliez à un ami. L'IA se charge du reste !
          </p>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                id="ai-input"
                placeholder="Ex: Je veux des cours gratuits de Python pour débutants..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="h-12 text-base"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100" 
                       onClick={() => setUserInput("Je cherche des documents PDF sur l'intelligence artificielle")}>
                  💡 Exemple 1
                </Badge>
                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100"
                       onClick={() => setUserInput("Je veux du code Python pour faire du machine learning")}>
                  💡 Exemple 2
                </Badge>
                <Badge variant="outline" className="text-xs cursor-pointer hover:bg-gray-100"
                       onClick={() => setUserInput("Je cherche des vulnérabilités de sécurité récentes")}>
                  💡 Exemple 3
                </Badge>
              </div>
            </div>
            <Button 
              onClick={generateSmartSuggestions}
              disabled={!userInput.trim() || isAnalyzing}
              className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Brain className="mr-2 h-5 w-5 animate-pulse" />
                  Traduction...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Traduire
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Suggestions intelligentes */}
        {suggestions.length > 0 && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-lg font-semibold flex items-center justify-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                🎯 Traductions générées par l'IA
              </h4>
              <p className="text-sm text-muted-foreground">
                Voici comment l'IA a traduit votre question en requêtes Google Dork optimisées :
              </p>
            </div>
            <div className="grid gap-4">
              {suggestions.map((suggestion, index) => (
                <Card key={index} className="transition-all hover:shadow-lg border-l-4 border-l-blue-400">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          {getCategoryIcon(suggestion.category)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base mb-1">{suggestion.description}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getCategoryColor(suggestion.category)}`}
                            >
                              {suggestion.category === 'academic' ? '🎓 Académique' :
                               suggestion.category === 'development' ? '💻 Développement' :
                               suggestion.category === 'security' ? '🔒 Sécurité' : '📄 Général'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Pertinence: {Math.round(suggestion.confidence * 100)}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          🤖 Requête Google Dork générée :
                        </div>
                        <Textarea
                          value={suggestion.query}
                          readOnly
                          className="text-sm font-mono resize-none border-0 bg-transparent p-0"
                          rows={2}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-muted-foreground mr-2">Opérateurs utilisés :</span>
                          {suggestion.operators.map((operator, opIndex) => (
                            <Badge key={opIndex} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              {operator}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copySuggestion(suggestion.query)}
                            className="h-8 px-3"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copier
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => applySuggestion(suggestion)}
                            className="h-8 px-4 text-xs bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          >
                            <Search className="h-3 w-3 mr-1" />
                            Rechercher
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
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6 rounded-xl border">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h5 className="font-semibold text-base mb-3 text-blue-900 dark:text-blue-100">
                🎯 Comment fonctionne le traducteur IA ?
              </h5>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h6 className="font-medium text-sm text-green-700 dark:text-green-400">
                    ✅ Ce que vous pouvez dire :
                  </h6>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• "Je veux des PDF sur l'IA"</li>
                    <li>• "Code Python gratuit"</li>
                    <li>• "Vulnérabilités récentes"</li>
                    <li>• "Cours universitaires en ligne"</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h6 className="font-medium text-sm text-blue-700 dark:text-blue-400">
                    🤖 Ce que l'IA génère :
                  </h6>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">filetype:pdf</code> pour les PDF</li>
                    <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">site:github.com</code> pour le code</li>
                    <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">after:2023-01-01</code> pour récent</li>
                    <li>• <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded text-xs">site:edu</code> pour universitaire</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>💡 Astuce :</strong> Plus vous êtes précis dans votre demande, plus l'IA pourra générer des requêtes pertinentes avec les bons opérateurs Google Dork !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}