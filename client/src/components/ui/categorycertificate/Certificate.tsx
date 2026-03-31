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
  <div
    style={{
      position: "relative",
      width: "80px",
      height: "80px",
      flexShrink: 0,
    }}
  >
    {/* Glow */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "9999px",
        backgroundColor: "#facc15",
        filter: "blur(24px)",
        opacity: 0.4,
      }}
    />
    {/* Coin body */}
    <div
      style={{
        position: "relative",
        width: "80px",
        height: "80px",
        borderRadius: "9999px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at 35% 35%, #ffd700, #e6a800 60%, #b8860b)",
        boxShadow:
          "0 0 24px 6px rgba(255,215,0,0.45), inset 0 -4px 8px rgba(0,0,0,0.3)",
      }}
    >
      <span
        style={{
          fontSize: "1.875rem",
          fontWeight: 900,
          userSelect: "none",
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
      style={{
        position: "absolute",
        bottom: "-24px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
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
    style={{
      width: "64px",
      height: "64px",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
      border: "2px solid #00ffcc",
      background: "linear-gradient(135deg, #1a1a2e, #2d2d4e)",
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

interface CornerDotProps {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

const CornerDot: React.FC<CornerDotProps> = ({ top, bottom, left, right }) => (
  <div
    style={{
      position: "absolute",
      width: "12px",
      height: "12px",
      borderRadius: "9999px",
      backgroundColor: "#22d3ee",
      boxShadow: "0 0 8px 2px rgba(0,255,204,0.6)",
      top,
      bottom,
      left,
      right,
    }}
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
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "linear-gradient(135deg, #0a0a0f 0%, #0d1117 100%)",
      }}
    >
      {/* Certificate outer frame */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "48rem",
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
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "4px",
            pointerEvents: "none",
            background:
              "linear-gradient(90deg, transparent 20%, rgba(0,255,204,0.15) 50%, transparent 80%)",
            animation: "shimmer 3s infinite linear",
          }}
        />

        {/* Corner decorations */}
        <CornerDot top="12px" left="12px" />
        <CornerDot top="12px" right="12px" />
        <CornerDot bottom="12px" left="12px" />
        <CornerDot bottom="12px" right="12px" />

        {/* Top edge dots */}
        {[25, 37.5, 50, 62.5, 75].map((pct) => (
          <div
            key={`top-${pct}`}
            style={{
              position: "absolute",
              top: "6px",
              left: `${pct}%`,
              transform: "translateX(-50%)",
              width: "8px",
              height: "8px",
              borderRadius: "9999px",
              backgroundColor: "#22d3ee",
              boxShadow: "0 0 6px rgba(0,255,204,0.6)",
            }}
          />
        ))}
        {[25, 37.5, 50, 62.5, 75].map((pct) => (
          <div
            key={`bottom-${pct}`}
            style={{
              position: "absolute",
              bottom: "6px",
              left: `${pct}%`,
              transform: "translateX(-50%)",
              width: "8px",
              height: "8px",
              borderRadius: "9999px",
              backgroundColor: "#22d3ee",
              boxShadow: "0 0 6px rgba(0,255,204,0.6)",
            }}
          />
        ))}

        {/* Content area */}
        <div style={{ position: "relative", zIndex: 10, padding: "32px 40px" }}>
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <BitcoinIcon />

            {/* Title block */}
            <div style={{ flex: 1, textAlign: "center", padding: "0 16px" }}>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  color: "#ffffff",
                  fontFamily: "'Georgia', serif",
                  textShadow: "0 0 20px rgba(255,255,255,0.3)",
                }}
              >
                Certificate of Completion
              </h1>

              <p
                style={{
                  fontSize: "0.875rem",
                  marginBottom: "8px",
                  color: "#a0aec0",
                  fontFamily: "'Georgia', serif",
                }}
              >
                Of
              </p>

              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 800,
                  lineHeight: 1.4,
                  fontFamily: "'Georgia', serif",
                }}
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
            style={{
              width: "100%",
              height: "1px",
              marginBottom: "20px",
              background:
                "linear-gradient(90deg, transparent, #00ffcc, transparent)",
            }}
          />

          {/* Award text */}
          <p
            style={{
              textAlign: "center",
              fontSize: "0.875rem",
              lineHeight: 1.625,
              marginBottom: "4px",
              color: "#f6c90e",
              fontFamily: "'Georgia', serif",
            }}
          >
            This Certificate is awarded to{" "}
            <span style={{ fontWeight: 700, color: "#f6c90e" }}>
              ({recipientName})
            </span>{" "}
            for appreciating Bitcoin and learning
          </p>
          <p
            style={{
              textAlign: "center",
              fontSize: "0.875rem",
              marginBottom: "20px",
              color: "#f6c90e",
              fontFamily: "'Georgia', serif",
            }}
          >
            how to use AI to benefit the Bitcoin Ecosystem.
          </p>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "40px",
              marginBottom: "12px",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#e2e8f0",
                fontFamily: "'Georgia', serif",
              }}
            >
              Questions completed:{" "}
              <span style={{ fontWeight: 700, color: "#ffffff" }}>
                {questionsCompleted}
              </span>
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#e2e8f0",
                fontFamily: "'Georgia', serif",
              }}
            >
              Exams:{" "}
              <span style={{ fontWeight: 700, color: "#ffffff" }}>{exams}</span>
            </span>
          </div>

          {/* Modules heading */}
          <h3
            style={{
              textAlign: "center",
              fontSize: "1rem",
              fontWeight: 700,
              marginBottom: "16px",
              color: "#ffffff",
              fontFamily: "'Georgia', serif",
            }}
          >
            Modules covered:
          </h3>

          {/* Module list */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: "24px",
            }}
          >
            {modules.map((mod) => (
              <div
                key={mod.number}
                style={{ display: "flex", alignItems: "flex-end", gap: "4px" }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    color: "#cbd5e0",
                    fontFamily: "'Georgia', serif",
                    minWidth: "max-content",
                  }}
                >
                  {mod.number}. {mod.title}
                </span>
                <span
                  style={{
                    flex: 1,
                    borderBottom: "1px dashed rgba(0,255,204,0.3)",
                    margin: "0 4px",
                    marginBottom: "3px",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    flexShrink: 0,
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "144px",
                  borderBottom: "1px solid #a0aec0",
                  marginBottom: "4px",
                }}
              />
              <p
                style={{
                  fontSize: "0.75rem",
                  fontStyle: "italic",
                  color: "#a0aec0",
                  fontFamily: "'Georgia', serif",
                }}
              >
                Signed:
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  fontFamily: "'Georgia', serif",
                }}
              >
                {signedBy}
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#a0aec0",
                  fontFamily: "'Georgia', serif",
                }}
              >
                {organization}
              </p>
            </div>
          </div>

          {/* Bottom-right star */}
          <div
            style={{
              position: "absolute",
              bottom: "24px",
              right: "32px",
              fontSize: "1.5rem",
              userSelect: "none",
              color: "#4a5568",
              opacity: 0.6,
            }}
          >
            ✦
          </div>
        </div>

        {/* Side border lines */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "32px",
            bottom: "32px",
            width: "2px",
            background:
              "linear-gradient(180deg, transparent, #00ffcc, transparent)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "32px",
            bottom: "32px",
            width: "2px",
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
