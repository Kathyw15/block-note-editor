import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import DraggableItem from "./DraggableItem";

export const DraggableItemExtension = Node.create({
  name: "draggableItem",

  group: "block",

  content: "block+",

  draggable: true,

  parseHTML() {
    return [
      {
        tag: 'div[data-type="draggable-item"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-type": "draggable-item", ...HTMLAttributes }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DraggableItem);
  },
});
