import { Tag } from "emblor";
export type InputEndAddon = {
  addon: string;
  placeholder: string;
};

export interface TInputTags {
  label: string;
  placeholder: string;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
};

export type TSearchEngine = "duckduckgo.com" | "google.com"
