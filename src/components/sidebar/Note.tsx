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
  useSidebar,
} from "#/ui/sidebar";
import {
  atom,
  createStore,
  Provider,
  useAtom,
  useAtomValue,
  useSetAtom,
} from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { CheckIcon, MoreHorizontalIcon } from "lucide-react";
import { createContext, useCallback, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { currentNoteAtom, store as defaultStore, NoteAtom } from "~/atom";
import { Note } from "~/lib/types";
import NoteDeleteAction from "./NoteDelete";
import InfoPopupAction from "./NoteInfoPopup";

const editModeAtom = atom(false);
const editedNoteNameAtom = atom("");

type SidebarNoteProps = {
  atom: NoteAtom;
};

const currentNoteIdAtom = atom((get) => get(currentNoteAtom)?.id ?? -1);

const NoteAtomContext = createContext<NoteAtom | null>(null);
export function useSidebarAtom() {
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
  const sidebarNote = useSidebarAtomValue();

  const currentNoteId = useAtomValue(currentNoteIdAtom, {
    store: defaultStore,
  });
  const editMode = useAtomValue(editModeAtom);

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
  const editMode = useAtomValue(editModeAtom);

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

        <NoteDeleteAction />

        <InfoPopupAction />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SubmitNameAction() {
  const sidebarAtom = useSidebarAtom();
  const [sidebarNote, setSidebarNoteAtom] = useAtom(sidebarAtom, {
    store: defaultStore,
  });

  const title = useAtomValue(editedNoteNameAtom);
  const setEditModeAtom = useSetAtom(editModeAtom);

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
  const setEditMode = useSetAtom(editModeAtom);

  return (
    <DropdownMenuItem onClick={() => setEditMode(true)}>
      <span>Rename</span>
    </DropdownMenuItem>
  );
}

function NoteLink() {
  const note = useSidebarAtomValue();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleClick = useCallback(() => {
    if (isMobile) setOpenMobile(false);
  }, [isMobile]);

  return (
    <Link
      className="w-full h-full py-2"
      to={`/note/${note.id}`}
      onClick={handleClick}
    >
      {note.title}
    </Link>
  );
}

function NoteName() {
  const note = useSidebarAtomValue();
  const setEditedNoteName = useSetAtom(editedNoteNameAtom);

  useHydrateAtoms([[editedNoteNameAtom, note.title]]);

  return (
    <Input
      className="w-full h-full py-2 m-0"
      placeholder="name"
      defaultValue={note.title}
      onInput={(e) => setEditedNoteName(e.currentTarget.value)}
    />
  );
}
