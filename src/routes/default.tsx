import { atom, useAtomValue } from "jotai";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notesListAtom } from "~/atom";
import { Note } from "~/lib/types";

const allNotesAtom = atom((get) => {
  const notesList = get(notesListAtom);
  return notesList.map((atom) => get(atom)).filter(Boolean) as Note[];
});

/**
 * Atom of the id of the most recently edited note.
 */
const mostRecentlyEditedNoteIdAtom = atom((get) => {
  const notes = get(allNotesAtom);
  if (notes.length === 0) return null;

  let minUpdated = notes[0].updatedAt;
  let minId = notes[0].id;

  for (let i = 1; i < notes.length; i++) {
    const note = notes[i];
    if (note.updatedAt > minUpdated) {
      minUpdated = note.updatedAt;
      minId = note.id;
    }
  }

  return minId;
});

export default function DefaultRoute() {
  const navigate = useNavigate();
  const mostRecentlyEdited = useAtomValue(mostRecentlyEditedNoteIdAtom);

  useLayoutEffect(() => {
    if (mostRecentlyEdited === null) {
      // Add a new default as the first note, and redirect to it
    } else {
      navigate(`/note/${mostRecentlyEdited}`, {
        replace: true,
        flushSync: false,
      });
    }
  }, [mostRecentlyEdited]);

  return null;
}
