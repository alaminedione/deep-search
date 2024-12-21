import { Tag } from "emblor";
export type InputEndAddon = {
  addon: string;
  placeholder: string;
};

export type TInputTags = {
  id?: string;
  label: string;
  placeholder: string;
  exampleTags: Tag[];
  setExampleTags: React.Dispatch<React.SetStateAction<Tag[]>>;
};
