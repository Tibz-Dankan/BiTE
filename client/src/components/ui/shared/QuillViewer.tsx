import React, { useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import katex from "katex";
import "katex/dist/katex.min.css";

// Configure katex for Quill
if (typeof window !== "undefined") {
  (window as any).katex = katex;
}

interface QuillViewerProps {
  deltaContent: string;
}

export const QuillViewer: React.FC<QuillViewerProps> = ({ deltaContent }) => {
  const { quill, quillRef } = useQuill({
    theme: "snow",
    readOnly: true,
    modules: {
      toolbar: false,
    },
    formats: [
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "script",
      "code-block",
      "link",
      "image",
      "formula",
      "header",
      "color",
      "background",
      "align",
    ],
  });

  useEffect(() => {
    if (quill && deltaContent) {
      try {
        const delta = JSON.parse(deltaContent);
        quill.setContents(delta);
      } catch (error) {
        console.error("Failed to parse deltaContent:", error);
      }

      // Set Custom styles for Editor elements
      const qlContainer = quill.container;

      if (qlContainer) {
        qlContainer.style.border = "none";
      }

      const qlEditor = qlContainer.querySelector(".ql-editor") as HTMLElement;

      if (qlEditor) {
        qlEditor.style.padding = "0px";
      }
    }
  }, [quill, deltaContent]);

  return (
    <div className="w-full mx-auto">
      <div ref={quillRef}>
        <style>{`
          div :global(.ql-container) {
            // border: 2px solid #e5e7eb;
            // border-radius: 8px;
          }

          div :global(.ql-editor) {
            // cursor: default;
            // padding: 0px;
          }
        `}</style>
      </div>
    </div>
  );
};

//   .ql-container.ql-snow {
//     border: 1px solid #ccc;
// }

// .ql-editor {
//     box-sizing: border-box;
//     counter-reset: list-0 list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
//     line-height: 1.42;
//     height: 100%;
//     outline: none;
//     overflow-y: auto;
//     padding: 12px 15px;
//     tab-size: 4;
//     -moz-tab-size: 4;
//     text-align: left;
//     white-space: pre-wrap;
//     word-wrap: break-word;
// }
