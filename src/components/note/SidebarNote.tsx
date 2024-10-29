import { Button } from "#/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/ui/dropdown-menu";
import { Input } from "#/ui/input";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "#/ui/sidebar";
import {
  atom,
  createStore,
  Provider,
  useAtom,
  useAtomValue,
  useSetAtom,
  useStore,
} from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { CheckIcon, MoreHorizontalIcon } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { currentNote as currentNoteAtom } from "~/atom";
import { saveNote } from "~/lib/storage";
import { Note } from "~/lib/types";

const editModeAtom = atom(false);
// This value will be hydrated
const sidebarNoteAtom = atom<Note>({} as Note);
const updateSidebarTitleAtom = atom(null, (get, set) => {
  const note = get(sidebarNoteAtom);
  const title = get(editedNoteNameAtom);
  const newNote = {
    ...note,
    title,
  };

  set(sidebarNoteAtom, newNote);
  saveNote(newNote);
  set(editModeAtom, false);
});
const editedNoteNameAtom = atom("");

type SidebarNoteProps = {
  note: Note;
};

const currentNoteIdAtom = atom((get) => get(currentNoteAtom)?.id ?? -1);

export default function SidebarNote({ note }: SidebarNoteProps) {
  const store = useMemo(createStore, []);
  useHydrateAtoms([[sidebarNoteAtom, note]], { store });

  return (
    <Provider store={store}>
      <Menu />
    </Provider>
  );
}

function Menu() {
  return (
    <SidebarMenuItem className="flex gap-2">
      <MenuButton />

      <Action />
    </SidebarMenuItem>
  );
}

function MenuButton() {
  const store = useStore();
  const editMode = useAtomValue(editModeAtom, { store });

  const currentNoteId = useAtomValue(currentNoteIdAtom);
  const sidebarNote = useAtom(sidebarNoteAtom, { store });

  const isActive = useMemo(
    () => currentNoteId === sidebarNote[0].id,
    [currentNoteId, sidebarNote],
  );

  return (
    <SidebarMenuButton asChild={editMode} className="py-0" isActive={isActive}>
      {editMode ? <NoteName /> : <NoteLink />}
    </SidebarMenuButton>
  );
}

function Action() {
  const store = useStore();
  const editMode = useAtomValue(editModeAtom, { store });

  if (editMode) {
    return <SubmitNameAction />;
  } else {
    return <NoteActions />;
  }
}

function NoteActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction>
          <MoreHorizontalIcon />
        </SidebarMenuAction>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="start">
        <RenameAction />

        <DropdownMenuItem>
          <span>Delete</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span>View info</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SubmitNameAction() {
  const store = useStore();
  const updateSidebarTitle = useSetAtom(updateSidebarTitleAtom, { store });

  return (
    <Button onClick={updateSidebarTitle} variant="outline" size="icon">
      <CheckIcon className="size-4" />
    </Button>
  );
}

function RenameAction() {
  const store = useStore();
  const setEditMode = useSetAtom(editModeAtom, { store });

  return (
    <DropdownMenuItem onClick={() => setEditMode(true)}>
      <span>Rename</span>
    </DropdownMenuItem>
  );
}

function NoteLink() {
  const store = useStore();
  const note = useAtomValue(sidebarNoteAtom, { store });

  return (
    <Link className="w-full h-full py-2" to={`/note/${note.id}`}>
      {note.title}
    </Link>
  );
}

function NoteName() {
  const store = useStore();
  const note = useAtomValue(sidebarNoteAtom, { store });
  const setEditedNoteName = useSetAtom(editedNoteNameAtom, { store });

  return (
    <Input
      className="w-full h-full py-2 m-0"
      placeholder="name"
      defaultValue={note.title}
      onInput={(e) => setEditedNoteName(e.currentTarget.value)}
    />
  );
}
