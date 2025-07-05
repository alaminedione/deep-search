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
import { useSettingApi } from "../contexts/settingApi";
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
  Globe,
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
    apikey, 
    endpoint, 
    modele, 
    configured, 
    validateAndSaveConfig,
    clearConfig
  } = useSettingApi();
  
  const { theme, setTheme } = useTheme();
  
  // États locaux pour les formulaires
  const [localApikey, setLocalApikey] = useState(apikey);
  const [localEndpoint, setLocalEndpoint] = useState(endpoint);
  const [localModele, setLocalModele] = useState(modele);
  const [isValidating, setIsValidating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Paramètres avancés
  const [autoSave, setAutoSave] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const [cacheEnabled, setCacheEnabled] = useState(true);

  useEffect(() => {
    setLocalApikey(apikey);
    setLocalEndpoint(endpoint);
    setLocalModele(modele);
  }, [apikey, endpoint, modele]);

  useEffect(() => {
    const hasChanges = localApikey !== apikey || localEndpoint !== endpoint || localModele !== modele;
    setHasUnsavedChanges(hasChanges);
  }, [localApikey, localEndpoint, localModele, apikey, endpoint, modele]);

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

  const handleSaveApiConfig = async () => {
    if (!localApikey.trim() || !localEndpoint.trim() || !localModele.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Tous les champs sont obligatoires",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    try {
      const isValid = await validateAndSaveConfig(localApikey, localEndpoint, localModele);
      
      if (isValid) {
        toast({
          title: "Configuration sauvegardée",
          description: "Votre configuration API a été validée et sauvegardée avec succès",
        });
      } else {
        toast({
          title: "Erreur de validation",
          description: "Impossible de valider la configuration API. Vérifiez vos paramètres.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la validation",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleClearConfig = () => {
    clearConfig();
    setLocalApikey("");
    setLocalEndpoint("");
    setLocalModele("");
    toast({
      title: "Configuration effacée",
      description: "Tous les paramètres API ont été supprimés",
    });
  };

  const handleResetToSaved = () => {
    setLocalApikey(apikey);
    setLocalEndpoint(endpoint);
    setLocalModele(modele);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endpoint" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Endpoint API
                  </Label>
                  <Input
                    id="endpoint"
                    value={localEndpoint}
                    onChange={(e) => setLocalEndpoint(e.target.value)}
                    placeholder="https://api.openai.com/v1/chat/completions"
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modele" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Modèle
                  </Label>
                  <Input
                    id="modele"
                    value={localModele}
                    onChange={(e) => setLocalModele(e.target.value)}
                    placeholder="gpt-3.5-turbo"
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apikey" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Clé API
                </Label>
                <Input
                  id="apikey"
                  type="password"
                  value={localApikey}
                  onChange={(e) => setLocalApikey(e.target.value)}
                  placeholder="sk-..."
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={handleSaveApiConfig} 
                  disabled={isValidating || !hasUnsavedChanges}
                  className="flex-1"
                >
                  {isValidating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Validation...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder et valider
                    </>
                  )}
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