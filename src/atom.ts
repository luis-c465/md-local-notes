import { atom } from "jotai";
import { getAllNotes } from "./lib/storage";
import { Note, OptionalNote } from "./lib/types";

const allNotes = getAllNotes();

export const notesAtom = atom<OptionalNote[]>(allNotes);
export const addNewNotesAtom = atom(null, (get, set, note: Note) => {
  const notes = get(notesAtom);
  set(notesAtom, [...notes, note]);
});
export const currentNoteId = atom<number>(-1)

export const currentNote = atom<OptionalNote>(null);
