import { Button } from "#/ui/button";
import { DropdownMenuItem } from "#/ui/dropdown-menu";
import { Input } from "#/ui/input";
import { Label } from "#/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "#/ui/popover";
import { useAtomValue } from "jotai";
import { PencilIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { currentNote as currentNoteAtom } from "~/atom";
import { saveNote } from "~/lib/storage";
import { Note } from "~/lib/types";

export function SidebarNoteRename() {
  const [title, setTitle] = useState("");
  const currentNote = useAtomValue(currentNoteAtom);
  const applyRename = useCallback(() => {
    if (!currentNote) return;

    const newNote: Note = {
      ...currentNote,
      title: title,
    };

    saveNote(newNote);
  }, [title, currentNote]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <DropdownMenuItem>
          <span>Rename</span>
        </DropdownMenuItem>
      </PopoverTrigger>

      <PopoverContent className="w-80">
        <div className="space-x-2 space-y-2 flex items-center gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            defaultValue={title}
            onChange={(e) => setTitle(e.currentTarget.title)}
            id="name"
            placeholder="Note Name"
          />

          <Button variant="outline" size="icon" onClick={applyRename}>
            <PencilIcon className="size-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
