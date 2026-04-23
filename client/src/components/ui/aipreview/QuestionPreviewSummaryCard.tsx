import React from "react";
import type { TAIPreview } from "../../../types/aiPreview";
import { Sparkles } from "lucide-react";

interface QuestionPreviewSummaryCardProps {
  aiPreview: TAIPreview;
}

export const QuestionPreviewSummaryCard: React.FC<
  QuestionPreviewSummaryCardProps
> = (props) => {
  const { aiPreview } = props;

  return (
    <div
      className="w-full mt-4 p-4 rounded-xl border border-indigo-200
       bg-indigo-50/50"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-indigo-500" />
        <h4 className="text-sm font-semibold text-indigo-800">AI Summary</h4>
      </div>
      <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
        {aiPreview.summary}
      </p>
    </div>
  );
};
