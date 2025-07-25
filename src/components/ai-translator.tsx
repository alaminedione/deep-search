import { useState, useCallback } from "react";
import { Brain, Lightbulb, Copy, Search, Wand2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "../hooks/use-toast";

interface AiTranslatorProps {
  onQueryGenerated: (query: string) => void;
  initialQuery?: string;
}

async function getAIResponse(input: string): Promise<string> {
  // In a real-world scenario, this would be an API call to a large language model.
  return new Promise(resolve => {
    setTimeout(() => {
      const responses: { [key: string]: string } = {
        "pdf documents about artificial intelligence": 'filetype:pdf "artificial intelligence"',
        "free python courses for beginners": 'inurl:free "python course" beginner',
        "recent security vulnerabilities": 'intitle:"security vulnerability" after:2023',
      };
      const response = responses[input.toLowerCase()] || `"${input}"`;
      resolve(response);
    }, 1000);
  });
}

export function AiTranslator({ onQueryGenerated, initialQuery = "" }: AiTranslatorProps) {
  const { toast } = useToast();
  const [userInput, setUserInput] = useState(initialQuery);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedQuery, setGeneratedQuery] = useState("");

  const generateDork = useCallback(async () => {
    if (!userInput.trim()) return;

    setIsAnalyzing(true);
    const query = await getAIResponse(userInput);
    setGeneratedQuery(query);
    setIsAnalyzing(false);

    toast({
      title: "AI-Generated Dork",
      description: "The AI has generated a Google Dork for your query.",
    });
  }, [userInput, toast]);

  const applyQuery = useCallback(() => {
    onQueryGenerated(generatedQuery);
    toast({ title: "Query Applied!" });
  }, [generatedQuery, onQueryGenerated, toast]);

  const copyQuery = useCallback(() => {
    navigator.clipboard.writeText(generatedQuery);
    toast({ title: "Copied to clipboard!" });
  }, [generatedQuery, toast]);

  return (
    <div className="space-y-6 p-6 border rounded-xl bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Google Dork Translator
          </h3>
        </div>
        <p className="text-muted-foreground">
          Ask in plain English, and the AI will translate it into an advanced Google Dork query.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ai-input" className="text-base font-medium">
            Your Request
          </Label>
          <div className="flex gap-3">
            <Input
              id="ai-input"
              placeholder="e.g., I want free courses for beginners..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="h-12 text-base"
            />
            <Button 
              onClick={generateDork}
              disabled={!userInput.trim() || isAnalyzing}
              className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Brain className="mr-2 h-5 w-5 animate-pulse" />
                  Translating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Translate
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
                AI-Generated Google Dork
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
                Apply Query
              </Button>
              <Button variant="outline" onClick={copyQuery} className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copy Query
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
