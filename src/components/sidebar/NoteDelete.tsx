import { Button } from "#/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/ui/dialog";
import { DropdownMenuItem } from "#/ui/dropdown-menu";
import { useAtom, useAtomValue } from "jotai";
import { RESET } from "jotai/utils";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { currentNoteIdAtom, noteIdsAtom, store } from "~/atom";
import { useSidebarAtom } from "./Note";

export default function NoteDeleteAction() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <span>Delete</span>
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Note</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete this note? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <DeleteBtn />
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteBtn() {
  const sidebarAtom = useSidebarAtom();
  const [sidebarNote, setSidebarAtom] = useAtom(sidebarAtom, { store });
  const currentId = useAtomValue(currentNoteIdAtom, { store });
  const [noteIds, setNoteIds] = useAtom(noteIdsAtom, { store });

  const navigate = useNavigate();

  const onClick = useCallback(() => {
    const id = sidebarNote.id;
    console.log("Deleting", id);

    // Clears the note to the default!
    setNoteIds((prev) => {
      const copy = prev.filter((noteId) => {
        console.log(noteId, noteId !== id, id);
        return noteId !== id;
      });

      return [...copy];
    });

    if (id === currentId) {
      navigate("/", {
        replace: true,
        flushSync: false,
      });
    }
    setSidebarAtom(RESET);
  }, [sidebarNote, currentId, noteIds]);

  return (
    <Button variant="destructive" onClick={onClick}>
      Close
    </Button>
  );
}
