import Editor from "#/note/Editor";
import { useLoaderData } from "react-router-dom";
import { getNote } from "~/lib/storage";
import { Note, Params } from "~/lib/types";

type LoaderParams = {
  noteId?: string;
};
type LoaderData = {
  note: Note | null;
};
export function noteLoader({ params }: Params<LoaderParams>): LoaderData {
  if (!params.noteId) {
    return {
      note: null,
    };
  }

  const parsedId = parseInt(params.noteId, 10);
  if (!Number.isInteger(parsedId))
    return {
      note: null,
    };
  const note = getNote(parsedId);
  return { note };
}

export default function NoteRoute() {
  const { note } = useLoaderData() as LoaderData;

  if (!note) {
    return null;
  }

  return (
    <div className="col flex gap-5">
      <Editor note={note} />
    </div>
  );
}
