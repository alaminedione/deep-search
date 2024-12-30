import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { useSettingApi } from "../contexts/settingApi"


export function SettingApi() {

  const { apikey, setApikey, endpoint, setEndpoint, modele, setModele, setConfigured } = useSettingApi()

  useEffect(() => {
    const storedApikey = localStorage.getItem("apikey");
    if (storedApikey) {
      setApikey(storedApikey as string);
    }
    const storedEndpoint = localStorage.getItem("endpoint");
    if (storedEndpoint) {
      setEndpoint(storedEndpoint as string);
    }
    const storedModele = localStorage.getItem("modele");
    if (storedModele) {
      setModele(storedModele as string);
    }

    const storedConfigured = localStorage.getItem("configured");
    if (storedConfigured) {
      setConfigured(storedConfigured === "true");
    }
  }, []);



  const API_KEY = "apikey";
  const ENDPOINT_KEY = "endpoint";
  const MODELE_KEY = "modele";
  const CONFIGURED_KEY = "configured";

  function saveApiConfiguration() {
    const trimmedApiKey = apikey.trim();
    const trimmedEndpoint = endpoint.trim();
    const trimmedModele = modele.trim();

    if (trimmedApiKey === '' || trimmedEndpoint === '') {
      setConfigured(false);
      localStorage.setItem(CONFIGURED_KEY, "false");
    }

    try {
      localStorage.setItem(API_KEY, trimmedApiKey);
      localStorage.setItem(ENDPOINT_KEY, trimmedEndpoint);
      localStorage.setItem(MODELE_KEY, trimmedModele);
      setApikey(trimmedApiKey);
      setEndpoint(trimmedEndpoint);
      setModele(trimmedModele);


      localStorage.setItem(CONFIGURED_KEY, "true");
      setConfigured(true);

      console.log("saved");

      toast({
        title: "Paramètres sauvegardés",
        description: "Les champs apikey et endpoint sont obligatoires pour une configuration valide",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde dans localStorage :", error);
      toast({
        title: "Error",
        description: "Une erreur est survenue lors de la sauvegarde.",
      });
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={'ghost'} className="font-bold">
          API
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> API</DialogTitle>
          <DialogDescription>
            Configurer les paramètres de votre API.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endpoint" className="text-right">
              Endpoint
            </Label>
            <Input id="endpoint" value={endpoint} placeholder="https://api.openai.com/v1/chat/completions" className="col-span-3"
              onChange={(e) => setEndpoint(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apikey" className="text-right">
              api key
            </Label>
            <Input id="apikey" value={apikey} placeholder="apikey" className="col-span-3"
              onChange={(e) => setApikey(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modele" className="text-right">
              modele
            </Label>
            <Input id="modele" value={modele} placeholder="modele" className="col-span-3"
              onChange={(e) => setModele(e.target.value)}
            />
          </div>

        </div>
        <DialogFooter>
          <Button type="submit" onClick={saveApiConfiguration}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 
