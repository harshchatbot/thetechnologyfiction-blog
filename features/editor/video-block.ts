import { Node, mergeAttributes } from "@tiptap/core";

export const VideoBlock = Node.create({
  name: "videoBlock",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: {
        default: null
      },
      title: {
        default: null
      },
      caption: {
        default: null
      },
      mimeType: {
        default: null
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-video-block]"
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { "data-video-block": "true", class: "ttf-video-block" },
      [
        "video",
        mergeAttributes(HTMLAttributes, {
          controls: "true",
          preload: "metadata",
          playsinline: "true",
          class: "ttf-video-element",
          src: HTMLAttributes.src
        })
      ]
    ];
  }
});
