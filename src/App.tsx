import './App.css'
import { useState, useEffect } from "react";
import InputTags from '@/components/input-tags'
import { Tag } from "emblor";
import { SearchBar } from './components/search-bar';
import { DockBottom } from '@/components/dock';
import { Button } from './components/ui/button';
import { TSearchEngine } from "./types";
import { tagsSites, tagsWords, tagsFileType, tagsWordsInTitle, tagsWordsInUrl, tagsSitesToExclude } from "./lib/tags-examples";
import { SettingApiProvider } from "./contexts/settingApi";


const App = () => {

  const [TagsFileType, setExampleTagsFileType] = useState<Tag[]>(tagsFileType);
  const [TagsSitesToExclude, setExampleTagsSitesToExclude] = useState<Tag[]>(tagsSitesToExclude);
  const [TagsWords, setExampleTagsWords] = useState<Tag[]>(tagsWords);
  const [TagsWordsInTitle, setExampleTagsWordsInTitle] = useState<Tag[]>(tagsWordsInTitle);
  const [TagsWordsInUrl, setExampleTagsWordsInUrl] = useState<Tag[]>(tagsWordsInUrl);
  const [TagsSites, setExampleTagsSites] = useState<Tag[]>(tagsSites);
  const [searchText, setSearchText] = useState("");
  const defaultSearchEngine: TSearchEngine = "google.com"
  const [searchEngine, setSearchEngine] = useState<TSearchEngine>(defaultSearchEngine)

  useEffect(() => {
    const storedValue = localStorage.getItem("searchEngine");
    if (storedValue) {
      setSearchEngine(storedValue as TSearchEngine);
    }
  }, [setSearchEngine]);

  function deleteAllTags() {
    setExampleTagsSites([])
    setExampleTagsWordsInUrl([])
    setExampleTagsWordsInTitle([])
    setExampleTagsWords([])
    setExampleTagsFileType([])
    setExampleTagsSitesToExclude([])
  }

  function search() {
    const sitesIncluded = TagsSites.length > 0
      ? TagsSites.map(tag => `site:${tag.text}`).join(' OR ')
      : '';

    const excludeSites = TagsSitesToExclude.length > 0
      ? TagsSitesToExclude.map(tag => `-site:${tag.text}`).join(' OR ')
      : '';

    const wordsExcluded = TagsWords.length > 0
      ? TagsWords.map(tag => `-"${tag.text}"`).join(' ')
      : '';

    const fileTypes = TagsFileType.length > 0
      ? TagsFileType.map(tag => `filetype:${tag.text}`).join(' OR ')
      : '';

    const wordsInTitle = TagsWordsInTitle.length > 0
      ? `${TagsWordsInTitle.map(tag => `intitle:"${tag.text}"`).join(' OR ')}`
      : '';

    const wordsInUrl = TagsWordsInUrl.length > 0
      ? `${TagsWordsInUrl.map(tag => `inurl:"${tag.text}"`).join(' OR ')}`
      : '';

    const queryParts = [sitesIncluded, excludeSites, fileTypes, wordsExcluded, wordsInTitle, wordsInUrl]
      .filter(part => part)  // On enlève les parties vides
      .join(' ');


    const queryString = `${searchText.trim() === '' ? "" : searchText.trim()} ${queryParts}`;
    const encodedQueryString = encodeURIComponent(queryString);
    let searchUrl = '';

    if (searchEngine === 'google.com') {
      searchUrl = `https://www.google.com/search?q=${encodedQueryString}`;
    } else if (searchEngine === 'duckduckgo.com') {
      searchUrl = `https://duckduckgo.com/?q=${encodedQueryString}`;
    } else {
      alert("Moteur de recherche non pris en charge");
      return;
    }

    window.open(searchUrl, '_blank');
  }

  return (
    <SettingApiProvider>
      <>
        <nav className=" items-center justify-between">
          <h1 className='text-3xl text-center mb-3 mt-7' style={{ fontFamily: "JetBrains Mono" }}>Deep Search</h1>
        </nav>

        <header className="">
          <SearchBar setSearchText={setSearchText} searchText={searchText} searchEngine={searchEngine} />
        </header>

        <div className="options flex flex-col gap-3">
          <InputTags id='websites' placeholder='Entrez les sites ou domaines à rechercher (ex: example.com, .org)' tags={TagsSites} setTags={setExampleTagsSites} />
          <InputTags id='site-toExclude' placeholder='Sites à exclure des résultats (ex: site1.com, site2.com)' tags={TagsSitesToExclude} setTags={setExampleTagsSitesToExclude} />
          <InputTags id='word-toExclude' placeholder='Mots à réduire dans les résultats (ex: -publicité, -spam)' tags={TagsWords} setTags={setExampleTagsWords} />
          <InputTags id='filetypes' placeholder="Types de fichiers recherchés (ex: pdf, docx, mp4, png)" tags={TagsFileType} setTags={setExampleTagsFileType} />
          <InputTags id="intitle" placeholder="Mots à inclure dans le titre (ex: guide, tutoriel)" tags={TagsWordsInTitle} setTags={setExampleTagsWordsInTitle} />
          <InputTags id="inurl" placeholder="Mots à inclure dans l'URL (ex: blog, article)" tags={TagsWordsInUrl} setTags={setExampleTagsWordsInUrl} />
          <div className="flex items-center mt-3 gap-3">
            <Button className="ml-1 w-min" onClick={search}>search</Button>
            <Button variant={'outline'} onClick={deleteAllTags}>effacer tout</Button>
          </div>
        </div>
        <div className='flex justify-end items-center'>
          <DockBottom searchEngine={searchEngine} setSearchEngine={setSearchEngine} />
        </div>
      </>
    </SettingApiProvider>
  )
}

export default App
