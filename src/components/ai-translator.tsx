import { useState, useCallback } from "react";
import { Brain, Lightbulb, Copy, Search, Wand2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "../hooks/use-toast";
import { useSettingApi } from "../contexts/settingApi";
import { getAICompletion } from "../lib/ai";
import { INSTRUCTION } from "./constants";

interface AiTranslatorProps {
  onQueryGenerated: (query: string) => void;
  initialQuery?: string;
}

export function AiTranslator({ onQueryGenerated, initialQuery = "" }: AiTranslatorProps) {
  const { toast } = useToast();
  const { provider, model, apiKey, configured } = useSettingApi();
  const [userInput, setUserInput] = useState(initialQuery || "");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedQuery, setGeneratedQuery] = useState("");

  const generateDork = useCallback(async () => {
    if (!userInput.trim()) return;
    if (!configured) {
      toast({
        title: "Erreur de configuration",
        description: "Veuillez configurer votre clé API dans les paramètres.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await getAICompletion(
        ` this is the user input : ${userInput} \n ${INSTRUCTION}`,
        provider,
        model,
        apiKey
      ); setGeneratedQuery(response.content);
      toast({
        title: "Dork Google généré par l'IA",
        description: "L'IA a généré un dork Google pour votre requête.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur de l'IA",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [userInput, configured, provider, model, apiKey, toast]);

  const applyQuery = useCallback(() => {
    onQueryGenerated(generatedQuery);
    toast({ title: "Requête appliquée !" });
  }, [generatedQuery, onQueryGenerated, toast]);

  const copyQuery = useCallback(() => {
    navigator.clipboard.writeText(generatedQuery);
    toast({ title: "Copié dans le presse-papiers !" });
  }, [generatedQuery, toast]);

  return (
    <div className="space-y-6 p-6 border rounded-xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Traducteur de Dork Google par IA
          </h3>
        </div>
        <p className="text-muted-foreground">
          Demandez en anglais simple, et l'IA le traduira en une requête Google Dork avancée.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ai-input" className="text-base font-medium">
            Votre demande
          </Label>
          <div className="flex gap-3">
            <Input
              id="ai-input"
              placeholder="ex: Je veux des cours gratuits pour débutants..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="h-12 text-base"
            />
            <Button
              onClick={generateDork}
              disabled={!userInput.trim() || isAnalyzing || !configured}
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

        {generatedQuery && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="text-lg font-semibold flex items-center justify-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Dork Google généré par l'IA
              </h4>
            </div>
            <Textarea
              value={generatedQuery}
              readOnly
              className="text-sm font-mono resize-none border-0 bg-transparent p-0"
              rows={2}
            />
            <div className="flex gap-2">
              <Button onClick={applyQuery} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Appliquer la requête
              </Button>
              <Button variant="outline" onClick={copyQuery} className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copier la requête
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
