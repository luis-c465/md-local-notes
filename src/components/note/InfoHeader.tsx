import { intlFormatDistance } from "date-fns";
import { useAtomValue } from "jotai";
import { currentNoteAtom } from "~/atom";
import { OptionalNote } from "~/lib/types";

export default function NoteInfoHeader() {
  const note = useAtomValue(currentNoteAtom);

  if (note === null) return null;

  return (
    <div className="flex flex-col gap-1 !ml-0 md:ml-3">
      <NoteTitle note={note} />

      <span className="flex lg:gap-10 sm:gap-5 gap-3">
        <NoteUpdatedAt note={note} />
        <NoteCreatedAt note={note} />
      </span>
    </div>
  );
}

type NoteProps = {
  note: OptionalNote;
};

function NoteTitle({ note }: NoteProps) {
  if (note === null) return null;

  const { title } = note;

  return <span className="inline-block font-bold">{title}</span>;
}

function NoteUpdatedAt({ note }: NoteProps) {
  if (note === null) return null;

  const { updatedAt } = note;

  const formatedDateDiff = intlFormatDistance(updatedAt, new Date());

  return (
    <span className="text-muted-foreground space-x-2 text-sm">
      Updated {formatedDateDiff}
    </span>
  );
}

function NoteCreatedAt({ note }: NoteProps) {
  if (note === null) return null;

  const { createdAt } = note;

  const formatedDateDiff = intlFormatDistance(createdAt, new Date());

  return (
    <span className="text-muted-foreground space-x-2 text-sm hidden sm:block">
      Created {formatedDateDiff}
    </span>
  );
}
