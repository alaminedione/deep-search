import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { History } from "lucide-react"
import { Checkbox } from "./ui/checkbox"


export function HistorySheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <History />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>History</SheetTitle>
          <SheetDescription>
            En developpement
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <ul>
            <li className="flex justify-between">
              <Checkbox />
              <div> requetes </div>
              <span>
                copy
              </span>
              <span>
                delete
              </span>
            </li>
            <li className="flex justify-between">
              <Checkbox />
              <div> requetes </div>
              <span>
                copy
              </span>
              <span>
                delete
              </span>
            </li>

          </ul>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">clear all</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
