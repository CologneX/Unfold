"use client";
import CharacterCount from "@tiptap/extension-character-count";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Type,
  MoreHorizontal,
} from "lucide-react";
import { Separator } from "../ui/separator";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      CharacterCount.configure(),
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h4]:text-lg [&_h4]:font-medium [&_h4]:mb-2 [&_h5]:text-base [&_h5]:font-medium [&_h5]:mb-1 [&_h6]:text-sm [&_h6]:font-medium [&_h6]:mb-1",
        placeholder: placeholder,
      },
    },
  });

  const getCurrentHeadingLevel = () => {
    if (!editor) return "paragraph";

    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    if (editor.isActive("heading", { level: 3 })) return "h3";
    if (editor.isActive("heading", { level: 4 })) return "h4";
    if (editor.isActive("heading", { level: 5 })) return "h5";
    if (editor.isActive("heading", { level: 6 })) return "h6";

    return "paragraph";
  };

  const setHeadingLevel = (level: string) => {
    if (!editor) return;

    if (level === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      const headingLevel = parseInt(level.replace("h", "")) as
        | 1
        | 2
        | 3
        | 4
        | 5
        | 6;
      editor.chain().focus().setHeading({ level: headingLevel }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <Card className={`${className} p-0 gap-0`}>
      {/* Toolbar */}
      <div className="border-b">
        {/* Mobile-first toolbar layout */}
        <div className="flex flex-col sm:flex-row gap-2 p-2">
          {/* Primary tools row - Always visible */}
          <div className="flex items-center gap-1 flex-wrap">
            {/* History - Mobile: smaller buttons */}
            <div className="flex gap-0.5 sm:gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                title="Undo"
              >
                <Undo />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                title="Redo"
              >
                <Redo />
              </Button>
            </div>

            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* Headings - Responsive width */}
            <Select
              value={getCurrentHeadingLevel()}
              onValueChange={setHeadingLevel}
            >
              <SelectTrigger className="h-8 w-24 text-xs sm:h-9 sm:w-32 sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paragraph">Paragraph</SelectItem>
                <SelectItem value="h1">Heading 1</SelectItem>
                <SelectItem value="h2">Heading 2</SelectItem>
                <SelectItem value="h3">Heading 3</SelectItem>
                <SelectItem value="h4" className="sm:block hidden">
                  Heading 4
                </SelectItem>
                <SelectItem value="h5" className="sm:block hidden">
                  Heading 5
                </SelectItem>
                <SelectItem value="h6" className="sm:block hidden">
                  Heading 6
                </SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* Essential formatting - Always visible */}
            <div className="flex gap-0.5 sm:gap-1">
              <Button
                type="button"
                variant={editor.isActive("bold") ? "default" : "ghost"}
                size="icon"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                title="Bold"
              >
                <Bold />
              </Button>
              <Button
                type="button"
                variant={editor.isActive("italic") ? "default" : "ghost"}
                size="icon"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                title="Italic"
              >
                <Italic />
              </Button>

              {/* Lists - Always visible */}
              <Button
                type="button"
                variant={editor.isActive("bulletList") ? "default" : "ghost"}
                size="icon"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                disabled={
                  !editor.can().chain().focus().toggleBulletList().run()
                }
                title="Bullet List"
              >
                <List />
              </Button>
              <Button
                type="button"
                variant={editor.isActive("orderedList") ? "default" : "ghost"}
                size="icon"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                disabled={
                  !editor.can().chain().focus().toggleOrderedList().run()
                }
                title="Numbered List"
              >
                <ListOrdered />
              </Button>
            </div>
          </div>

          {/* Secondary tools row - Hidden on mobile, visible on larger screens */}
          <div className="hidden sm:flex items-center gap-1 flex-wrap">
            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* Additional formatting */}
            <div className="flex gap-1">
              <Button
                type="button"
                variant={editor.isActive("strike") ? "default" : "ghost"}
                size="icon"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                title="Strikethrough"
              >
                <Strikethrough />
              </Button>
              <Button
                type="button"
                variant={editor.isActive("code") ? "default" : "ghost"}
                size="icon"
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                title="Inline Code"
              >
                <Code />
              </Button>
            </div>

            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* Block Elements */}
            <div className="flex gap-1">
              <Button
                type="button"
                variant={editor.isActive("blockquote") ? "default" : "ghost"}
                size="icon"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                disabled={
                  !editor.can().chain().focus().toggleBlockquote().run()
                }
                title="Blockquote"
              >
                <Quote />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Rule"
              >
                <Minus />
              </Button>
              <Button
                type="button"
                variant={editor.isActive("codeBlock") ? "default" : "ghost"}
                size="icon"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
                title="Code Block"
              >
                <Type />
              </Button>
            </div>

            <Separator orientation="vertical" className="mx-1 h-6" />

            {/* Clear Formatting */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().clearNodes().unsetAllMarks().run()
              }
              title="Clear Formatting"
              className="text-xs"
            >
              Clear
            </Button>
          </div>

          {/* Mobile overflow menu - Visible only on mobile */}
          <div className="flex sm:hidden items-center ml-auto">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              title="More options"
            >
              <MoreHorizontal />
            </Button>
          </div>
        </div>

        {/* Mobile secondary toolbar - Collapsible */}
        <div className="sm:hidden border-t p-2">
          <div className="flex items-center gap-0.5 flex-wrap">
            <Button
              type="button"
              variant={editor.isActive("strike") ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 p-0"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              title="Strikethrough"
            >
              <Strikethrough />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("code") ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 p-0"
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
              title="Inline Code"
            >
              <Code />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("blockquote") ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 p-0"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              disabled={!editor.can().chain().focus().toggleBlockquote().run()}
              title="Blockquote"
            >
              <Quote />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Horizontal Rule"
            >
              <Minus />
            </Button>
            <Button
              type="button"
              variant={editor.isActive("codeBlock") ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 p-0"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
              title="Code Block"
            >
              <Type />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 px-2 text-xs ml-auto"
              onClick={() =>
                editor.chain().focus().clearNodes().unsetAllMarks().run()
              }
              title="Clear Formatting"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        <EditorContent
          editor={editor}
          className="focus:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:p-3 [&_.ProseMirror]:sm:p-4 [&_.ProseMirror]:outline-none"
        />
        {editor.isEmpty && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 text-muted-foreground pointer-events-none text-sm">
            {placeholder}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="border-t px-3 py-2 text-xs text-muted flex justify-between items-center">
        <span className="text-primary">
          {editor.storage.characterCount?.characters()} characters |{" "}
          {editor.storage.characterCount?.words()} words
        </span>
        <div className="flex gap-1 sm:gap-2 text-xs">
          {editor.isActive("bold") && (
            <span className="bg-muted-foreground px-1 rounded text-xs">B</span>
          )}
          {editor.isActive("italic") && (
            <span className="bg-muted-foreground px-1 rounded text-xs">I</span>
          )}
          {editor.isActive("code") && (
            <span className="bg-muted-foreground px-1 rounded text-xs">
              Code
            </span>
          )}
          {editor.isActive("heading") && (
            <span className="bg-muted-foreground px-1 rounded text-xs">
              H{editor.getAttributes("heading").level}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
