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
import { notesAtom } from "~/atom";
import siteConfig from "~/config/site";
import { GroupedNotes, groupNotesByDate } from "~/lib/note";

const groupedNotesAtom = atom((get) => {
  const notes = get(notesAtom);
  return groupNotesByDate(notes);
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
        {groupedNotes.map((group) => (
          <NotesGroup key={group.name} groupedNote={group} />
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
  groupedNote: GroupedNotes;
};
function NotesGroup({ groupedNote: { name, notes } }: NotesGroupProps) {
  if (notes.length === 0) return null;

  return (
    <SidebarGroup key={name}>
      <SidebarGroupLabel>{name}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {notes.map((note) => (
            <SidebarNote key={note.id} note={note} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
