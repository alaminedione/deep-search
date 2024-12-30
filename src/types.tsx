import { SetStateAction } from "react";
import { Tag } from "emblor";
export type InputEndAddon = {
  addon: string;
  placeholder: string;
};

export interface TInputTags {
  placeholder: string;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
};

export type TSearchEngine = "duckduckgo.com" | "google.com"

export type SearchBarProps = {
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchText: string;
  searchEngine: string;
};

export interface propsSettingSearchEngine {
  searchEngine: TSearchEngine,
  setSearchEngine: React.Dispatch<SetStateAction<TSearchEngine>>
}
