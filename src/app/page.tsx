// pages/Home.tsx

"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Mention from "@tiptap/extension-mention";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import Placeholder from "@tiptap/extension-placeholder";
import { SnippetExtension } from "@/components/SnippetExtension";
import suggestion from "@/components/suggestion";
import EditorToolbar from "@/components/EditorToolbar";
import SnippetSidebar from "@/components/SnippetSidebar";

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-background-color"),
        renderHTML: (attributes) => ({
          "data-background-color": attributes.backgroundColor,
          style: `background-color: ${attributes.backgroundColor}`,
        }),
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
      Placeholder.configure({ placeholder: "Start writing your report..." }),
      Image,
      SnippetExtension,
      Underline,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      CustomTableCell,
      Highlight,
      Superscript,
      GlobalDragHandle.configure({
        dragHandleWidth: 24,
        scrollTreshold: 50,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Mention.configure({
        HTMLAttributes: { class: "mention" },
        suggestion,
      }),
    ],
    content: "",
    editorProps: {
      attributes: { class: "prose focus:outline-none max-w-full" },
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

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    snippet: { id: string; content: string }
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
          <EditorToolbar editor={editor} addBlock={addBlock} />
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
      <SnippetSidebar snippets={snippets} onDragStart={onDragStart} />
    </div>
  );
}
