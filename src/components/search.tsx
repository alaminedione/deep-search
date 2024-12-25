import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";
import TypingAnimation from "@/components/ui/typing-animation";
import { RainbowButton } from "./ui/rainbow-button";

type SearchBarProps = {
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchText: string;
};

export function SearchBar(
  { setSearchText, searchText }: SearchBarProps) {

  const placeholders = [
    "let's find something",
    "Feel free to ask anything",
    "Hope you like Deep Search",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setSearchText(searchText);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.open(`https://www.duckduckgo.com/?q=${searchText}`, "_blank");
  };

  return (
    <div className=" flex flex-col justify-center  items-center px-3 py-1 w-full">
      <TypingAnimation className='mb-7'>Find anything like a magician</TypingAnimation>
      <div className="flex w-5/6">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={handleChange}
          onSubmit={onSubmit}
        />
        <RainbowButton className="w-64 "> search with AI</RainbowButton>
      </div>
    </div>

  );
}
