import { Loader2 } from "lucide-react";
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";
import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast"
import { SearchBarProps } from "../types";

export function SearchBar({ setSearchText, searchText, searchEngine }: SearchBarProps) {

  const { toast } = useToast()
  const tokens = `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`
  const placeholders = [
    "let's find something",
    "Feel free to ask anything",
    "Hope you like Deep Search",
  ];


  async function fetchQuery(query: string) {
    return await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokens}`,
        // "HTTP-Referer": `${YOUR_SITE_URL}`, // Optional, for including your app on openrouter.ai rankings.
        // "X-Title": `${YOUR_SITE_NAME}`, // Optional. Shows in rankings on openrouter.ai.
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // "model": "meta-llama/llama-3.1-70b-instruct:free",
        // "model": "google/gemma-2-9b-it:free",
        "model": "meta-llama/llama-3.1-405b-instruct:free",
        "messages": [
          {
            "role": "user",
            "content": `
          Instructions pour la génération de requête Google Dorks :
          
          Contexte: "${query}"
          
          Directives:
          1. Utilise les opérateurs Google Dorks 
                    
          2. Critères de pertinence :
             - Spécificité maximale
             - Combinaison optimale d'opérateurs
             - Exclusion des résultats non pertinents (-term)  
          
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
        title: "Error",
        description: "Le texte de recherche est vide ou invalide.",
      });
      return;
    }

    setIsSubmitting(true);
    fetchQuery(searchText)
      .then(response => {
        if (!response.ok) {
          toast({
            title: "Error",
            description: `Something went wrong. error: ${response.status}: ${response.statusText}`,
          });
          throw new Error('Network response was not ok');
        }
        return response.json();
      }, (reseon) => {
        console.error(reseon);
      })
      .then(data => {
        let content
        if (data.choices && data.choices.length > 0) {
          content = data.choices[0]?.message.content
        } else if (data.message && data.message.content) {
          content = data.message.content
        }
        if (content) {
          console.log(content)
          content = encodeURIComponent(content)
          window.open(`https://${searchEngine}/?q=${content}`, '_blank')
        }
      })
      .finally(() => setIsSubmitting(false));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    Submit();
  };


  return (
    <div className=" flex w-full items-center">
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
              <Loader2 className="ml-2 animate-spin" />
            </span>
          )
        }
      </Button >

    </div >
  );
}
