import './App.css'
import { useState } from "react";
import InputTags from './components/input-tags'
import { Tag } from "emblor";
import { SearchBar } from './components/search';
import { DockBottom } from './components/dock';
import { Button } from './components/ui/button';
import { useToast } from "./hooks/use-toast";
import { TSearchEngine } from "./types";
import { tagsSites, tagsWords, tagsFileType, tagsWordsInTitle, tagsWordsInUrl, tagsSitesToExclude } from "./lib/tags-examples";

const App = () => {
  const [TagsFileType, setExampleTagsFileType] = useState<Tag[]>(tagsFileType);
  const [TagsSitesToExclude, setExampleTagsSitesToExclude] = useState<Tag[]>(tagsSitesToExclude);
  const [TagsWords, setExampleTagsWords] = useState<Tag[]>(tagsWords);
  const [TagsWordsInTitle, setExampleTagsWordsInTitle] = useState<Tag[]>(tagsWordsInTitle);
  const [TagsWordsInUrl, setExampleTagsWordsInUrl] = useState<Tag[]>(tagsWordsInUrl);
  const [TagsSites, setExampleTagsSites] = useState<Tag[]>(tagsSites);
  const [searchText, setSearchText] = useState("");
  const { toast } = useToast()


  function deleteAllTags() {
    setExampleTagsSites([])
    setExampleTagsWordsInUrl([])
    setExampleTagsWordsInTitle([])
    setExampleTagsWords([])
    setExampleTagsFileType([])
    setExampleTagsSitesToExclude([])
  }


  const defaultSearchEngine: TSearchEngine = "duckduckgo.com"
  const [searchEngine, setSearchEngine] = useState<TSearchEngine>(defaultSearchEngine)

  function search() {
    // Vérification des tableaux
    if (![TagsSites, TagsSitesToExclude, TagsWords, TagsFileType, TagsWordsInTitle, TagsWordsInUrl].every(Array.isArray)) {
      console.error("Un ou plusieurs tableaux sont invalides.");
      return;
    }

    const sitesIncluded = TagsSites.map(tag => `site:${tag.text}`).join(' OR ');
    const excludeSites = TagsSitesToExclude.map(tag => `-site:${tag.text}`).join(' OR ');
    const wordsExcluded = TagsWords.map(tag => `-"${tag.text}"`).join(' ');
    const fileTypes = TagsFileType.map(tag => `filetype:${tag.text}`).join(' OR ');
    const wordsInTitle = TagsWordsInTitle.length > 0
      ? `intitle:(${TagsWordsInTitle.map(tag => `"${tag.text}"`).join(' OR ')})`
      : '';
    const wordsInUrl = TagsWordsInUrl.length > 0
      ? `inurl:(${TagsWordsInUrl.map(tag => `"${tag.text}"`).join(' OR ')})`
      : '';

    const queryParts = [sitesIncluded, excludeSites, fileTypes, wordsExcluded, wordsInTitle, wordsInUrl]
      .filter(part => part)
      .join(' ');

    if (!searchText || typeof searchText !== 'string' || searchText.trim() === '') {
      console.error("Le texte de recherche est vide ou invalide.");
      toast({
        title: "Error",
        description: "Le texte de recherche est vide ou invalide.",
      });
      return;
    }

    const queryString = `${searchText.trim()} ${queryParts}`;
    const encodedQueryString = encodeURIComponent(queryString);
    const searchUrl = `https://${searchEngine}/?q=${encodedQueryString}`;

    window.open(searchUrl, '_blank');
  }

  return (
    <>
      <h1 className='text-3xl text-center mb-3 mt-7' style={{ fontFamily: "JetBrains Mono" }}>Deep Search</h1>
      <header className="flex items-center justify-center">
        <SearchBar setSearchText={setSearchText} searchText={searchText} searchEngine={searchEngine} />
      </header>
      <div className="options flex flex-col gap-3">
        <InputTags id='websites' label='websites' placeholder='sur quels websites ou noms de domaines tu veux faire les recherches' tags={TagsSites} setTags={setExampleTagsSites} />
        <InputTags id='site-toExclude' label='ajouter des sites a exclure' placeholder='ajouter des sites a exclure  ' tags={TagsSitesToExclude} setTags={setExampleTagsSitesToExclude} />
        <InputTags id='word-toExclude' label='ajouter des mots a exclure' placeholder='ajouter des mots a exclure' tags={TagsWords} setTags={setExampleTagsWords} />
        <InputTags id='filetypes' label='ajouter les types de fichiers' placeholder="types de fichier example: pdf, docx, mp4, png" tags={TagsFileType} setTags={setExampleTagsFileType} />
        <InputTags id="intitle" label="intitle" placeholder="mots qui doivent apparaître dans le titre" tags={TagsWordsInTitle} setTags={setExampleTagsWordsInTitle} />
        <InputTags id="inurl" label="inurl" placeholder="mots qui doivent apparaître dans l'url" tags={TagsWordsInUrl} setTags={setExampleTagsWordsInUrl} />
        <div className="flex  items-center mt-3  gap-3">
          <Button className="ml-1 w-min" onClick={search}>
            search
          </Button>
          <Button variant={'outline'} onClick={deleteAllTags}>effacer tout
          </Button>
        </div>
      </div >
      <div className=' absolute bottom-0 right-0 flex justify-end items-center'>
        <DockBottom />
      </div>
    </>

  )
}



export default App
