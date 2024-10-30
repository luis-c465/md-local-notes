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
import { useAtom } from "jotai";
import { debounce } from "lodash-es";
import { useCallback, useLayoutEffect, useRef } from "react";
import { currentNoteAtom } from "~/atom";
import { Note } from "~/lib/types";
import { def } from "~/lib/utils";
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

export default function Editor() {
  const ref = useRef<MDXEditorMethods>(null);
  const [note, setCurrentNote] = useAtom(currentNoteAtom);

  const saveMarkdown = useCallback(
    debounce((markdown: string) => {
      if (!note) return;

      const copy: Note = {
        ...note,
        content: markdown,
        updatedAt: new Date(),
      };
      setCurrentNote(copy);
    }, 250),
    [note],
  );

  // Update the editor when the note changes
  useLayoutEffect(() => {
    if (ref.current && def(note?.content)) {
      ref.current.focus();
      ref.current.setMarkdown(note.content);
    }
  }, [note?.id]);

  if (!note) return null;

  return (
    <MDXEditor
      className="w-full h-full"
      ref={ref}
      markdown={note.content}
      contentEditableClassName="prose max-w-full font-sans"
      plugins={allPlugins(note.content)}
      onChange={saveMarkdown}
    />
  );
}
