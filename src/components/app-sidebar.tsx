import * as React from "react";
import { Link } from "react-router-dom";

import AddNewNote from "#/note/AddNew";
import { SearchForm } from "#/search-form";
import { Icons } from "#/site/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "#/ui/sidebar";
import { atom, useAtomValue } from "jotai";
import { MoreHorizontal } from "lucide-react";
import { currentNote, notesAtom } from "~/atom";
import siteConfig from "~/config/site";
import { GroupedNotes, groupNotesByDate } from "~/lib/note";
import { Note } from "~/lib/types";

// This is sample data.
// const data = {
//   navMain: [
//     {
//       title: "Getting Started",
//       url: "#",
//       items: [
//         {
//           title: "Installation",
//           url: "#",
//         },
//         {
//           title: "Project Structure",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Building Your Application",
//       url: "#",
//       items: [
//         {
//           title: "Routing",
//           url: "#",
//         },
//         {
//           title: "Data Fetching",
//           url: "#",
//           isActive: true,
//         },
//       ],
//     },
//   ],
// };

const currentNoteIdAtom = atom((get) => get(currentNote)?.id ?? -1);
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

type NoteProps = {
  note: Note;
};
function SidebarNote({ note }: NoteProps) {
  const currentNoteId = useAtomValue(currentNoteIdAtom);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={currentNoteId === note.id}>
        <Link to={`/note/${note.id}`}>{note.title}</Link>
      </SidebarMenuButton>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction>
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem>
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
