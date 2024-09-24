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
  Highlighter,
  Superscript,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Editor } from "@tiptap/react";
import { HeadingLevel } from "@/types";

interface EditorToolbarProps {
  editor: Editor;
  addBlock: (type: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor, addBlock }) => {
  const setHeading = (level: number) => {
    const defaultText = `New Heading ${level}`;

    editor
      ?.chain()
      .focus()
      .toggleHeading({ level: level as HeadingLevel })
      .insertContent(defaultText)
      .run();
  };

  return (
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
      <Button
        variant={editor.isActive("highlight") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive("superscript") ? "secondary" : "ghost"}
        size="sm"
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
      >
        <Superscript className="h-4 w-4" />
      </Button>

      <div className="border-l border-gray-300 h-6 mx-2" />

      {/* Headings */}
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
              disabled={!editor.can().toggleHeading({ level })}
            >
              Heading {level}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="border-l border-gray-300 h-6 mx-2" />

      {/* Lists */}
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

      {/* Alignment */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        disabled={!editor.can().setTextAlign("left")}
        className={editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
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
        className={editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        disabled={!editor.can().setTextAlign("justify")}
        className={
          editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""
        }
      >
        <AlignJustify className="h-4 w-4" />
      </Button>

      <div className="border-l border-gray-300 h-6 mx-2" />

      {/* Horizontal Rule */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        disabled={!editor.can().setHorizontalRule()}
      >
        <Minus className="h-4 w-4" />
      </Button>

      <div className="border-l border-gray-300 h-6 mx-2" />

      {/* Additional Elements */}
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
            onSelect={() => editor.chain().focus().addColumnBefore().run()}
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
            Set Cell Attribute
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
    </div>
  );
};

export default EditorToolbar;
