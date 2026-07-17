"use client";

import { useEffect, useReducer } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write here...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value,
    editorProps: {
      attributes: {
        class:
          "max-w-none min-h-[300px] px-4 py-3 focus:outline-none " +
          "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 " +
          "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-2 " +
          "[&_p]:mb-3 [&_p]:leading-relaxed " +
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 " +
          "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 " +
          "[&_li]:mb-1 " +
          "[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:mb-3 " +
          "[&_strong]:font-bold [&_em]:italic [&_u]:underline",
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  const [, forceRerender] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => forceRerender();

    editor.on("transaction", handleUpdate);
    editor.on("selectionUpdate", handleUpdate);

    return () => {
      editor.off("transaction", handleUpdate);
      editor.off("selectionUpdate", handleUpdate);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-md border border-gray-300">
      <div className="sticky top-0 z-10 flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={editor.isActive("bold") ? "bg-gray-200" : ""}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={editor.isActive("italic") ? "bg-gray-200" : ""}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={editor.isActive("underline") ? "bg-gray-200" : ""}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={
            editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={
            editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={editor.isActive("blockquote") ? "bg-gray-200" : ""}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>
      <div className="max-h-[500px] overflow-y-auto bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
