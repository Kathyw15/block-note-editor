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
  Minus,
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

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      // extend the existing attributes …
      ...this.parent?.(),

      // and add a new one …
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-background-color"),
        renderHTML: (attributes) => {
          return {
            "data-background-color": attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
    };
  },
});
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
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      CustomTableCell,
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
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "bg-gray-200" : ""}
            >
              <Bold
                className={`h-4 w-4 ${
                  editor.isActive("bold") ? "text-blue-500" : ""
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "bg-gray-200" : ""}
            >
              <Italic
                className={`h-4 w-4 ${
                  editor.isActive("italic") ? "text-blue-500" : ""
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
                    onSelect={() =>
                      editor.chain().focus().toggleHeading({ level }).run()
                    }
                    disabled={!editor.can().toggleHeading({ level })}
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
              disabled={!editor.can().toggleBulletList()}
              className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
            >
              <List
                className={`h-4 w-4 ${
                  editor.isActive("bulletList") ? "text-blue-500" : ""
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              disabled={!editor.can().toggleOrderedList()}
              className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
            >
              <ListOrdered
                className={`h-4 w-4 ${
                  editor.isActive("orderedList") ? "text-blue-500" : ""
                }`}
              />
            </Button>
            <div className="border-l border-gray-300 h-6 mx-2" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addBlock("image")}
              disabled={!editor.can().chain().focus().run()}
            >
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
                  disabled={!editor.can().insertTable()}
                >
                  Insert Table
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    editor.chain().focus().addColumnBefore().run()
                  }
                  disabled={!editor.can().addColumnBefore()}
                >
                  Add Column Before
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().addColumnAfter().run()}
                  disabled={!editor.can().addColumnAfter()}
                >
                  Add Column After
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().deleteColumn().run()}
                  disabled={!editor.can().deleteColumn()}
                >
                  Delete Column
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().addRowBefore().run()}
                  disabled={!editor.can().addRowBefore()}
                >
                  Add Row Before
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().addRowAfter().run()}
                  disabled={!editor.can().addRowAfter()}
                >
                  Add Row After
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().deleteRow().run()}
                  disabled={!editor.can().deleteRow()}
                >
                  Delete Row
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().deleteTable().run()}
                  disabled={!editor.can().deleteTable()}
                >
                  Delete Table
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    editor
                      .chain()
                      .focus()
                      .setCellAttribute("backgroundColor", "#FAF594")
                      .run()
                  }
                  disabled={
                    !editor.can().setCellAttribute("backgroundColor", "#FAF594")
                  }
                >
                  Set cell attribute
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().mergeCells().run()}
                  disabled={!editor.can().mergeCells()}
                >
                  Merge Cells
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => editor.chain().focus().splitCell().run()}
                  disabled={!editor.can().splitCell()}
                >
                  Split Cell
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              disabled={!editor.can().setTextAlign("left")}
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
              disabled={!editor.can().setTextAlign("center")}
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
              disabled={!editor.can().setTextAlign("right")}
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
              disabled={!editor.can().setTextAlign("justify")}
              className={
                editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""
              }
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              disabled={!editor.can().setHorizontalRule()}
            >
              <Minus className="h-4 w-4" />
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
