"use client";
import CharacterCount from "@tiptap/extension-character-count";
import { EditorContent, useEditor, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Minus,
  Undo,
  Redo,
  Type,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { SelectResponsive } from "./res-select";

interface ButtonProps {
  editor: Editor;
  className?: string;
}

// History Buttons
function UndoButton({ editor, className }: ButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => editor.chain().focus().undo().run()}
      disabled={!editor.can().chain().focus().undo().run()}
      title="Undo"
    >
      <Undo />
    </Button>
  );
}

function RedoButton({ editor, className }: ButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => editor.chain().focus().redo().run()}
      disabled={!editor.can().chain().focus().redo().run()}
      title="Redo"
    >
      <Redo />
    </Button>
  );
}

// Formatting Buttons
function BoldButton({ editor, className }: ButtonProps) {
  return (
    <Button
      type="button"
      variant={editor.isActive("bold") ? "default" : "ghost"}
      size="icon"
      className={className}
      onClick={() => editor.chain().focus().toggleBold().run()}
      disabled={!editor.can().chain().focus().toggleBold().run()}
      title="Bold"
    >
      <Bold />
    </Button>
  );
}

function ItalicButton({ editor, className }: ButtonProps) {
  return (
    <Button
      type="button"
      variant={editor.isActive("italic") ? "default" : "ghost"}
      size="icon"
      className={className}
      onClick={() => editor.chain().focus().toggleItalic().run()}
      disabled={!editor.can().chain().focus().toggleItalic().run()}
      title="Italic"
    >
      <Italic />
    </Button>
  );
}

function StrikethroughButton({ editor, className }: ButtonProps) {
  return (
    <Button
      type="button"
      variant={editor.isActive("strike") ? "default" : "ghost"}
      size="icon"
      className={className}
      onClick={() => editor.chain().focus().toggleStrike().run()}
      disabled={!editor.can().chain().focus().toggleStrike().run()}
      title="Strikethrough"
    >
      <Strikethrough />
    </Button>
  );
}

function CodeButton({ editor, className }: ButtonProps) {
  return (
    <Button
      type="button"
      variant={editor.isActive("code") ? "default" : "ghost"}
      size="icon"
      className={className}
      onClick={() => editor.chain().focus().toggleCode().run()}
      disabled={!editor.can().chain().focus().toggleCode().run()}
      title="Inline Code"
    >
      <Code />
    </Button>
  );
}

// List Buttons
function BulletListButton({ editor, className }: ButtonProps) {
  return (
    <Button
      type="button"
      variant={editor.isActive("bulletList") ? "default" : "ghost"}
      size="icon"
      className={className}
      onClick={() => editor.chain().focus().toggleBulletList().run()}
      disabled={!editor.can().chain().focus().toggleBulletList().run()}
      title="Bullet List"
    >
      <List />
    </Button>
  );
}

function OrderedListButton({ editor, className }: ButtonProps) {
  return (
    <Button
      type="button"
      variant={editor.isActive("orderedList") ? "default" : "ghost"}
      size="icon"
      className={className}
      onClick={() => editor.chain().focus().toggleOrderedList().run()}
      disabled={!editor.can().chain().focus().toggleOrderedList().run()}
      title="Numbered List"
    >
      <ListOrdered />
    </Button>
  );
}

// Legacy - Block Element Buttons
// function BlockquoteButton({ editor, className }: ButtonProps) {
//   return (
//     <Button
//       type="button"
//       variant={editor.isActive("blockquote") ? "default" : "ghost"}
//       size="icon"
//       className={className}
//       onClick={() => editor.chain().focus().toggleBlockquote().run()}
//       disabled={!editor.can().chain().focus().toggleBlockquote().run()}
//       title="Blockquote"
//     >
//       <Quote />
//     </Button>
//   );
// }

function HorizontalRuleButton({ editor, className }: ButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => editor.chain().focus().setHorizontalRule().run()}
      title="Horizontal Rule"
    >
      <Minus />
    </Button>
  );
}

function CodeBlockButton({ editor, className }: ButtonProps) {
  return (
    <Button
      type="button"
      variant={editor.isActive("codeBlock") ? "default" : "ghost"}
      size="icon"
      className={className}
      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
      title="Code Block"
    >
      <Type />
    </Button>
  );
}

// Legacy - Clear Formatting Button
// function ClearFormattingButton({ editor, className }: ButtonProps) {
//   return (
//     <Button
//       type="button"
//       variant="ghost"
//       size="sm"
//       className={className}
//       onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
//       title="Clear Formatting"
//     >
//       Clear
//     </Button>
//   );
// }

// Heading Selector
interface HeadingSelectProps {
  getCurrentHeadingLevel: () => string;
  setHeadingLevel: (level: string) => void;
  className?: string;
}

function HeadingSelect({
  getCurrentHeadingLevel,
  setHeadingLevel,
  className,
}: HeadingSelectProps) {
  return (
    <SelectResponsive
      className={className}
      value={getCurrentHeadingLevel()}
      onChange={setHeadingLevel}
      options={[
        {
          value: "paragraph",
          label: (
            <span className="prose">
              <p>Paragraph</p>
            </span>
          ),
        },
        {
          value: "h1",
          label: (
            <span className="prose">
              <h1>Heading 1</h1>
            </span>
          ),
        },
        {
          value: "h2",
          label: (
            <span className="prose">
              <h2>Heading 2</h2>
            </span>
          ),
        },
        {
          value: "h3",
          label: (
            <span className="prose">
              <h3>Heading 3</h3>
            </span>
          ),
        },
        {
          value: "h4",
          label: (
            <span className="prose">
              <h4>Heading 4</h4>
            </span>
          ),
        },
        {
          value: "h5",
          label: (
            <span className="prose">
              <h5>Heading 5</h5>
            </span>
          ),
        },
        {
          value: "h6",
          label: (
            <span className="prose">
              <h6>Heading 6</h6>
            </span>
          ),
        },
      ]}
    />
  );
}

interface ToolbarProps {
  editor: Editor;
  getCurrentHeadingLevel: () => string;
  setHeadingLevel: (level: string) => void;
}

function MobileToolbar({
  editor,
  getCurrentHeadingLevel,
  setHeadingLevel,
}: ToolbarProps) {
  return (
    <div className="sm:hidden">
      {/* Primary tools row - Always visible */}
      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center gap-1 flex-wrap">
          {/* History - Mobile: smaller buttons */}
          <div className="flex gap-0.5">
            <UndoButton editor={editor} />
            <RedoButton editor={editor} />
          </div>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Headings - Responsive width */}
          <HeadingSelect
            getCurrentHeadingLevel={getCurrentHeadingLevel}
            setHeadingLevel={setHeadingLevel}
            className="flex-1 min-w-max"
          />

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Essential formatting */}
          <div className="flex gap-0.5">
            <BoldButton editor={editor} />
            <ItalicButton editor={editor} />
            <BulletListButton editor={editor} />
            <OrderedListButton editor={editor} />
            <StrikethroughButton editor={editor} />
            <CodeButton editor={editor} />
            <HorizontalRuleButton editor={editor} />
            <CodeBlockButton editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopToolbar({
  editor,
  getCurrentHeadingLevel,
  setHeadingLevel,
}: ToolbarProps) {
  return (
    <div className="hidden sm:flex items-center gap-2 p-2">
      {/* Primary tools row */}
      <div className="flex items-center gap-1 flex-wrap flex-1">
        {/* History */}
        <div className="flex gap-1">
          <UndoButton editor={editor} />
          <RedoButton editor={editor} />
        </div>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Headings */}
        <HeadingSelect
          getCurrentHeadingLevel={getCurrentHeadingLevel}
          setHeadingLevel={setHeadingLevel}
          className="flex-1 min-w-max"
        />

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Essential formatting */}
        <div className="flex gap-1">
          <BoldButton editor={editor} />
          <ItalicButton editor={editor} />
          <BulletListButton editor={editor} />
          <OrderedListButton editor={editor} />
        </div>
      </div>

      {/* Secondary tools row */}
      <div className="flex items-center gap-1 flex-wrap">
        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Additional formatting */}
        <div className="flex gap-1">
          <StrikethroughButton editor={editor} />
          <CodeButton editor={editor} />
        </div>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* Block Elements */}
        <div className="flex gap-1">
          <HorizontalRuleButton editor={editor} />
          <CodeBlockButton editor={editor} />
        </div>
      </div>
    </div>
  );
}

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
    extensions: [CharacterCount, StarterKit],
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    content: value,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[200px] prose",
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
        <MobileToolbar
          editor={editor}
          getCurrentHeadingLevel={getCurrentHeadingLevel}
          setHeadingLevel={setHeadingLevel}
        />
        <DesktopToolbar
          editor={editor}
          getCurrentHeadingLevel={getCurrentHeadingLevel}
          setHeadingLevel={setHeadingLevel}
        />
      </div>

      {/* Editor Content */}

      <EditorContent
        editor={editor}
        className="focus:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:p-3 [&_.ProseMirror]:sm:p-4 [&_.ProseMirror]:outline-none"
      />

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
