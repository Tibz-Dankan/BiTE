import React from "react";

// ── Types ──────────────────────────────────────────────────────────────────

interface Module {
  number: number;
  title: string;
  score: string;
}

interface CertificateProps {
  recipientName?: string;
  categoryName?: string;
  questionsCompleted?: number;
  exams?: string;
  modules?: Module[];
  signedBy?: string;
  organization?: string;
}

// ── Sub-components ──────────────────────────────────────────────────────────

const BitcoinIcon: React.FC = () => (
  <div className="relative w-20 h-20 flex-shrink-0">
    {/* Glow */}
    <div className="absolute inset-0 rounded-full bg-yellow-400 blur-xl opacity-40" />
    {/* Coin body */}
    <div
      className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl"
      style={{
        background:
          "radial-gradient(circle at 35% 35%, #ffd700, #e6a800 60%, #b8860b)",
        boxShadow:
          "0 0 24px 6px rgba(255,215,0,0.45), inset 0 -4px 8px rgba(0,0,0,0.3)",
      }}
    >
      <span
        className="text-3xl font-black select-none"
        style={{
          color: "#7a5200",
          textShadow: "1px 1px 0 rgba(255,255,255,0.3)",
          fontFamily: "'Georgia', serif",
        }}
      >
        ₿
      </span>
    </div>
    {/* Circuit tendrils */}
    <svg
      className="absolute -bottom-6 left-1/2 -translate-x-1/2"
      width="80"
      height="32"
      viewBox="0 0 80 32"
      fill="none"
    >
      {[10, 25, 40, 55, 70].map((x, i) => (
        <g key={i}>
          <line
            x1={x}
            y1="0"
            x2={x}
            y2="20"
            stroke="#00ffcc"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <circle cx={x} cy="22" r="2.5" fill="#00ffcc" opacity="0.8" />
        </g>
      ))}
    </svg>
  </div>
);

const ChipIcon: React.FC = () => (
  <div
    className="w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-lg border-2"
    style={{
      background: "linear-gradient(135deg, #1a1a2e, #2d2d4e)",
      borderColor: "#00ffcc",
      boxShadow: "0 0 12px rgba(0,255,204,0.3)",
    }}
  >
    <svg viewBox="0 0 48 48" width="44" height="44" fill="none">
      {/* Chip body */}
      <rect
        x="12"
        y="12"
        width="24"
        height="24"
        rx="2"
        fill="#00ffcc"
        opacity="0.15"
        stroke="#00ffcc"
        strokeWidth="1.5"
      />
      {/* Inner grid */}
      {[17, 22, 27, 32].map((x) =>
        [17, 22, 27, 32].map((y) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="3"
            height="3"
            rx="0.5"
            fill="#00ffcc"
            opacity="0.6"
          />
        )),
      )}
      {/* Pins */}
      {[16, 22, 28, 34].map((pos) => (
        <g key={pos}>
          <line
            x1={pos}
            y1="12"
            x2={pos}
            y2="6"
            stroke="#00ffcc"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <line
            x1={pos}
            y1="36"
            x2={pos}
            y2="42"
            stroke="#00ffcc"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <line
            x1="12"
            y1={pos}
            x2="6"
            y2={pos}
            stroke="#00ffcc"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <line
            x1="36"
            y1={pos}
            x2="42"
            y2={pos}
            stroke="#00ffcc"
            strokeWidth="1.5"
            opacity="0.7"
          />
        </g>
      ))}
    </svg>
  </div>
);

const CornerDot: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div
    className={`absolute w-3 h-3 rounded-full bg-cyan-400 ${className}`}
    style={{ boxShadow: "0 0 8px 2px rgba(0,255,204,0.6)" }}
  />
);

// ── Main Certificate Component ──────────────────────────────────────────────

const Certificate: React.FC<CertificateProps> = ({
  recipientName = "Person X",
  categoryName = "Bitcoin",
  questionsCompleted = 256,
  exams = "10 BiTEs",
  modules = [
    {
      number: 1,
      title: "Data Analysis and Descriptive Statistics",
      score: "Score Y",
    },
    {
      number: 2,
      title: "Probability and Inferential Statistics",
      score: "Score Z",
    },
    {
      number: 3,
      title: "Linear Algebra: The Language of Neural Networks",
      score: "Score W",
    },
    { number: 4, title: "Calculus and Optimization", score: "Score T" },
    {
      number: 5,
      title:
        "Final Essay on human flourishing through leveraging AI tools to build and care for the Bitcoin Ecosystem.",
      score: "Completed",
    },
  ],
  signedBy = "CEO",
  organization = "Bitcoin High School",
}) => {
  return (
    <div
      className="flex items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 100%)",
      }}
    >
      {/* Certificate outer frame */}
      <div
        className="relative w-full max-w-3xl"
        style={{
          background:
            "linear-gradient(160deg, #0d1117 0%, #111827 50%, #0a0f1a 100%)",
          border: "2px solid #00ffcc",
          borderRadius: "4px",
          boxShadow:
            "0 0 0 6px rgba(0,255,204,0.08), 0 0 40px rgba(0,255,204,0.15), 0 20px 60px rgba(0,0,0,0.8)",
          padding: "2px",
        }}
      >
        {/* Inner animated border */}
        <div
          className="absolute inset-0 rounded pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 20%, rgba(0,255,204,0.15) 50%, transparent 80%)",
            animation: "shimmer 3s infinite linear",
          }}
        />

        {/* Corner decorations */}
        <CornerDot className="top-3 left-3" />
        <CornerDot className="top-3 right-3" />
        <CornerDot className="bottom-3 left-3" />
        <CornerDot className="bottom-3 right-3" />

        {/* Top edge dots */}
        {[25, 37.5, 50, 62.5, 75].map((pct) => (
          <div
            key={pct}
            className="absolute top-1.5 w-2 h-2 rounded-full bg-cyan-400 -translate-x-1/2"
            style={{
              left: `${pct}%`,
              boxShadow: "0 0 6px rgba(0,255,204,0.6)",
            }}
          />
        ))}
        {[25, 37.5, 50, 62.5, 75].map((pct) => (
          <div
            key={pct}
            className="absolute bottom-1.5 w-2 h-2 rounded-full bg-cyan-400 -translate-x-1/2"
            style={{
              left: `${pct}%`,
              boxShadow: "0 0 6px rgba(0,255,204,0.6)",
            }}
          />
        ))}

        {/* Content area */}
        <div className="relative z-10 px-10 py-8">
          {/* Header row */}
          <div className="flex items-start justify-between mb-4">
            <BitcoinIcon />

            {/* Title block */}
            <div className="flex-1 text-center px-4">
              <h1
                className="text-2xl font-black tracking-widest uppercase mb-2"
                style={{
                  color: "#ffffff",
                  fontFamily: "'Georgia', serif",
                  letterSpacing: "0.15em",
                  textShadow: "0 0 20px rgba(255,255,255,0.3)",
                }}
              >
                Certificate of Completion
              </h1>

              <p
                className="text-sm mb-2"
                style={{ color: "#a0aec0", fontFamily: "'Georgia', serif" }}
              >
                Of
              </p>

              <h2
                className="text-lg font-extrabold leading-snug"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                <span style={{ color: "#ffffff" }}>{categoryName} </span>
                <span
                  style={{
                    color: "#f59e0b",
                    textShadow: "0 0 12px rgba(245,158,11,0.5)",
                  }}
                >
                  Certificate
                </span>
              </h2>
            </div>

            <ChipIcon />
          </div>

          {/* Divider */}
          <div
            className="w-full h-px mb-5"
            style={{
              background:
                "linear-gradient(90deg, transparent, #00ffcc, transparent)",
            }}
          />

          {/* Award text */}
          <p
            className="text-center text-sm leading-relaxed mb-1"
            style={{ color: "#f6c90e", fontFamily: "'Georgia', serif" }}
          >
            This Certificate is awarded to{" "}
            <span className="font-bold" style={{ color: "#f6c90e" }}>
              ({recipientName})
            </span>{" "}
            for appreciating Bitcoin and learning
          </p>
          <p
            className="text-center text-sm mb-5"
            style={{ color: "#f6c90e", fontFamily: "'Georgia', serif" }}
          >
            how to use AI to benefit the Bitcoin Ecosystem.
          </p>

          {/* Stats row */}
          <div className="flex justify-center gap-10 mb-3">
            <span
              className="text-xs font-semibold"
              style={{ color: "#e2e8f0", fontFamily: "'Georgia', serif" }}
            >
              Questions completed:{" "}
              <span className="font-bold text-white">{questionsCompleted}</span>
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: "#e2e8f0", fontFamily: "'Georgia', serif" }}
            >
              Exams: <span className="font-bold text-white">{exams}</span>
            </span>
          </div>

          {/* Modules heading */}
          <h3
            className="text-center text-base font-bold mb-4"
            style={{ color: "#ffffff", fontFamily: "'Georgia', serif" }}
          >
            Modules covered:
          </h3>

          {/* Module list */}
          <div className="space-y-2 mb-6">
            {modules.map((mod) => (
              <div key={mod.number} className="flex items-end gap-1">
                <span
                  className="text-xs whitespace-nowrap flex-shrink-0"
                  style={{
                    color: "#cbd5e0",
                    fontFamily: "'Georgia', serif",
                    minWidth: "max-content",
                  }}
                >
                  {mod.number}. {mod.title}
                </span>
                <span
                  className="flex-1 border-b border-dashed mx-1"
                  style={{
                    borderColor: "rgba(0,255,204,0.3)",
                    marginBottom: "3px",
                  }}
                />
                <span
                  className="text-xs font-bold flex-shrink-0"
                  style={{
                    color: mod.score === "Completed" ? "#00ffcc" : "#f6c90e",
                    fontFamily: "'Georgia', serif",
                  }}
                >
                  {mod.score}
                </span>
              </div>
            ))}
          </div>

          {/* Signature */}
          <div className="flex justify-center">
            <div className="text-center">
              <div
                className="w-36 border-b mb-1"
                style={{ borderColor: "#a0aec0" }}
              />
              <p
                className="text-xs italic"
                style={{ color: "#a0aec0", fontFamily: "'Georgia', serif" }}
              >
                Signed:
              </p>
              <p
                className="text-xs font-bold"
                style={{ color: "#ffffff", fontFamily: "'Georgia', serif" }}
              >
                {signedBy}
              </p>
              <p
                className="text-xs"
                style={{ color: "#a0aec0", fontFamily: "'Georgia', serif" }}
              >
                {organization}
              </p>
            </div>
          </div>

          {/* Bottom-right star */}
          <div
            className="absolute bottom-6 right-8 text-2xl select-none"
            style={{ color: "#4a5568", opacity: 0.6 }}
          >
            ✦
          </div>
        </div>

        {/* Side border lines */}
        <div
          className="absolute left-0 top-8 bottom-8 w-0.5"
          style={{
            background:
              "linear-gradient(180deg, transparent, #00ffcc, transparent)",
          }}
        />
        <div
          className="absolute right-0 top-8 bottom-8 w-0.5"
          style={{
            background:
              "linear-gradient(180deg, transparent, #00ffcc, transparent)",
          }}
        />
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Certificate;
