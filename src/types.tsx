import { Tag } from "emblor";
export type InputEndAddon = {
  addon: string;
  placeholder: string;
};

export type TInputTags = {
  id?: string;
  label: string;
  placeholder: string;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
};
