import { Button } from "#/ui/button";
import { atom, useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { addNewNotesAtom, noteIdsAtom } from "~/atom";
import { Note } from "~/lib/types";

const getLastIdAtom = atom(null, (get, _set) => {
  const ids = get(noteIdsAtom);

  if (ids.length === 0) return -1;
  return ids[ids.length - 1];
});

export default function AddNewNote() {
  const navigate = useNavigate();
  const addNewNote = useSetAtom(addNewNotesAtom);
  const getLastId = useSetAtom(getLastIdAtom);

  const onClick = () => {
    // The last id + 1
    const newId = getLastId() + 1;

    const newNote: Note = {
      id: newId,
      title: "Untitled",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // localStorage.setItem(`note-${newId}`, JSON.stringify(newNote));
    addNewNote(newNote);

    navigate(`/note/${newId}`, {
      replace: true,
      flushSync: false,
    });
  };

  return (
    <Button onClick={onClick} className="w-full">
      Add new note
    </Button>
  );
}
