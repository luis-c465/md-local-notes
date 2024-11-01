import { atom, getDefaultStore } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { memoize } from "lodash-es";
import { noteIdsStorage, noteStorage } from "./lib/storage";
import { Note } from "./lib/types";

type AtomWithStorage<T> = ReturnType<typeof atomWithStorage<T>>;
export type NullableNoteAtom = AtomWithStorage<Note | null>;
export type NoteAtom = AtomWithStorage<Note>;

type Notes = Record<number, NullableNoteAtom>;

export const store = getDefaultStore();

export const noteIdsAtom = atomWithStorage("note-ids", [], noteIdsStorage, {
  getOnInit: true,
});

export const notesAtom = atom(
  (get) => {
    const ids = get(noteIdsAtom);
    const entries = ids.map((id) => [id, memoizedNoteToAtom(id)]);
    return Object.fromEntries(entries) as Notes;
  },
  (_get, set, notes: Notes) => {
    const keys = Object.keys(notes).map((key) => parseInt(key, 10));
    console.log(keys);
    set(noteIdsAtom, keys);
  },
);

export const notesListAtom = atom<NullableNoteAtom[]>((get) => {
  const notes = get(notesAtom);
  return Object.values(notes);
});

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
    const id = get(currentNoteIdAtom);
    const noteAtom = oldNotes[id];

    set(noteAtom, newNote);
  },
);

function noteIdToAtom(id: number, defaultNote?: Note): NullableNoteAtom {
  const atom = atomWithStorage(`note-${id}`, defaultNote ?? null, noteStorage, {
    getOnInit: true,
  });

  atom.debugLabel = `note-${id}`;

  return atom;
}

export function noteToAtom(note: Note) {
  return noteIdToAtom(note.id, note);
}

export const memoizedNoteToAtom = memoize(noteIdToAtom);
