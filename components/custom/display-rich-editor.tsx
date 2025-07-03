"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function DisplayRichEditor({ content }: { content: string }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      // TextAlign.configure({
      //   types: ['heading', 'paragraph'],
      // }),
      // Highlight,
    ],
    content: content,
  });
  return <EditorContent editor={editor} readOnly />;
}
