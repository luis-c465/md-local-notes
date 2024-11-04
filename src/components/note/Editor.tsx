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
import { throttle } from "lodash-es";
import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
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

export default function Editor() {
  const ref = useRef<MDXEditorMethods>(null);
  const [note, setCurrentNote] = useAtom(currentNoteAtom);

  const initialContent = useMemo(() => note?.content ?? "", [note?.id]);

  const saveMarkdown = useCallback(
    throttle(
      (markdown: string) => {
        if (!note) return;
        console.log("save", note);

        const copy: Note = {
          ...note,
          content: markdown,
          updatedAt: new Date(),
        };
        setCurrentNote(copy);
      },
      2_500,
      { trailing: true, leading: false },
    ),
    [note?.id],
  );

  // Update the editor when the note changes
  useLayoutEffect(() => {
    console.log("useLayoutEffect", note);
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
      markdown={note?.content ?? ""}
      contentEditableClassName="prose max-w-full font-sans"
      plugins={allPlugins(initialContent)}
      onChange={saveMarkdown}
    />
  );
}

/**
 * Handles "uploading" an image, returns the base64 encoded image data
 */
async function imageUploadHandler(image: File): Promise<string> {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(image);
  });
}

function allPlugins(diffMarkdown: string) {
  return [
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
    imagePlugin({ imageUploadHandler }),
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
}
