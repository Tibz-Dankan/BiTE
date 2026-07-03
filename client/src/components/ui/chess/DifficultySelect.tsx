import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../shared/select";
import type { TChessDifficulty } from "../../../types/chessPuzzle";

const DIFFICULTIES: TChessDifficulty[] = [
  "easiest",
  "easier",
  "normal",
  "harder",
  "hardest",
];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface DifficultySelectProps {
  value: TChessDifficulty;
  onChange: (difficulty: TChessDifficulty) => void;
}

// Difficulty picker styled to match the admin "Category Color" field
// (components/ui/shared/CategoryColorSelect.tsx) — the same Radix Select.
export const DifficultySelect: React.FC<DifficultySelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <Select
      value={value}
      onValueChange={(v: string) => onChange(v as TChessDifficulty)}
    >
      <SelectTrigger className="border border-gray-300 bg-white text-gray-700 focus:ring-1 ring-(--primary)">
        <span className="font-medium">{cap(value)}</span>
      </SelectTrigger>
      <SelectContent className="max-h-[300px] z-[9999] bg-white">
        {DIFFICULTIES.map((difficulty) => (
          <SelectItem
            key={difficulty}
            value={difficulty}
            className="hover:bg-gray-50 cursor-pointer text-gray-700 font-medium"
          >
            {cap(difficulty)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
