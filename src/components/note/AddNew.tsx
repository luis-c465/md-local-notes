import { Button } from "#/ui/button";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { addNewNotesAtom } from "~/atom";
import { Note } from "~/lib/types";

export default function AddNewNote() {
  const navigate = useNavigate();
  const addNewNote = useSetAtom(addNewNotesAtom);

  const onClick = () => {
    const numNotes = localStorage.getItem("num-notes") ?? 0;
    const newId = Number(numNotes) + 1;
    localStorage.setItem("num-notes", newId.toString());

    const newNote: Note = {
      id: newId,
      title: "Untitled",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    localStorage.setItem(`note-${newId}`, JSON.stringify(newNote));
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
