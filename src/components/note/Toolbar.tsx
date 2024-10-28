import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeAdmonitionType,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  DiffSourceToggleWrapper,
  EditorInFocus,
  InsertAdmonition,
  InsertCodeBlock,
  InsertFrontmatter,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  Separator,
  ShowSandpackInfo,
  StrikeThroughSupSubToggles,
  UndoRedo,
  type DirectiveNode,
} from "@mdxeditor/editor";

type AdmonitionKind = "note" | "tip" | "danger" | "info" | "caution";

function whenInAdmonition(editorInFocus: EditorInFocus | null) {
  const node = editorInFocus?.rootNode;
  if (!node || node.getType() !== "directive") {
    return false;
  }

  [].indexOf;
  return ["note", "tip", "danger", "info", "caution"].includes(
    (node as DirectiveNode).getMdastNode().name as AdmonitionKind,
  );
}

export default function Toolbar() {
  return (
    <DiffSourceToggleWrapper>
      <ConditionalContents
        options={[
          {
            when: (editor) => editor?.editorType === "codeblock",
            contents: () => <ChangeCodeMirrorLanguage />,
          },
          {
            when: (editor) => editor?.editorType === "sandpack",
            contents: () => <ShowSandpackInfo />,
          },
          {
            fallback: () => (
              <div className="flex flex-wrap">
                <div className="flex">
                  <UndoRedo />
                  <Separator />

                  <BoldItalicUnderlineToggles />
                  <CodeToggle />

                  <Separator />

                  <StrikeThroughSupSubToggles />

                  <ListsToggle />
                </div>

                <Separator />

                <div className="flex">
                  <ConditionalContents
                    options={[
                      {
                        when: whenInAdmonition,
                        contents: () => <ChangeAdmonitionType />,
                      },
                      { fallback: () => <BlockTypeSelect /> },
                    ]}
                  />

                  <Separator />

                  <CreateLink />
                  <InsertImage />
                </div>

                <Separator />
                <div className="flex">
                  <InsertTable />
                  <InsertThematicBreak />

                  <Separator />
                  <InsertCodeBlock />
                </div>

                <ConditionalContents
                  options={[
                    {
                      when: (editorInFocus) => !whenInAdmonition(editorInFocus),
                      contents: () => (
                        <>
                          <Separator />
                          <InsertAdmonition />
                        </>
                      ),
                    },
                  ]}
                />

                <Separator />
                <InsertFrontmatter />
              </div>
            ),
          },
        ]}
      />
    </DiffSourceToggleWrapper>
  );
}
