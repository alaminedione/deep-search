import { SetStateAction } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "./ui/select"
import { TSearchEngine } from "@/types"

export interface propsSettingSearchEngine {
  searchEngine: TSearchEngine,
  setSearchEngine: React.Dispatch<SetStateAction<TSearchEngine>>
}


function SettingSearchEngin({ searchEngine, setSearchEngine }: propsSettingSearchEngine) {

  const handleSearchEngine = (value: string) => {
    setSearchEngine(value as TSearchEngine);
    localStorage.setItem("searchEngine", value);
  };

  return <div className='flex justify-center items-center gap-3'>
    <Select value={searchEngine} onValueChange={handleSearchEngine} >
      <SelectTrigger className="" >
        Engine
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="duckduckgo.com">duckduckgo</SelectItem>
        <SelectItem value="google.com">google (recommandé)</SelectItem>
      </SelectContent>
    </Select>
  </div>
}


export default SettingSearchEngin

