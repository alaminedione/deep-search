import { Loader2 } from "lucide-react";
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";
import TypingAnimation from "../components/ui/typing-animation";
import { RainbowButton } from "./ui/rainbow-button";
import { useState } from "react";

type SearchBarProps = {
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchText: string;
};

export function SearchBar(
  { setSearchText, searchText }: SearchBarProps) {

  const placeholders = [
    "let's find something",
    "Feel free to ask anything",
    "Hope you like Deep Search",
  ];
  const tokens = `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`

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
        "model": "google/gemma-2-9b-it:free",
        "messages": [
          {
            "role": "user",
            "content":
              `
              - requête : ${query}
              - élabore une requête pertinente en utilisant les Google Dorks
              - fournis uniquement la requête que tu as générée 
              `
          }
        ]
      })
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  function Submit() {
    console.log("onSubmit: searchText ", searchText);
    if (!searchText) {
      return;
    }

    setIsSubmitting(true);
    fetchQuery(searchText)
      .then(response => response.json(), console.error)
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
          window.open(`https://duckduckgo.com/?q=${content}`, '_blank')
        }
      })
      .finally(() => setIsSubmitting(false));
  }
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Submit();
  };

  return (
    <div className=" flex flex-col justify-center  items-center px-3 py-1 w-full">
      <TypingAnimation className='mb-7'>Find anything like a magician</TypingAnimation>
      <div className="flex w-5/6">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
        <RainbowButton className="w-64 " onClick={Submit}> search with AI

          {isSubmitting && (
            <span >
              <Loader2 className="ml-2 animate-spin" />
            </span>
          )}
        </RainbowButton>
      </div>
    </div>
  );
}



