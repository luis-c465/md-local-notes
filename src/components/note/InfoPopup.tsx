import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/ui/table";

import { Button } from "#/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/ui/dialog";
import { DropdownMenuItem } from "#/ui/dropdown-menu";
import { useAtomValue } from "jotai";
import { currentNoteAtom, store } from "~/atom";
import { countNonWhiteSpace, countWords } from "~/lib/word";

export default function InfoPopup() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <span>View info</span>
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Note info</DialogTitle>

          <DialogDescription>
            <Info />
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Info() {
  const currentNote = useAtomValue(currentNoteAtom, { store });
  if (!currentNote) return null;

  const wordCount = countWords(currentNote.content);
  const charCount = countNonWhiteSpace(currentNote.content);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Title</TableCell>
          <TableCell>{currentNote.title}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">ID</TableCell>
          <TableCell>{currentNote.id}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Word Count</TableCell>
          <TableCell>{wordCount}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Character Count</TableCell>
          <TableCell>{charCount}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Created At</TableCell>
          <TableCell>{currentNote.createdAt.toLocaleString()}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Updated At</TableCell>
          <TableCell>{currentNote.updatedAt.toLocaleString()}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
