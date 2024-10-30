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
  getDefaultStore,
  Provider,
  useAtom,
  useAtomValue,
  useSetAtom,
  useStore,
} from "jotai";
import { CheckIcon, MoreHorizontalIcon } from "lucide-react";
import { createContext, useCallback, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { currentNoteAtom, NoteAtom, store as defaultStore } from "~/atom";
import { Note } from "~/lib/types";

const editModeAtom = atom(false);
// const updateSidebarTitleAtom = atom(null, (get, set) => {
//   const note = get(sidebarNoteAtom);
//   const title = get(editedNoteNameAtom);
//   const newNote = {
//     ...note,
//     title,
//   };

//   set(sidebarNoteAtom, newNote);
//   saveNote(newNote);
//   set(editModeAtom, false);
// });
const editedNoteNameAtom = atom("");

type SidebarNoteProps = {
  atom: NoteAtom;
};

const currentNoteIdAtom = atom((get) => get(currentNoteAtom)?.id ?? -1);

const NoteAtomContext = createContext<NoteAtom | null>(null);
function useSidebarAtom() {
  return useContext(NoteAtomContext)!;
}

function useSidebarAtomValue() {
  const atom = useSidebarAtom();
  return useAtomValue(atom, { store: defaultStore });
}

export default function SidebarNote({ atom }: SidebarNoteProps) {
  const sidebarStore = createStore();

  if (!atom) return;

  return (
    <NoteAtomContext.Provider value={atom}>
      <Provider store={sidebarStore}>
        <Menu />
      </Provider>
    </NoteAtomContext.Provider>
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
  const sidebarNote = useSidebarAtomValue()

  const currentNoteId = useAtomValue(currentNoteIdAtom);

  const sidebarStore = useStore();
  const editMode = useAtomValue(editModeAtom, { store: sidebarStore });

  const isActive = useMemo(
    () => currentNoteId === sidebarNote?.id,
    [currentNoteId, sidebarNote],
  );

  return (
    <SidebarMenuButton asChild={editMode} className="py-0" isActive={isActive}>
      {editMode ? <NoteName /> : <NoteLink />}
    </SidebarMenuButton>
  );
}

function Action() {
  const sidebarStore = useStore();
  const editMode = useAtomValue(editModeAtom, { store: sidebarStore });

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
  const defaultStore = getDefaultStore();
  const sidebarAtom = useSidebarAtom();
  const [sidebarNote, setSidebarNoteAtom] = useAtom(sidebarAtom, {
    store: defaultStore,
  });

  const sidebarStore = useStore();
  const title = useAtomValue(editedNoteNameAtom, { store: sidebarStore });
  const setEditModeAtom = useSetAtom(editModeAtom, { store: sidebarStore });

  const updateSidebarTitle = useCallback(() => {
    const newNote: Note = {
      ...sidebarNote!,
      title,
    };

    setSidebarNoteAtom(newNote);
    setEditModeAtom(false);
  }, [sidebarNote, title]);

  return (
    <Button onClick={updateSidebarTitle} variant="outline" size="icon">
      <CheckIcon className="size-4" />
    </Button>
  );
}

function RenameAction() {
  const sidebarStore = useStore();
  const setEditMode = useSetAtom(editModeAtom, { store: sidebarStore });

  return (
    <DropdownMenuItem onClick={() => setEditMode(true)}>
      <span>Rename</span>
    </DropdownMenuItem>
  );
}

function NoteLink() {
  const sidebarAtom = useSidebarAtom();
  const note = useAtomValue(sidebarAtom)!;

  return (
    <Link className="w-full h-full py-2" to={`/note/${note.id}`}>
      {note.title}
    </Link>
  );
}

function NoteName() {
  const sidebarAtom = useSidebarAtom();
  const note = useAtomValue(sidebarAtom)!;

  const setEditedNoteName = useSetAtom(editedNoteNameAtom);

  return (
    <Input
      className="w-full h-full py-2 m-0"
      placeholder="name"
      defaultValue={note.title}
      onInput={(e) => setEditedNoteName(e.currentTarget.value)}
    />
  );
}
