import { Input } from "@/components/ui/input";

import { InputEndAddon } from "../types";

export default function InputEndAddOn({ addon, placeholder }: InputEndAddon) {
  return (
    <div className="space-y-2">
      <div className="flex rounded-lg shadow-sm shadow-black/5">
        <span className="-z-10 inline-flex items-center rounded-s-lg border border-input bg-background px-3 text-sm text-muted-foreground">
          {addon}
        </span>
        <Input
          id="input-14"
          className="-ms-px rounded-s-none shadow-none"
          placeholder={placeholder}
          type="text"
        />
      </div>
    </div>
  );
}
