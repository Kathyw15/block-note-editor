interface Snippet {
  id: string;
  content: string;
}

interface SnippetSidebarProps {
  snippets: Snippet[];
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    snippet: Snippet
  ) => void;
}

const SnippetSidebar: React.FC<SnippetSidebarProps> = ({
  snippets,
  onDragStart,
}) => {
  return (
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
  );
};

export default SnippetSidebar;
