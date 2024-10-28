import "@mdxeditor/editor/style.css";

import { languages } from "@codemirror/language-data";
import {
  AdmonitionDirectiveDescriptor,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  directivesPlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import { useSetAtom } from "jotai";
import { debounce } from "lodash-es";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { currentNote as currentNoteAtom } from "~/atom";
import { saveNote } from "~/lib/storage";
import { Note } from "~/lib/types";
import Toolbar from "./Toolbar";

const codeBlockLanguages: Record<string, string> = languages.reduce(
  (obj, lang) => {
    if (lang.name === "text") return obj;

    return Object.assign(obj, { [lang.name]: lang.alias[0] });
  },
  {},
);
codeBlockLanguages["txt"] = "text";

const allPlugins = (diffMarkdown: string) => [
  toolbarPlugin({
    toolbarContents: () => <Toolbar />,
    toolbarClassName: "flex flex-wrap",
  }),
  listsPlugin(),
  quotePlugin(),
  headingsPlugin(),
  linkPlugin(),
  linkDialogPlugin(),
  // eslint-disable-next-line @typescript-eslint/require-await
  imagePlugin({ imageUploadHandler: async () => "/sample-image.png" }),
  tablePlugin(),
  thematicBreakPlugin(),
  frontmatterPlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      txt: "Text",
      tsx: "TypeScript",
      jsx: "Javascript",
      html: "HTML",
      css: "CSS",
      json: "JSON",
      md: "Markdown",
      python: "Python",
      go: "Golang",
      java: "Java",
      rust: "Rust",
      c: "C",
      "C++": "C++",
      PHP: "PHP",
      SQL: "SQL",
      YAML: "Yaml",
      Dockerfile: "Dockerfile",
      Shell: "Bash",
      LaTex: "LaTex",
    },
    // codeBlockLanguages,
  }),
  directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
  diffSourcePlugin({ viewMode: "rich-text", diffMarkdown }),
  markdownShortcutPlugin(),
];

type Props = {
  note: Note;
};
export default function Editor({ note }: Props) {
  const ref = useRef<MDXEditorMethods>(null);
  const setCurrentNote = useSetAtom(currentNoteAtom);

  useEffect(() => {
    setCurrentNote(note);
  }, [note]);

  const saveMarkdown = useCallback(
    debounce((markdown: string) => {
      const copy: Note = {
        ...note,
        content: markdown,
        updatedAt: new Date(),
      };
      saveNote(copy);
      setCurrentNote(copy);
    }, 250),
    [note],
  );

  // Update the editor when the note changes
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.focus();
      ref.current.setMarkdown(note.content);
    }
  }, [note.content]);

  return (
    <MDXEditor
      className="w-full"
      ref={ref}
      markdown={note.content}
      contentEditableClassName="prose max-w-full font-sans"
      plugins={allPlugins(note.content)}
      onChange={saveMarkdown}
    />
  );
}
