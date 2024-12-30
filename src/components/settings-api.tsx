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

  const { apikey, setApikey, endpoint, setEndpoint, modele, setModele } = useSettingApi()

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
  }, [setApikey, setEndpoint, setModele]);


  function save() {
    if (apikey === '' || endpoint === '') {
      toast({
        title: "Error",
        description: "les champs apikey et endpoint sont vides",
      });
    }
    localStorage.setItem("apikey", apikey);
    localStorage.setItem("endpoint", endpoint);
    localStorage.setItem("modele", modele);
    console.log("saved")
    toast({
      title: "Saved",
      description: "Les paramètres ont été sauvegardés",
    });
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
          <Button type="submit" onClick={save}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 
