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
}

export function AiTranslator({ onQueryGenerated }: AiTranslatorProps) {
  const { toast } = useToast();
  const { provider, model, apiKey, configured } = useSettingApi();
  const [userInput, setUserInput] = useState("");
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
        apiKey,
      );
      setGeneratedQuery(response.content);
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8 border-0 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-blue-50/60 to-purple-50/40 dark:from-emerald-950/30 dark:via-blue-950/20 dark:to-purple-950/10 shadow-lg backdrop-blur-sm">
      <div className="text-center space-y-3 mobile-text-center">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <div className="p-2.5 sm:p-3 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/40 dark:to-blue-900/40 rounded-xl shadow-sm">
            <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent text-balance">
            Traducteur IA Google Dorks
          </h3>
        </div>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
          Décrivez votre recherche en français simple, l'IA créera
          automatiquement une requête Google Dork optimisée.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div className="space-y-3">
          <Label
            htmlFor="ai-input"
            className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Votre demande
          </Label>
          <div className="flex flex-col gap-3 sm:gap-4">
            <Input
              id="ai-input"
              placeholder="ex: Je cherche des tutoriels PDF gratuits sur Python pour débutants..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="h-12 sm:h-14 text-sm sm:text-base px-4 sm:px-5 rounded-xl border-2 border-gray-200/50 dark:border-gray-700/50 focus:border-emerald-400 dark:focus:border-emerald-500 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm transition-all duration-300 enhanced-focus"
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  userInput.trim() &&
                  configured &&
                  !isAnalyzing
                ) {
                  e.preventDefault();
                  generateDork();
                }
              }}
            />
            <Button
              onClick={generateDork}
              disabled={!userInput.trim() || isAnalyzing || !configured}
              className="h-12 sm:h-14 px-6 sm:px-8 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-medium text-sm sm:text-base rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isAnalyzing ? (
                <>
                  <Brain className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
                  <span>Analyse en cours...</span>
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Traduire en Dork</span>
                  <span className="sm:hidden">Traduire</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {generatedQuery && (
          <div className="space-y-4 sm:space-y-5 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                <div className="p-2 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/40 dark:to-amber-900/40 rounded-full">
                  <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h4 className="text-base sm:text-lg font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Requête générée
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Votre recherche optimisée est prête à être utilisée
              </p>
            </div>

            <div className="relative">
              <Textarea
                value={generatedQuery}
                readOnly
                className="text-xs sm:text-sm font-mono resize-none border-2 border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl p-3 sm:p-4 min-h-[80px] sm:min-h-[100px] focus:border-emerald-400 dark:focus:border-emerald-500 transition-all duration-300"
                rows={3}
              />
              <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-md text-xs font-medium">
                Dork
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={applyQuery}
                className="h-11 sm:h-12 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] font-medium text-sm sm:text-base rounded-xl"
              >
                <Search className="h-4 w-4 mr-2" />
                <span>Rechercher maintenant</span>
              </Button>
              <Button
                variant="outline"
                onClick={copyQuery}
                className="h-11 sm:h-12 border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 bg-white/50 dark:bg-gray-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-300 hover:scale-[1.02] font-medium text-sm sm:text-base rounded-xl"
              >
                <Copy className="h-4 w-4 mr-2" />
                <span>Copier</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
