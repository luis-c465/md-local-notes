import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "#/ui/sidebar";
import { atom, useAtomValue } from "jotai";
import { NoteAtom, notesAtom } from "~/atom";
import { dateRanges } from "~/lib/note";
import SidebarNote from "./Note";

export type GroupedNotes = {
  name: string;
  atoms: NoteAtom[];
};

export const groupedNotesAtom = atom<GroupedNotes[]>((get) => {
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
export default function Content() {
  const groupedNotes = useAtomValue(groupedNotesAtom);

  return (
    <>
      {groupedNotes.map((group, i) => (
        <NotesGroup key={i} group={group} />
      ))}
    </>
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
