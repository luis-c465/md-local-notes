import { range } from "lodash-es";
import { stringToNote } from "./schema";
import { Note, OptionalNote } from "./types";

export function getNote(id: number) {
  const fromStorage = localStorage.getItem(`note-${id}`);
  if (fromStorage === null) return null;

  try {
    return stringToNote.parse(fromStorage);
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function saveNote(note: Note) {
  localStorage.setItem(`note-${note.id}`, JSON.stringify(note));
}

export function getAllNotes(): OptionalNote[] {
  const numNotes = localStorage.getItem("num-notes");
  if (!numNotes) return [];

  const parsedNumNotes = parseInt(numNotes, 10);
  if (isNaN(parsedNumNotes)) {
    console.error(`Invalid number of notes: ${numNotes}`);
    localStorage.setItem("num-notes", "0");
    return [];
  }

  const notes = range(1, parsedNumNotes + 1).map(getNote);
  console.log(notes);
  return notes;
}
