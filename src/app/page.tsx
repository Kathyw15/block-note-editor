"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading,
  Image as ImageIcon,
  ChevronDown,
  TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import { SnippetExtension } from "@/components/SnippetExtension";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Snippet {
  id: string;
  content: string;
}

type HeadingLevel = 1 | 2 | 3;

export default function Home() {
  const [snippets] = useState([
    { id: "heading", content: "<h2>Heading</h2>" },
    { id: "paragraph", content: "<p>Paragraph</p>" },
    { id: "bulletList", content: "<ul><li>List item</li></ul>" },
    { id: "orderedList", content: "<ol><li>Ordered item</li></ol>" },
  ]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your report...",
      }),
      Image,
      SnippetExtension,
      Underline,
      Table,
      TableRow,
      TableHeader,
      TableCell,
      GlobalDragHandle.configure({
        dragHandleWidth: 24,
        scrollTreshold: 50,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose focus:outline-none max-w-full",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      console.log("Editor content updated:", html);
    },
  });

  const isActive = (type: string) => {
    if (!editor) return false;
    switch (type) {
      case "bold":
        return editor.isActive("bold");
      case "italic":
        return editor.isActive("italic");
      case "bulletList":
        return editor.isActive("bulletList");
      case "orderedList":
        return editor.isActive("orderedList");
      case "heading":
        return editor.isActive("heading", { level: 2 });
      default:
        return false;
    }
  };

  const addBlock = (type: string) => {
    if (editor) {
      switch (type) {
        case "paragraph":
          editor.chain().focus().setParagraph().run();
          break;
        case "heading":
          editor.chain().focus().toggleHeading({ level: 2 }).run();
          break;
        case "bulletList":
          editor.chain().focus().toggleBulletList().run();
          break;
        case "orderedList":
          editor.chain().focus().toggleOrderedList().run();
          break;
        case "image":
          const url = window.prompt("Enter the URL of the image:");
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
          break;
      }
    }
  };

  const setHeading = (level: HeadingLevel) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  };

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    snippet: Snippet
  ) => {
    event.dataTransfer.setData("snippet", snippet.content);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex">
      <div className="max-w-4xl mx-auto flex-grow">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Block Editor</h1>
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
          <div className="flex items-center p-2 bg-gray-50 border-b">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={isActive("bold") ? "bg-gray-200" : ""}
            >
              <Bold
                className={`h-4 w-4 ${isActive("bold") ? "text-blue-500" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={isActive("italic") ? "bg-gray-200" : ""}
            >
              <Italic
                className={`h-4 w-4 ${
                  isActive("italic") ? "text-blue-500" : ""
                }`}
              />
            </Button>
            <div className="border-l border-gray-300 h-6 mx-2" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <Heading className="h-4 w-4 mr-1" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {([1, 2, 3] as HeadingLevel[]).map((level) => (
                  <DropdownMenuItem
                    key={level}
                    onSelect={() => setHeading(level)}
                  >
                    Heading {level}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="border-l border-gray-300 h-6 mx-2" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={isActive("bulletList") ? "bg-gray-200" : ""}
            >
              <List
                className={`h-4 w-4 ${
                  isActive("bulletList") ? "text-blue-500" : ""
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={isActive("orderedList") ? "bg-gray-200" : ""}
            >
              <ListOrdered
                className={`h-4 w-4 ${
                  isActive("orderedList") ? "text-blue-500" : ""
                }`}
              />
            </Button>
            <div className="border-l border-gray-300 h-6 mx-2" />
            <Button variant="ghost" size="sm" onClick={() => addBlock("image")}>
              <ImageIcon className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <TableIcon className="h-4 w-4 mr-1" />
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onSelect={() =>
                    editor
                      .chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run()
                  }
                >
                  Insert Table
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    editor.chain().focus().addColumnBefore().run()
                  }
                  disabled={!editor.isActive("table")}
                >
                  Add Column Before
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().addColumnAfter().run()}
                  disabled={!editor.isActive("table")}
                >
                  Add Column After
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().deleteColumn().run()}
                  disabled={!editor.isActive("table")}
                >
                  Delete Column
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().addRowBefore().run()}
                  disabled={!editor.isActive("table")}
                >
                  Add Row Before
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().addRowAfter().run()}
                  disabled={!editor.isActive("table")}
                >
                  Add Row After
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().deleteRow().run()}
                  disabled={!editor.isActive("table")}
                >
                  Delete Row
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().deleteTable().run()}
                  disabled={!editor.isActive("table")}
                >
                  Delete Table
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={
                editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
              }
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={
                editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
              }
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={
                editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
              }
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              className={
                editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""
              }
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div
          className="bg-white rounded-sm shadow-lg overflow-hidden"
          style={{ aspectRatio: "1 / 1.4142" }}
        >
          <EditorContent
            editor={editor}
            className="prose max-w-none p-16 h-full overflow-y-auto"
          />
        </div>
      </div>
      <div className="w-64 ml-8 bg-white rounded-lg shadow-md p-4 snippet-sidebar">
        <h2 className="text-lg font-semibold mb-4">Snippets</h2>
        {snippets.map((snippet) => (
          <div
            key={snippet.id}
            className="snippet-item mb-2 cursor-move"
            draggable
            onDragStart={(e) => onDragStart(e, snippet)}
          >
            {snippet.id}
          </div>
        ))}
      </div>
    </div>
  );
}
