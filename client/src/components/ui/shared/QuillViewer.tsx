import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuillViewerProps {
  deltaContent: string;
}

export const QuillViewer: React.FC<QuillViewerProps> = ({ deltaContent }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current && !quillRef.current) {
      quillRef.current = new Quill(containerRef.current, {
        theme: "snow",
        readOnly: true,
        modules: {
          toolbar: false,
        },
      });

      // Set content
      const delta = JSON.parse(deltaContent);
      quillRef.current.setContents(delta);

      // Set Custom styles for Editor elements
      const qlContainer =
        quillRef.current.container.parentElement.querySelector(".ql-container");

      if (qlContainer) {
        qlContainer.style.border = "none";
      }

      const qlEditor =
        quillRef.current.container.parentElement.querySelector(".ql-editor");

      if (qlEditor) {
        qlEditor.style.padding = "0px";
      }
    }
  }, [deltaContent]);

  return (
    <div className="w-full mx-auto">
      <div ref={containerRef}>
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
