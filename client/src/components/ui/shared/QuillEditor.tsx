import React, { useEffect, type ReactNode } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import type { QuillOnChangeValues } from "../../../types/quillEditor";

interface QuillEditorProps {
  placeholder?: string;
  label?: ReactNode;
  defaultDelta?: string;
  onChange: (values: QuillOnChangeValues) => void;
}

export const QuillEditor: React.FC<QuillEditorProps> = (props) => {
  const label = props.label ? props.label : "";
  const { quill, quillRef } = useQuill();

  // Set default value when quill is ready
  useEffect(() => {
    if (quill && props.defaultDelta) {
      try {
        const delta = JSON.parse(props.defaultDelta);
        quill.setContents(delta);
      } catch (error) {
        console.error("Failed to parse defaultDelta:", error);
      }
    }
  }, [quill, props.defaultDelta]);

  useEffect(() => {
    if (quill) {
      // Set Custom styles for Editor toolbar
      const toolbar =
        quillRef.current.parentElement?.querySelector(".ql-toolbar");

      if (toolbar) {
        toolbar.style.borderTopLeftRadius = "8px";
        toolbar.style.borderTopRightRadius = "8px";
      }

      // Capture Editor Input Changes
      // quill.on("text-change", (delta, oldDelta, source) => {
      quill.on("text-change", (_, __, source) => {
        if (source === "user") {
          const deltaContent = JSON.stringify(quill.getContents());
          const htmlContent = quill.root.innerHTML;
          const plainText = quill.getText();

          console.log("Delta:", deltaContent);
          console.log("HTML:", htmlContent);
          console.log("Plain Text:", plainText);

          props.onChange({
            deltaContent: deltaContent,
            htmlContent: htmlContent,
            plainText: plainText,
          });
        }
      });
    }
  }, [quill, props, quillRef]);

  return (
    <div
      className="w-full mb-5 p flex flex-col items-start justify-start
      gap-1 h-76 sm:h-60"
    >
      <label className="text-sm first-letter:uppercase font-[450] text-gray-800">
        {label}
      </label>
      <div className="w-full" style={{ height: 150 }}>
        <div
          ref={quillRef}
          style={{
            borderBottomLeftRadius: "8px",
            borderBottomRightRadius: "8px",
          }}
        />
      </div>
    </div>
  );
};
