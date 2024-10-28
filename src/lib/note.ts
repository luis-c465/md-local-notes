import { endOfDay, fromUnixTime, subDays, subWeeks } from "date-fns";
import { Note, OptionalNote } from "./types";

type DateRange = {
  name: string;
  end: Date;
};

const today = new Date();
const dateRanges: DateRange[] = [
  {
    name: "Today",
    end: endOfDay(today),
  },
  {
    name: "Previous 7 Days",
    end: endOfDay(subWeeks(today, 1)),
  },
  {
    name: "Previous 30 Days",
    end: subDays(endOfDay(today), 30),
  },
  {
    name: "Long ago",
    end: fromUnixTime(0),
  },
];

export type GroupedNotes = {
  name: string;
  notes: Note[];
};

/**
 * Groups a list of notes by their update dates.
 */
export function groupNotesByDate(notes: OptionalNote[]): GroupedNotes[] {
  console.log("Grouping notes by date", notes);

  const groups: GroupedNotes[] = dateRanges.map(({ name }) => ({
    name,
    notes: [],
  }));

  for (const note of notes) {
    if (!note) continue;

    for (let i = 0; i < dateRanges.length; i++) {
      const { end } = dateRanges[i];

      if (note.updatedAt <= end) {
        groups[i].notes.push(note);
        break; // Stop checking other date ranges once a match is found
      }
    }
  }

  return groups;
}
