import React from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import "./DraggableItem.css";

const DraggableItem: React.FC = () => {
  return (
    <NodeViewWrapper className="draggable-item">
      <div
        className="drag-handle"
        contentEditable={false}
        draggable={true}
        data-drag-handle
      />
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
};

export default DraggableItem;
