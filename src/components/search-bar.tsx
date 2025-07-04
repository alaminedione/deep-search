import { Loader2, Sparkles } from "lucide-react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast"
import { SearchBarProps } from "../types";
import { useSettingApi } from "../contexts/settingApi";

export function SearchBar({ setSearchText, searchText, searchEngine }: SearchBarProps) {
  const { apikey, endpoint, modele, configured } = useSettingApi()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false);

  const placeholders = [
    "Recherchez avec l'IA ou les opérateurs Dorks...",
    "Essayez: 'tutoriels python filetype:pdf'",
    "Exemple: 'site:github.com machine learning'",
    "Trouvez des documents: 'guide SEO filetype:pdf'",
    "Recherche avancée avec Deep Search",
  ];

  const fetchQuery = useCallback(async (query: string) => {
    if (!apikey || !endpoint) {
      toast({
        title: "Configuration manquante",
        description: "Veuillez configurer votre API dans les paramètres.",
        variant: "destructive"
      });
      return null;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apikey}`,
          "X-Title": "Deep-Search",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": modele,
          "messages": [
            {
              "role": "system",
              "content": "Tu es un expert en opérateurs Google Dorks. Génère une requête de recherche optimisée en utilisant les opérateurs appropriés. Réponds uniquement avec la requête, sans explications."
            },
            {
              "role": "user",
              "content": `Améliore cette recherche avec des opérateurs Google Dorks: ${query}`
            }
          ],
          "max_tokens": 150,
          "temperature": 0.3
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Délai d\'attente dépassé');
        }
        throw error;
      }
      throw new Error('Erreur inconnue');
    }
  }, [apikey, endpoint, modele, toast]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, [setSearchText]);

  const executeAISearch = useCallback(async () => {
    if (!searchText.trim()) {
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
        description: "Configurez votre API en cliquant sur le bouton API en bas de page.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await fetchQuery(searchText);
      
      if (!data) return;

      let content = '';
      
      // Handle different API response formats
      if (data.choices && data.choices.length > 0) {
        content = data.choices[0]?.message?.content;
      } else if (data.message && data.message.content) {
        content = data.message.content;
      } else if (typeof data === 'string') {
        content = data;
      }

      if (!content) {
        throw new Error('Aucun contenu reçu de l\'API');
      }

      // Clean up the content
      content = content.trim().replace(/^["']|["']$/g, '');
      
      const encodedContent = encodeURIComponent(content);
      let searchUrl = '';

      if (searchEngine === 'google.com') {
        searchUrl = `https://www.google.com/search?q=${encodedContent}`;
      } else if (searchEngine === 'duckduckgo.com') {
        searchUrl = `https://duckduckgo.com/?q=${encodedContent}`;
      } else {
        throw new Error("Moteur de recherche non pris en charge");
      }

      window.open(searchUrl, '_blank');
      
      toast({
        title: "Recherche IA lancée",
        description: `Requête optimisée: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
      });

      setSearchText(""); // Clear after successful search

    } catch (error) {
      console.error("AI Search error:", error);
      
      let errorMessage = "Une erreur est survenue lors de la recherche IA.";
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = "Clé API invalide. Vérifiez votre configuration.";
        } else if (error.message.includes('403')) {
          errorMessage = "Accès refusé. Vérifiez vos permissions API.";
        } else if (error.message.includes('429')) {
          errorMessage = "Limite de taux atteinte. Attendez un moment.";
        } else if (error.message.includes('timeout') || error.message.includes('Délai')) {
          errorMessage = "Délai d'attente dépassé. Réessayez.";
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Erreur de recherche IA",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [searchText, configured, fetchQuery, searchEngine, toast, setSearchText]);

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    executeAISearch();
  }, [executeAISearch]);

  return (
    <div className="flex justify-center gap-3 mb-6 w-full items-center max-w-4xl mx-auto px-4">
      <div className="flex-1 max-w-2xl">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
      </div>

      <Button 
        className="shrink-0 min-w-[140px]" 
        onClick={executeAISearch}
        disabled={isSubmitting || !searchText.trim() || !configured}
        title={!configured ? 'Configurez votre API d\'abord' : 'Générer une requête optimisée avec l\'IA'}
        size="lg"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Génération...
          </>
        ) : (
          'Recherche IA'
        )}
      </Button>
    </div>
  );
}