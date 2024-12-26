import { TagInput } from "emblor";
import { useState } from "react";
import { TInputTags } from "../types";


export default function InputTags({ id, placeholder, tags, setTags }: TInputTags & React.HTMLAttributes<HTMLDivElement>) {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {/* <Label htmlFor={id}>{label}</Label> */}
      <TagInput
        id={id}
        tags={tags}
        setTags={(newTags) => {
          setTags(newTags);
        }}
        placeholder={placeholder}
        styleClasses={{
          tagList: {
            container: "gap-1",
          },
          input:
            " transition-shadow placeholder:text-muted-foreground/70  ",
          tag: {
            body: "relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
            closeButton:
              "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-lg flex size-7 transition-colors outline-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 text-muted-foreground/80 hover:text-foreground",
          },
        }}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        inlineTags={true}
        inputFieldPosition="top"
      />
    </div>
  );
}
