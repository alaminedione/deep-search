import './App.css'
import { useState } from "react";
import InputTags from './components/input-tags'
import { Tag } from "emblor";
import { SearchBar } from './components/search';
import ShimmerButton from './components/ui/shimmer-button';
import { DockBottom } from './components/dock';
import { Button } from './components/ui/button';



const App = () => {

  const [TagsFileType, setExampleTagsFileType] = useState<Tag[]>(tagsFileType);
  const [TagsSitesToExclude, setExampleTagsSitesToExclude] = useState<Tag[]>(tagsSitesToExclude);
  const [TagsWords, setExampleTagsWords] = useState<Tag[]>(tagsWords);
  const [TagsWordsInTitle, setExampleTagsWordsInTitle] = useState<Tag[]>(tagsWordsInTitle);
  const [TagsWordsInUrl, setExampleTagsWordsInUrl] = useState<Tag[]>(tagsWordsInUrl);
  // const [exampleTagsWordsInText, setExampleTagsWordsInText] = useState<Tag[]>(tagsExampleWordsInText);
  const [TagsSites, setExampleTagsSites] = useState<Tag[]>(tagsSites);
  const [searchText, setSearchText] = useState("");


  function deleteAllTags() {
    setExampleTagsSites([])
    setExampleTagsWordsInUrl([])
    setExampleTagsWordsInTitle([])
    setExampleTagsWords([])
    setExampleTagsFileType([])
    setExampleTagsSitesToExclude([])
  }

  function search() {
    const sitesIncluded = TagsSites.map(tag => `site:${tag.text}`).join(' OR ')
    const excludeSites = TagsSitesToExclude.map(tag => `-site:${tag.text}`).join(' OR ')
    const wodsExcluded = TagsWords.map(tag => `-"${tag.text}"`).join(' ')
    const fileTypes = TagsFileType.map(tag => `filetype:${tag.text}`).join(' OR ')
    const wodsInTitle = 'intitle:' + TagsWordsInTitle.map(tag => `"${tag.text}"`).join(' ')
    const wodsInUrl = "inurl:" + TagsWordsInUrl.map(tag => `"${tag.text}"`).join(' ')
    // const wodsInText = exampleTagsWordsInText.map(tag => `intext:${tag.text}`).join(' ')

    const queryParams = [sitesIncluded, excludeSites, fileTypes, wodsExcluded, wodsInTitle, wodsInUrl].filter(param => param)
    const queryString = queryParams.join(' ')
    const encodedQueryString = encodeURIComponent(queryString)
    const searchUrl = `https://duckduckgo.com/?q=${encodedQueryString}`
    window.open(searchUrl, '_blank')
  }

  return (
    <>
      <header className="flex items-center justify-center">
        <SearchBar setSearchText={setSearchText} />
      </header>


      <div className="options flex flex-col gap-1 mt-3">
        <InputTags id='websites' label='websites' placeholder='sur quels websites ou noms de domaines tu veux faire les recherches' tags={TagsSites} setTags={setExampleTagsSites} />
        <InputTags id='site-toExclude' label='ajouter des sites a exclure' placeholder='ajouter des sites a exclure  ' tags={TagsSitesToExclude} setTags={setExampleTagsSitesToExclude} />
        <InputTags id='word-toExclude' label='ajouter des mots a exclure' placeholder='ajouter des mots a exclure' tags={TagsWords} setTags={setExampleTagsWords} />
        <InputTags id='filetypes' label='ajouter les types de fichiers' placeholder="types de fichier example: pdf, docx, mp4, png" tags={TagsFileType} setTags={setExampleTagsFileType} />
        <InputTags id="intitle" label="intitle" placeholder="mots qui doivent apparaître dans le titre" tags={TagsWordsInTitle} setTags={setExampleTagsWordsInTitle} />
        <InputTags id="inurl" label="inurl" placeholder="mots qui doivent apparaître dans l'url" tags={TagsWordsInUrl} setTags={setExampleTagsWordsInUrl} />
        {/* <InputTags id="intext" label="intext" placeholder="mots qui doivent apparaître dans le texte" exampleTags={exampleTagsWordsInText} setExampleTags={setExampleTagsWordsInText} /> */}
        <Button variant={'outline'} className='w-64 ml-auto' onClick={deleteAllTags}>effacer tout </Button>
      </div>
      <div className='flex justify-between items-center'>
        <ShimmerButton className='flex  w-92' onClick={search}>I'm feeling lucky</ShimmerButton>
        <DockBottom />

      </div>

    </>

  )
}
const tagsSites = [
  {
    id: "1",
    text: "example.com",
  },
  {
    id: "2",
    text: ".com",
  },
  {
    id: "3",
    text: "good.com",
  },
];
const tagsWords = [
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
const tagsFileType = [
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
const tagsWordsInTitle = [
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
const tagsWordsInUrl = [
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

const tagsWordsInText = [
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

const tagsSitesToExclude = [
  {
    id: "1",
    text: "example.com",
  },
  {
    id: "2",
    text: "mydomain.com",
  },
  {
    id: "3",
    text: "manni.net",
  }
];

export default App
