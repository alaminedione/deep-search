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

export interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
  searchEngine: TSearchEngine;
  isFavorite?: boolean;
  tags?: string[];
  category?: string;
  notes?: string;
}

export type SearchBarProps = {
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchText: string;
  searchEngine: string;
  currentSearchData?: SearchHistory;
  onApplyAdvancedSearch?: (searchData: SearchHistory) => void;
};

export interface propsSettingSearchEngine {
  searchEngine: TSearchEngine,
  setSearchEngine: React.Dispatch<SetStateAction<TSearchEngine>>
}
