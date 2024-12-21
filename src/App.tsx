import './App.css'
import { useState } from "react";
import TypingAnimation from "./components/ui/typing-animation"
import { Input } from "./components/ui/input"
import { Search } from 'lucide-react'
import { Button } from "./components/ui/button"
import InputEndAddOn from "./components/input-end-add-on"
import InputTags from './components/input-tags'
import { Tag } from "emblor";



const App = () => {
  const tagsExampleSites = [
    {
      id: "1",
      text: "example.com",
    },
    {
      id: "2",
      text: "lucky.com",
    },
    {
      id: "3",
      text: "good.com",
    },
  ];
  const tagsExampleWords = [
    {
      id: "1",
      text: "lucky",
    },
    {
      id: "2",
      text: "nice",
    },
    {
      id: "3",
      text: "awesome",
    }
  ];
  const tagsExampleFileType = [
    {
      id: "1",
      text: "pdf",
    },
    {
      id: "3",
      text: "mp4",
    },
    {
      id: "4",
      text: "png",
    }
  ];
  const tagsExampleWordsInTitle = [
    {
      id: "1",
      text: "beautiful",
    },
    {
      id: "2",
      text: "nice",
    },
    {
      id: "3",
      text: "awesome",
    }
  ];
  const tagsExampleWordsInUrl = [
    {
      id: "1",
      text: "admin",
    },
    {
      id: "2",
      text: "something",
    },
    {
      id: "3",
      text: "dashbord",
    }
  ];

  const tagsExampleWordsInText = [
    {
      id: "1",
      text: "cool",
    },
    {
      id: "2",
      text: "nice",
    },
    {
      id: "3",
      text: "awesome",
    }
  ];

  const [exampleTagsFileType, setExampleTagsFileType] = useState<Tag[]>(tagsExampleFileType);
  const [exampleTagsSites, setExampleTagsSites] = useState<Tag[]>(tagsExampleSites);
  const [exampleTagsWords, setExampleTagsWords] = useState<Tag[]>(tagsExampleWords);
  const [exampleTagsWordsInTitle, setExampleTagsWordsInTitle] = useState<Tag[]>(tagsExampleWordsInTitle);
  const [exampleTagsWordsInUrl, setExampleTagsWordsInUrl] = useState<Tag[]>(tagsExampleWordsInUrl);
  const [exampleTagsWordsInText, setExampleTagsWordsInText] = useState<Tag[]>(tagsExampleWordsInText);
  return (
    <>
      <header className="flex items-center justify-center">
        <TypingAnimation>
          Deep Search
        </TypingAnimation>
      </header>

      <div className="search-bar flex items-center justify-center ">
        <Input type="text" placeholder="Search..." className=" w-1/2" />
        <Button> <Search className="search-icon" /> Search</Button>
      </div>

      <div className="options flex flex-col gap-3 m-10">
        <InputEndAddOn addon='https://' placeholder='example.com  ou .com   pour les sites avec comme nom de domaine .com' />
        <InputTags id='site-toExclude' label='ajouter des sites a exclure' placeholder='ajouter des sites a exclure  ' exampleTags={exampleTagsSites} setExampleTags={setExampleTagsSites} />
        <InputTags id='word-toExclude' label='ajouter des mots a exclure' placeholder='ajouter des mots a exclure' exampleTags={exampleTagsWords} setExampleTags={setExampleTagsWords} />
        <InputTags id='filetypes' label='ajouter les types de fichiers' placeholder="types de fichier example: pdf, docx, mp4, png" exampleTags={exampleTagsFileType} setExampleTags={setExampleTagsFileType} />
        <InputTags id="intitle" label="intitle" placeholder="mots qui doivent apparaître dans le titre" exampleTags={exampleTagsWordsInTitle} setExampleTags={setExampleTagsWordsInTitle} />
        <InputTags id="inurl" label="inurl" placeholder="mots qui doivent apparaître dans l'url" exampleTags={exampleTagsWordsInUrl} setExampleTags={setExampleTagsWordsInUrl} />
        <InputTags id="intext" label="intext" placeholder="mots qui doivent apparaître dans le texte" exampleTags={exampleTagsWordsInText} setExampleTags={setExampleTagsWordsInText} />

      </div>
    </>

  )
}

export default App
