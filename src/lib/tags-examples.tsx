import { Tag } from "emblor";
const tagsSites: Tag[] = [
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
    text: ".org"
  }
];
const tagsWords: Tag[] = [
];
const tagsFileType: Tag[] = [
  {
    id: "1",
    text: "pdf",
  },
  {
    id: "2",
    text: "epub",
  },
];
const tagsWordsInTitle: Tag[] = [
  {
    id: "1",
    text: "l'étranger",
  },
  {
    id: "2",
    text: "albert camus ",
  },
];
const tagsWordsInUrl: Tag[] = [];
const tagsSitesToExclude: Tag[] = [];


export {
  tagsSites,
  tagsWords,
  tagsFileType,
  tagsWordsInTitle,
  tagsWordsInUrl,
  tagsSitesToExclude
}
