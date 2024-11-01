import type { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";
import { z } from "zod";
import { stringToNote } from "./schema";
import { Note } from "./types";

export function getNote(id: string) {
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

export const noteStorage: SyncStorage<Note | null> = {
  getItem(key, initialValue) {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) {
      this.setItem(key, initialValue);
      return initialValue;
    }

    try {
      return stringToNote.parse(storedValue ?? "");
    } catch {
      return null;
    }
  },
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem(key) {
    console.log("remote", key);
    localStorage.removeItem(key);
  },
  subscribe(key, callback, initialValue) {
    if (
      typeof window === "undefined" ||
      typeof window.addEventListener === "undefined"
    ) {
      return () => {};
    }

    const handler = (e: StorageEvent) => {
      if (e.storageArea === localStorage && e.key === key) {
        let newValue;
        try {
          newValue = stringToNote.parse(e.newValue ?? "");
        } catch {
          newValue = initialValue;
        }
        callback(newValue);
      }
    };
    window.addEventListener("storage", handler);

    return () => window.removeEventListener("storage", handler);
  },
};

const noteIdsSchema = z.array(z.coerce.number().int().nonnegative());
export const noteIdsStorage: SyncStorage<number[]> = {
  getItem(key, initialValue) {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) {
      this.setItem(key, initialValue);
      return initialValue;
    }

    try {
      return noteIdsSchema.parse(JSON.parse(storedValue ?? ""));
    } catch (e) {
      console.error(e);
      return initialValue;
    }
  },
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem(key) {
    localStorage.removeItem(key);
  },
  subscribe(key, callback, initialValue) {
    if (
      typeof window === "undefined" ||
      typeof window.addEventListener === "undefined"
    ) {
      return () => {};
    }

    const handler = (e: StorageEvent) => {
      if (e.storageArea === localStorage && e.key === key) {
        let newValue;
        try {
          newValue = noteIdsSchema.parse(JSON.parse(e.newValue ?? ""));
        } catch {
          newValue = initialValue;
        }
        callback(newValue);
      }
    };
    window.addEventListener("storage", handler);

    return () => window.removeEventListener("storage", handler);
  },
};
