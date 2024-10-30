import { Link } from "react-router-dom";

import AddNewNote from "#/note/AddNew";
import SidebarNote from "#/note/SidebarNote";
import { SearchForm } from "#/search-form";
import { Icons } from "#/site/icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "#/ui/sidebar";
import { atom, useAtomValue } from "jotai";
import { NoteAtom, notesAtom } from "~/atom";
import siteConfig from "~/config/site";
import { dateRanges } from "~/lib/note";

export type GroupedNotes = {
  name: string;
  atoms: NoteAtom[];
};

const groupedNotesAtom = atom<GroupedNotes[]>((get) => {
  const notesObj = get(notesAtom);

  const atoms = Object.values(notesObj);

  const groups: GroupedNotes[] = dateRanges.map(({ name }) => ({
    name,
    atoms: [],
  }));

  for (const atom of atoms) {
    const val = get(atom);
    if (!val) continue;

    for (let i = 0; i < dateRanges.length; i++) {
      const { end } = dateRanges[i];

      if (val.updatedAt <= end) {
        // If the value of the atom was null it would be ignored
        groups[i].atoms.push(atom as NoteAtom);
        break; // Stop checking other date ranges once a match is found
      }
    }
  }

  return groups;
});

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const groupedNotes = useAtomValue(groupedNotesAtom);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link to="/" className="flex items-center space-x-2">
          <Icons.logo className="h-6 w-6 ml-2" />
          <span className="inline-block font-bold">{siteConfig.name}</span>
        </Link>

        <SearchForm />
      </SidebarHeader>

      <SidebarContent>
        {groupedNotes.map((group, i) => (
          <NotesGroup key={i} group={group} />
        ))}
      </SidebarContent>

      <SidebarRail />

      <SidebarFooter>
        <AddNewNote />
      </SidebarFooter>
    </Sidebar>
  );
}

type NotesGroupProps = {
  group: GroupedNotes;
};
function NotesGroup({ group: { atoms, name } }: NotesGroupProps) {
  if (atoms.length === 0) return null;

  return (
    <SidebarGroup key={name}>
      <SidebarGroupLabel>{name}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {atoms.map((atom) => (
            <SidebarNote key={`${atom}`} atom={atom} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
