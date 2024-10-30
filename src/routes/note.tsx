import Editor from "#/note/Editor";
import { useSetAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { currentNoteIdAtom } from "~/atom";

type LoaderParams = {
  noteId?: string;
};

export default function NoteRoute() {
  const setCurrentNoteId = useSetAtom(currentNoteIdAtom);
  const { noteId } = useParams<LoaderParams>();
  if (!noteId) {
    return null;
  }

  const id = parseInt(noteId, 10);
  if (!Number.isInteger(id)) return null;

  useEffect(() => {
    setCurrentNoteId(id);
  }, [id]);

  useHydrateAtoms([[currentNoteIdAtom, id]]);

  return (
    <div className="col flex gap-5">
      <Editor />
    </div>
  );
}
