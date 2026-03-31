import React from "react";

// ── Types ──────────────────────────────────────────────────────────────────

interface Quiz {
  number: number;
  title: string;
  score: string;
}

interface CertificateProps {
  recipientName?: string;
  categoryName?: string;
  questionsCompleted?: number;
  exams?: string;
  quizzes?: Quiz[];
  signedBy?: string;
  organization?: string;
}

// ── Sub-components ──────────────────────────────────────────────────────────

const LogoImage: React.FC = () => (
  <div
    style={{
      position: "relative",
      width: "80px",
      height: "80px",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {/* Soft glow ring */}
    <div
      style={{
        position: "absolute",
        inset: "-6px",
        borderRadius: "9999px",
        background:
          "radial-gradient(circle, rgba(234,179,8,0.25) 0%, transparent 70%)",
      }}
    />
    <img
      src="/images/bite-logo.png"
      alt="BiTE Logo"
      style={{
        width: "80px",
        height: "80px",
        objectFit: "contain",
        position: "relative",
        zIndex: 1,
        filter: "drop-shadow(0 2px 8px rgba(180,130,0,0.3))",
      }}
    />
  </div>
);

const GraduationCapIcon: React.FC = () => (
  <div
    style={{
      width: "72px",
      height: "72px",
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    }}
  >
    {/* Outer decorative ring */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "9999px",
        border: "2px solid rgba(180,130,0,0.35)",
        background:
          "radial-gradient(circle at 40% 35%, rgba(255,246,210,0.95), rgba(253,235,160,0.75))",
        boxShadow:
          "0 4px 16px rgba(180,130,0,0.2), inset 0 1px 3px rgba(255,255,255,0.8)",
      }}
    />
    {/* Inner dashed ring */}
    <div
      style={{
        position: "absolute",
        inset: "5px",
        borderRadius: "9999px",
        border: "1.5px dashed rgba(180,130,0,0.3)",
      }}
    />
    {/* Cap SVG */}
    <svg
      viewBox="0 0 48 48"
      width="38"
      height="38"
      fill="none"
      style={{ position: "relative", zIndex: 1 }}
    >
      <defs>
        <linearGradient
          id="capGrad"
          x1="4"
          y1="8"
          x2="44"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>
      {/* Mortarboard top */}
      <polygon
        points="24,8 44,18 24,28 4,18"
        fill="url(#capGrad)"
        opacity="0.95"
      />
      {/* Shine on board */}
      <polygon points="24,8 44,18 34,23 14,13" fill="rgba(255,255,255,0.22)" />
      {/* Cap body / gown */}
      <path
        d="M12 20 L12 32 Q24 38 24 38 Q24 38 36 32 L36 20 L24 26 Z"
        fill="#92400e"
        opacity="0.85"
      />
      {/* Tassel string */}
      <line
        x1="44"
        y1="18"
        x2="44"
        y2="30"
        stroke="#b45309"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Tassel ball */}
      <circle cx="44" cy="32" r="3" fill="#d97706" />
      {/* Tassel fringe */}
      {[-2, 0, 2].map((dx, i) => (
        <line
          key={i}
          x1={44 + dx}
          y1="35"
          x2={44 + dx}
          y2="40"
          stroke="#d97706"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />
      ))}
    </svg>
    {/* Star accents */}
    <div
      style={{
        position: "absolute",
        top: "2px",
        right: "5px",
        fontSize: "9px",
        color: "#d97706",
        opacity: 0.65,
        userSelect: "none",
      }}
    >
      ✦
    </div>
    <div
      style={{
        position: "absolute",
        bottom: "3px",
        left: "4px",
        fontSize: "7px",
        color: "#d97706",
        opacity: 0.45,
        userSelect: "none",
      }}
    >
      ✦
    </div>
  </div>
);

// ── Hexagonal tiled background ─────────────────────────────────────────────

const HexBackground: React.FC = () => {
  const hexSize = 22;
  const hexW = hexSize * 2;
  const hexH = Math.sqrt(3) * hexSize;
  const cols = 24;
  const rows = 20;

  const hexPoints = (cx: number, cy: number, r: number): string =>
    Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 180) * (60 * i - 30);
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(" ");

  const hexes: { cx: number; cy: number; key: string; opacity: number }[] = [];
  let idx = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * hexW * 0.75 + hexSize;
      const cy = row * hexH + (col % 2 === 1 ? hexH / 2 : 0) + hexH / 2;
      const opacity = 0.2 + ((idx * 37 + row * 13) % 55) / 220;
      hexes.push({ cx, cy, key: `${row}-${col}`, opacity });
      idx++;
    }
  }

  const vw = cols * hexW * 0.75 + hexSize;
  const vh = rows * hexH + hexH;

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        borderRadius: "6px",
      }}
      viewBox={`0 0 ${vw} ${vh}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hexFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(217,119,6,0.07)" />
          <stop offset="50%" stopColor="rgba(180,83,9,0.04)" />
          <stop offset="100%" stopColor="rgba(217,119,6,0.08)" />
        </linearGradient>
      </defs>
      {hexes.map(({ cx, cy, key, opacity }) => (
        <polygon
          key={key}
          points={hexPoints(cx, cy, hexSize - 1.2)}
          fill="url(#hexFillGrad)"
          stroke="rgba(180,83,9,0.2)"
          strokeWidth="0.75"
          opacity={opacity}
        />
      ))}
    </svg>
  );
};

// ── Main Certificate Component ──────────────────────────────────────────────

export const CertificateLightTheme: React.FC<CertificateProps> = ({
  recipientName = "Person X",
  categoryName = "Bitcoin",
  questionsCompleted = 20,
  exams = "10 BiTEs",
  quizzes = [
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
        background: "linear-gradient(135deg, #fefce8 0%, #fffbeb 100%)",
      }}
    >
      {/* Certificate outer frame */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "48rem",
          background:
            "linear-gradient(160deg, #fffdf0 0%, #fffbeb 50%, #fef9e0 100%)",
          border: "2px solid #b45309",
          borderRadius: "6px",
          boxShadow:
            "0 0 0 6px rgba(180,130,0,0.08), 0 0 0 12px rgba(180,130,0,0.04), 0 20px 60px rgba(120,80,0,0.15), 0 4px 16px rgba(180,130,0,0.1)",
          padding: "2px",
          overflow: "hidden",
        }}
      >
        {/* Hexagonal background */}
        <HexBackground />

        {/* Inner decorative border */}
        <div
          style={{
            position: "absolute",
            inset: "8px",
            borderRadius: "3px",
            border: "1px solid rgba(180,130,0,0.28)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background:
              "linear-gradient(90deg, transparent 0%, #b45309 30%, #d97706 50%, #b45309 70%, transparent 100%)",
            zIndex: 3,
          }}
        />
        {/* Bottom accent bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            background:
              "linear-gradient(90deg, transparent 0%, #b45309 30%, #d97706 50%, #b45309 70%, transparent 100%)",
            zIndex: 3,
          }}
        />

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
            <LogoImage />

            {/* Title block */}
            <div style={{ flex: 1, textAlign: "center", padding: "0 16px" }}>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                  color: "#1c0a00",
                  fontFamily: "'Georgia', serif",
                  textShadow: "0 1px 2px rgba(180,130,0,0.12)",
                  margin: "0 0 8px 0",
                }}
              >
                Certificate of Completion
              </h1>

              <p
                style={{
                  fontSize: "0.875rem",
                  marginBottom: "8px",
                  color: "#78350f",
                  fontFamily: "'Georgia', serif",
                  margin: "0 0 8px 0",
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
                  margin: 0,
                }}
              >
                <span style={{ color: "#1c0a00" }}>{categoryName} </span>
                <span
                  style={{
                    color: "#b45309",
                    textShadow: "0 1px 4px rgba(180,130,0,0.25)",
                  }}
                >
                  Module
                </span>
              </h2>
            </div>

            <GraduationCapIcon />
          </div>

          {/* Divider */}
          <div
            style={{
              width: "100%",
              height: "1px",
              marginBottom: "20px",
              background:
                "linear-gradient(90deg, transparent, #b45309, #d97706, #b45309, transparent)",
            }}
          />

          {/* Award text */}
          <p
            style={{
              textAlign: "center",
              fontSize: "0.875rem",
              lineHeight: 1.625,
              marginBottom: "4px",
              color: "#78350f",
              fontFamily: "'Georgia', serif",
              margin: "0 0 4px 0",
            }}
          >
            This Certificate is awarded to{" "}
            <span style={{ fontWeight: 700, color: "#b45309" }}>
              {recipientName}
            </span>{" "}
          </p>
          <p
            style={{
              textAlign: "center",
              fontSize: "0.875rem",
              marginBottom: "20px",
              color: "#78350f",
              fontFamily: "'Georgia', serif",
              margin: "0 0 20px 0",
            }}
          >
            {/* how to use AI to benefit the Bitcoin Ecosystem. */}
            for successfully completing the {categoryName} module on Bitcoin
            High School
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
                color: "#78350f",
                fontFamily: "'Georgia', serif",
              }}
            >
              Questions completed:{" "}
              <span style={{ fontWeight: 700, color: "#1c0a00" }}>
                {questionsCompleted}
              </span>
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "#78350f",
                fontFamily: "'Georgia', serif",
              }}
            >
              Exams:{" "}
              <span style={{ fontWeight: 700, color: "#1c0a00" }}>{exams}</span>
            </span>
          </div>

          {/* Modules heading */}
          <h3
            style={{
              textAlign: "center",
              fontSize: "1rem",
              fontWeight: 700,
              marginBottom: "16px",
              color: "#1c0a00",
              fontFamily: "'Georgia', serif",
              margin: "0 0 16px 0",
            }}
          >
            Quizzes Attempted:
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
            {quizzes.map((mod) => (
              <div
                key={mod.number}
                style={{ display: "flex", alignItems: "flex-end", gap: "4px" }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    color: "#44200a",
                    fontFamily: "'Georgia', serif",
                    minWidth: "max-content",
                  }}
                >
                  {mod.number}. {mod.title}
                </span>
                <span
                  style={{
                    flex: 1,
                    borderBottom: "1px dashed rgba(180,83,9,0.3)",
                    margin: "0 4px",
                    marginBottom: "3px",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    flexShrink: 0,
                    color: mod.score === "Completed" ? "#065f46" : "#b45309",
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
                  borderBottom: "1px solid #b45309",
                  marginBottom: "4px",
                }}
              />
              <p
                style={{
                  fontSize: "0.75rem",
                  fontStyle: "italic",
                  color: "#78350f",
                  fontFamily: "'Georgia', serif",
                  margin: "0",
                }}
              >
                Signed:
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#1c0a00",
                  fontFamily: "'Georgia', serif",
                  margin: "0",
                }}
              >
                {signedBy}
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#78350f",
                  fontFamily: "'Georgia', serif",
                  margin: "0",
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
              color: "#b45309",
              opacity: 0.35,
            }}
          >
            ✦
          </div>
        </div>

        {/* Left side border gradient */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "32px",
            bottom: "32px",
            width: "3px",
            background:
              "linear-gradient(180deg, transparent, #b45309, #d97706, #b45309, transparent)",
            zIndex: 4,
          }}
        />
        {/* Right side border gradient */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "32px",
            bottom: "32px",
            width: "3px",
            background:
              "linear-gradient(180deg, transparent, #b45309, #d97706, #b45309, transparent)",
            zIndex: 4,
          }}
        />
      </div>
    </div>
  );
};
