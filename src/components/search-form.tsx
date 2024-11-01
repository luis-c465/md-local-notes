import { atom, useAtom } from "jotai";
import { SearchIcon } from "lucide-react";
import { notesListAtom } from "~/atom";

import { Label } from "~/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "~/components/ui/sidebar";

export const searchValueAtom = atom("");

export const filteredNotesAtom = atom((get) => {
  const searchValue = get(searchValueAtom);
  const notes = get(notesListAtom);

  if (searchValue.length === 0) return notes;

  return notes.filter((atom) => {
    const note = get(atom);
    if (note === null) return false;

    return (
      note.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      note.content.toLowerCase().includes(searchValue.toLowerCase())
    );
  });
});

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <SearchInput />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}

function SearchInput() {
  const [searchValue, setSearchValue] = useAtom(searchValueAtom);

  return (
    <>
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>

      <SidebarInput
        defaultValue={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        id="search"
        placeholder="Search your notes ..."
        className="pl-8"
      />

      <SearchIcon className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
    </>
  );
}
