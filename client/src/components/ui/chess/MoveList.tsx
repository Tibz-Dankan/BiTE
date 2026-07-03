import React from "react";

interface MoveListProps {
  // The puzzle's starting FEN (before the setup move) — used to derive the
  // first move number and side to move.
  startFen: string;
  sanHistory: string[];
}

interface MoveRow {
  number: number;
  white?: string;
  black?: string;
}

const buildRows = (startFen: string, sanHistory: string[]): MoveRow[] => {
  const parts = startFen.split(" ");
  const sideToMove = parts[1] === "b" ? "b" : "w";
  let moveNo = parseInt(parts[5], 10);
  if (Number.isNaN(moveNo)) moveNo = 1;

  const rows: MoveRow[] = [];
  let whiteToMove = sideToMove === "w";
  let current: MoveRow = { number: moveNo };
  if (!whiteToMove) current.white = "…";

  for (const san of sanHistory) {
    if (whiteToMove) {
      current.white = san;
      whiteToMove = false;
    } else {
      current.black = san;
      rows.push(current);
      moveNo += 1;
      current = { number: moveNo };
      whiteToMove = true;
    }
  }
  if (current.white !== undefined || current.black !== undefined) {
    rows.push(current);
  }
  return rows;
};

export const MoveList: React.FC<MoveListProps> = ({
  startFen,
  sanHistory,
}) => {
  const rows = buildRows(startFen, sanHistory);
  const lastIndex = sanHistory.length - 1;
  let plyCounter = -1;

  const renderMove = (san?: string) => {
    if (san === undefined) return <span className="text-transparent">.</span>;
    if (san === "…") return <span className="text-(--muted-foreground)">…</span>;
    plyCounter += 1;
    const isLast = plyCounter === lastIndex;
    return (
      <span
        className={
          isLast
            ? "px-1 rounded bg-(--primary) text-(--primary-foreground) font-semibold"
            : ""
        }
      >
        {san}
      </span>
    );
  };

  return (
    <div className="h-40 overflow-y-auto rounded-md border border-(--border) bg-(--card) text-sm">
      {rows.length === 0 ? (
        <p className="p-3 text-(--muted-foreground)">No moves yet.</p>
      ) : (
        <table className="w-full">
          <tbody>
            {rows.map((row) => (
              <tr key={row.number} className="border-b border-(--border) last:border-0">
                <td className="w-10 px-2 py-1 text-(--muted-foreground) text-right select-none">
                  {row.number}.
                </td>
                <td className="px-2 py-1">{renderMove(row.white)}</td>
                <td className="px-2 py-1">{renderMove(row.black)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
