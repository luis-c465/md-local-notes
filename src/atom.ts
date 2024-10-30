import { atom, getDefaultStore, PrimitiveAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { memoize } from "lodash-es";
import { noteIdsStorage, noteStorage, saveNote } from "./lib/storage";
import { Note } from "./lib/types";

export type NullableNoteAtom = PrimitiveAtom<Note | null>;
export type NoteAtom = PrimitiveAtom<Note>;
type Notes = Record<number, NullableNoteAtom>;

export const store = getDefaultStore();

export const noteIdsAtom = atomWithStorage("note-ids", [], noteIdsStorage, {
  getOnInit: true,
});

export const notesAtom = atom(
  (get) => {
    const ids = get(noteIdsAtom);
    const entries = ids.map((id) => [id, memoizedNoteToAtom(id)]);
    console.dir(ids);
    return Object.fromEntries(entries) as Notes;
  },
  (_get, set, notes: Notes) => {
    const keys = Object.keys(notes) as any as number[];
    set(noteIdsAtom, keys);
  },
);

export const addNewNotesAtom = atom(null, (get, set, note: Note) => {
  const notes = get(notesAtom);
  set(notesAtom, {
    ...notes,
    [note.id]: noteToAtom(note),
  });
});
export const currentNoteIdAtom = atom<number>(-1);

export const currentNoteAtom = atom(
  (get) => {
    const id = get(currentNoteIdAtom);
    const notes = get(notesAtom);

    if (!Object.hasOwn(notes, id)) return null;

    const current = notes[id];
    return get(current);
  },
  (get, set, newNote: Note) => {
    const oldNotes = get(notesAtom);
    const copy = { ...oldNotes };
    const id = get(currentNoteIdAtom);
    copy[id] = noteToAtom(newNote);

    set(notesAtom, copy);
    saveNote(newNote);
  },
);

function noteIdToAtom(id: number, defaultNote?: Note): NullableNoteAtom {
  return atomWithStorage(`note-${id}`, defaultNote ?? null, noteStorage, {
    getOnInit: true,
  });
}

export function noteToAtom(note: Note) {
  return noteIdToAtom(note.id, note);
}

export const memoizedNoteToAtom = memoize(noteIdToAtom);
