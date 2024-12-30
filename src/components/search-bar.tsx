import { Loader2 } from "lucide-react";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast"
import { SearchBarProps } from "../types";
import { useSettingApi } from "../contexts/settingApi";

export function SearchBar({ setSearchText, searchText, searchEngine }: SearchBarProps) {

  const { apikey, endpoint, modele, configured } = useSettingApi()

  const { toast } = useToast()

  const tokens = apikey ? apikey : ''
  const model = modele ? modele : ''
  const endpointurl = endpoint ? endpoint : ''

  const placeholders = [
    "let's find something",
    "Feel free to ask anything",
    "Hope you like Deep Search",
  ];


  async function fetchQuery(query: string) {
    if (!tokens || !endpointurl) {
      toast({
        title: "Error",
        description: "Veuillez configurer votre API",
      });
      return;
    }
    return await fetch(endpointurl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokens}`,
        // "HTTP-Referer": `${YOUR_SITE_URL}`, // Optional, for including your app on openrouter.ai rankings.
        "X-Title": "Deep-Search", // Optional. Shows in rankings on openrouter.ai.
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": model,
        "messages": [
          {
            "role": "user",
            "content": `
            un utilisateur a ecris ca pour effectuer un requete sur goolgle: ${query}
            Directives:
            Utilise des opérateurs Google Dorks pour améliorer la recherche
            Format de réponse:
            Renvoyer uniquement la requête générée, sans explications ni commentaires.
      `
          }]
      })
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);


  function Submit() {
    console.log("onSubmit: searchText ", searchText);

    if (!searchText) {
      toast({
        title: "champ de recherche vide",
        description: "veuillez entrer votre recherche",
      });
      return;
    }
    if (!configured) {
      toast({
        title: "Configurer votre API d'abord",
        description: "cliquez sur le boutton API tout en bas de la page pour la configurer",
      });
      return;
    }

    setIsSubmitting(true);

    fetchQuery(searchText)
      .then(response => {
        if (response === undefined) {
          toast({
            title: "Quelque chose s'est mal passé.",
            description: " Aucune réponse du serveur.",
          });
          throw new Error('Network response was not ok');
        }
        if (!response.ok) {
          toast({
            title: " Quelque chose s'est mal passé.",
            description: `Erreur: ${response.status}: ${response.statusText}`,
          });
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        let content;

        if (data.choices && data.choices.length > 0) {
          content = data.choices[0]?.message.content;
        } else if (data.message && data.message.content) {
          content = data.message.content;
        }

        if (content) {
          console.log(content);
          const encodedContent = encodeURIComponent(content);
          if (searchEngine === 'google.com') {
            window.open(`https://www.google.com/search?q=${encodedContent}`, '_blank');
          } else if (searchEngine === 'duckduckgo.com') {
            window.open(`https://duckduckgo.com/?q=${encodedContent}`, '_blank');
          } else {
            alert("Moteur de recherche non pris en charge");
            return;
          }
        }
      })
      .catch(error => {
        toast({
          title: "Erreur , Quelque chose s'est mal passé.",
          description: `verifier que votre API est bien configurée. Erreur: ${error}`,
        });
        console.error("Fetch error:", error);

      })
      .finally(() => {
        setIsSubmitting(false);
      });
    setSearchText("");

    console.log("configuration: ", apikey, endpoint, modele);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    Submit();
  };


  return (
    <div className=" flex justify-center gap-3 mb-3  w-full items-center">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />

      <Button className="ml-1" onClick={Submit}
        title={'generer une requete et chercher avec l\'ia'}
      >
        search with AI
        {
          isSubmitting && (
            <span >
              <Loader2 className="ml-2 animate-spin " />
            </span>
          )
        }
      </Button >

    </div >
  );
}
