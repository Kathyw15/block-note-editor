import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import { SuggestionProps, SuggestionKeyDownProps } from "@tiptap/suggestion";

import { MentionList, MentionListProps, MentionListRef } from "./MentionList";

interface MentionSuggestion {
  items: (props: { query: string }) => string[];
  render: () => {
    onStart: (props: SuggestionProps) => void;
    onUpdate: (props: SuggestionProps) => void;
    onKeyDown: (props: SuggestionKeyDownProps) => boolean;
    onExit: () => void;
  };
}

const suggestion: MentionSuggestion = {
  items: ({ query }) => {
    return [
      "Lea Thompson",
      "Cyndi Lauper",
      "Tom Cruise",
      "Madonna",
      "Jerry Hall",
      "Joan Collins",
      "Winona Ryder",
      "Christina Applegate",
      "Alyssa Milano",
      "Molly Ringwald",
      "Ally Sheedy",
      "Debbie Harry",
      "Olivia Newton-John",
      "Elton John",
      "Michael J. Fox",
      "Axl Rose",
      "Emilio Estevez",
      "Ralph Macchio",
      "Rob Lowe",
      "Jennifer Grey",
      "Mickey Rourke",
      "John Cusack",
      "Matthew Broderick",
      "Justine Bateman",
      "Lisa Bonet",
    ]
      .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
      .slice(0, 5);
  },

  render: () => {
    let reactRenderer: ReactRenderer<MentionListRef, MentionListProps>;
    let popup: ReturnType<typeof tippy>[0];

    return {
      onStart: (props: SuggestionProps) => {
        reactRenderer = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        popup = tippy("body", {
          getReferenceClientRect: () => {
            if (props.clientRect) {
              const rect = props.clientRect();
              return rect || new DOMRect(0, 0, 0, 0);
            }
            return new DOMRect(0, 0, 0, 0);
          },
          appendTo: () => document.body,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        })[0];
      },

      onUpdate(props: SuggestionProps) {
        reactRenderer.updateProps(props);

        popup.setProps({
          getReferenceClientRect: () => {
            if (props.clientRect) {
              const rect = props.clientRect();
              return rect || new DOMRect(0, 0, 0, 0);
            }
            return new DOMRect(0, 0, 0, 0);
          },
        });
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (props.event.key === "Escape") {
          popup.hide();
          return true;
        }

        return reactRenderer.ref?.onKeyDown(props) || false;
      },

      onExit() {
        popup.destroy();
        reactRenderer.destroy();
      },
    };
  },
};

export default suggestion;
