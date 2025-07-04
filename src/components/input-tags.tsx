import { TagInput } from "emblor";
import { useState } from "react";
import { motion } from "framer-motion";
import { TInputTags } from "../types";


export default function InputTags({ id, placeholder, tags, setTags }: TInputTags & React.HTMLAttributes<HTMLDivElement>) {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
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
            " transition-all duration-200 placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/20 focus:border-primary ",
          tag: {
            body: "relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7 transition-all duration-200 hover:shadow-sm hover:border-primary/50",
            closeButton:
              "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-lg flex size-7 transition-all duration-200 outline-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 text-muted-foreground/80 hover:text-foreground hover:bg-destructive/10",
          },
        }}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        inlineTags={true}
        inputFieldPosition="top"
      />
    </motion.div>
  );
}
