import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { useSettingApi, AIModel } from "../contexts/settingApi";
import { useTheme } from "./theme-provider";
import { TSearchEngine } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Settings,
  Bot,
  Search,
  Palette,
  Key,
  CheckCircle,
  AlertCircle,
  Trash2,
  Save,
  RotateCcw,
  Zap,
  Shield,
  Database,
  Moon,
  Sun,
  Monitor
} from "lucide-react";

interface SettingsPageProps {
  searchEngine: TSearchEngine;
  setSearchEngine: (engine: TSearchEngine) => void;
}

export function SettingsPage({ searchEngine, setSearchEngine }: SettingsPageProps) {
  const {
    openaiApiKey,
    geminiApiKey,
    claudeApiKey,
    selectedModel,
    configured,
    saveConfig,
    clearConfig,
    setSelectedModel,
  } = useSettingApi();

  const { theme, setTheme } = useTheme();

  // États locaux pour les formulaires
  const [localOpenaiApiKey, setLocalOpenaiApiKey] = useState(openaiApiKey);
  const [localGeminiApiKey, setLocalGeminiApiKey] = useState(geminiApiKey);
  const [localClaudeApiKey, setLocalClaudeApiKey] = useState(claudeApiKey);
  const [localSelectedModel, setLocalSelectedModel] = useState<AIModel>(selectedModel);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Paramètres avancés
  const [autoSave, setAutoSave] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [cacheEnabled, setCacheEnabled] = useState(true);

  useEffect(() => {
    setLocalOpenaiApiKey(openaiApiKey);
    setLocalGeminiApiKey(geminiApiKey);
    setLocalClaudeApiKey(claudeApiKey);
    setLocalSelectedModel(selectedModel);
  }, [openaiApiKey, geminiApiKey, claudeApiKey, selectedModel]);

  useEffect(() => {
    const hasChanges = localOpenaiApiKey !== openaiApiKey ||
      localGeminiApiKey !== geminiApiKey ||
      localClaudeApiKey !== claudeApiKey ||
      localSelectedModel !== selectedModel;
    setHasUnsavedChanges(hasChanges);
  }, [localOpenaiApiKey, localGeminiApiKey, localClaudeApiKey, localSelectedModel, openaiApiKey, geminiApiKey, claudeApiKey, selectedModel]);

  useEffect(() => {
    // Charger les paramètres avancés depuis localStorage
    const storedAutoSave = localStorage.getItem("deepSearch_autoSave");
    const storedDebugMode = localStorage.getItem("deepSearch_debugMode");
    const storedCacheEnabled = localStorage.getItem("deepSearch_cacheEnabled");

    if (storedAutoSave) setAutoSave(storedAutoSave === "true");
    if (storedDebugMode) setDebugMode(storedDebugMode === "true");
    if (storedCacheEnabled) setCacheEnabled(storedCacheEnabled === "true");
  }, []);

  const handleSearchEngineChange = (value: TSearchEngine) => {
    setSearchEngine(value);
    localStorage.setItem("searchEngine", value);
    toast({
      title: "Moteur de recherche mis à jour",
      description: `Moteur changé vers ${value === "google.com" ? "Google" : "DuckDuckGo"}`,
    });
  };

  const handleThemeChange = (value: string) => {
    setTheme(value as 'dark' | 'light' | 'system');
    localStorage.setItem('theme', value);
    toast({
      title: "Thème mis à jour",
      description: `Thème changé vers ${value}`,
    });
  };

  const handleAdvancedSettingChange = (setting: string, value: boolean) => {
    localStorage.setItem(`deepSearch_${setting}`, value.toString());
    switch (setting) {
      case "autoSave":
        setAutoSave(value);
        break;
      case "debugMode":
        setDebugMode(value);
        break;
      case "cacheEnabled":
        setCacheEnabled(value);
        break;
    }
    toast({
      title: "Paramètre mis à jour",
      description: `${setting} ${value ? "activé" : "désactivé"}`,
    });
  };

  const handleSaveApiConfig = () => {
    saveConfig(localSelectedModel, {
      openai: localOpenaiApiKey,
      gemini: localGeminiApiKey,
      claude: localClaudeApiKey,
    });
    setSelectedModel(localSelectedModel);
    toast({
      title: "Configuration sauvegardée",
      description: "Votre configuration API a été sauvegardée avec succès",
    });
  };

  const handleClearConfig = () => {
    clearConfig();
    setLocalOpenaiApiKey("");
    setLocalGeminiApiKey("");
    setLocalClaudeApiKey("");
    setLocalSelectedModel('gemini');
    toast({
      title: "Configuration effacée",
      description: "Tous les paramètres API ont été supprimés",
    });
  };

  const handleResetToSaved = () => {
    setLocalOpenaiApiKey(openaiApiKey);
    setLocalGeminiApiKey(geminiApiKey);
    setLocalClaudeApiKey(claudeApiKey);
    setLocalSelectedModel(selectedModel);
    toast({
      title: "Modifications annulées",
      description: "Les valeurs ont été restaurées",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="font-medium">
          <Settings className="h-4 w-4 mr-2" />
          Paramètres
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Paramètres de l'application
          </DialogTitle>
          <DialogDescription>
            Configurez votre expérience Deep Search selon vos préférences
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Configuration API */}
          <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Configuration API IA
                {configured && <Badge variant="secondary" className="ml-auto"><CheckCircle className="h-3 w-3 mr-1" />Configuré</Badge>}
                {!configured && <Badge variant="destructive" className="ml-auto"><AlertCircle className="h-3 w-3 mr-1" />Non configuré</Badge>}
              </CardTitle>
              <CardDescription>
                Configurez votre API pour utiliser les fonctionnalités d'intelligence artificielle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Modèle d'IA
                </Label>
                <Select value={localSelectedModel} onValueChange={(value) => setLocalSelectedModel(value as AIModel)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Gemini (Google)</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="claude">Claude (Anthropic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="openai-apikey" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Clé API OpenAI
                </Label>
                <Input
                  id="openai-apikey"
                  type="password"
                  value={localOpenaiApiKey}
                  onChange={(e) => setLocalOpenaiApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="font-mono text-sm"
                  disabled={localSelectedModel !== 'openai'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gemini-apikey" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Clé API Gemini
                </Label>
                <Input
                  id="gemini-apikey"
                  type="password"
                  value={localGeminiApiKey}
                  onChange={(e) => setLocalGeminiApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="font-mono text-sm"
                  disabled={localSelectedModel !== 'gemini'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="claude-apikey" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Clé API Claude
                </Label>
                <Input
                  id="claude-apikey"
                  type="password"
                  value={localClaudeApiKey}
                  onChange={(e) => setLocalClaudeApiKey(e.target.value)}
                  placeholder="..."
                  className="font-mono text-sm"
                  disabled={localSelectedModel !== 'claude'}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={handleSaveApiConfig} 
                  disabled={!hasUnsavedChanges}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
                {hasUnsavedChanges && (
                  <Button variant="outline" onClick={handleResetToSaved}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                )}
                <Button variant="destructive" onClick={handleClearConfig}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Effacer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Paramètres de recherche */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                Paramètres de recherche
              </CardTitle>
              <CardDescription>
                Configurez votre moteur de recherche et les options de recherche
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Moteur de recherche</Label>
                <Select value={searchEngine} onValueChange={handleSearchEngineChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google.com">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-red-500 rounded-full" />
                        Google (Recommandé)
                      </div>
                    </SelectItem>
                    <SelectItem value="duckduckgo.com">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded-full" />
                        DuckDuckGo
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Apparence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-500" />
                Apparence
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence de l'interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Thème</Label>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Clair
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Sombre
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        Système
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Paramètres avancés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Paramètres avancés
              </CardTitle>
              <CardDescription>
                Options avancées pour les utilisateurs expérimentés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Sauvegarde automatique
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Sauvegarde automatiquement vos recherches et paramètres
                  </p>
                </div>
                <Switch
                  checked={autoSave}
                  onCheckedChange={(checked) => handleAdvancedSettingChange("autoSave", checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Cache activé
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Met en cache les résultats pour améliorer les performances
                  </p>
                </div>
                <Switch
                  checked={cacheEnabled}
                  onCheckedChange={(checked) => handleAdvancedSettingChange("cacheEnabled", checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Mode debug
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Affiche des informations de débogage dans la console
                  </p>
                </div>
                <Switch
                  checked={debugMode}
                  onCheckedChange={(checked) => handleAdvancedSettingChange("debugMode", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Informations système */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Informations système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Version:</span> 2.0.0
                </div>
                <div>
                  <span className="font-medium">API Status:</span> 
                  <Badge variant={configured ? "secondary" : "destructive"} className="ml-2">
                    {configured ? "Connecté" : "Déconnecté"}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Thème:</span> {theme}
                </div>
                <div>
                  <span className="font-medium">Moteur:</span> {searchEngine === "google.com" ? "Google" : "DuckDuckGo"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}