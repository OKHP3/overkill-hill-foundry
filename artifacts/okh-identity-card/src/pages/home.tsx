import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
  const [markFailed, setMarkFailed] = useState(false);
  const swatches = [
    { color: "#0f172a", label: "Forge BG" },
    { color: "#1c3a34", label: "Teal" },
    { color: "#c46a2c", label: "Accent" },
    { color: "#e6a03c", label: "Amber" },
    { color: "#676a2c", label: "Olive" },
    { color: "#a06e28", label: "Ochre" },
    { color: "#5b3a27", label: "Rust" },
    { color: "#f6f2ee", label: "Paper" },
  ];

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100dvh",
        background: "#111827",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        padding: "1.5rem",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Subtle ambient background texture/grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%",
          maxWidth: "640px",
          background: "#181f26",
          border: "1px solid #2a3a4a",
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow:
            "0 18px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(196,106,44,0.08)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Orange accent bar — top */}
        <motion.div
          animate={{ scaleX: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            height: "3px",
            background:
              "linear-gradient(90deg, #c46a2c 0%, #e6a03c 60%, transparent 100%)",
            transformOrigin: "left",
          }}
        />

        {/* Keep the desktop split; stack panels before mobile content is clipped. */}
        <div
          className="flex flex-col min-[560px]:flex-row"
          style={{ minHeight: "260px" }}
        >
          {/* Left — forge mark panel */}
          <div
            className="w-full border-b min-[560px]:w-[200px] min-[560px]:border-b-0 min-[560px]:border-r"
            style={{
              flexShrink: 0,
              background: "linear-gradient(160deg, #1c3a34 0%, #0f2620 100%)",
              borderColor: "#2a3a4a",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              padding: "1.5rem 1rem",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Teal dot grid */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(circle, rgba(28,90,80,0.45) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            />

            {/* Forge hammer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              style={{
                position: "relative",
                zIndex: 1,
                width: "80px",
                height: "80px",
                borderRadius: "14px",
                background: "#111827",
                border: "1px solid rgba(196,106,44,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 24px rgba(196,106,44,0.2)",
                    "0 0 32px rgba(196,106,44,0.35)",
                    "0 0 24px rgba(196,106,44,0.2)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "14px",
                }}
              />
              {markFailed ? (
                <span
                  role="img"
                  aria-label="Forge mark"
                  style={{
                    position: "relative",
                    zIndex: 2,
                    fontSize: "2.2rem",
                  }}
                >
                  <span aria-hidden="true">⚙</span>
                </span>
              ) : (
                <img
                  src={`${import.meta.env.BASE_URL}forge-icon.png`}
                  alt="Forge mark"
                  style={{
                    width: "62px",
                    height: "62px",
                    objectFit: "contain",
                    position: "relative",
                    zIndex: 2,
                  }}
                  onError={() => setMarkFailed(true)}
                />
              )}
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              style={{ position: "relative", zIndex: 1, textAlign: "center" }}
            >
              <div
                style={{
                  fontFamily: "'Alfa Slab One', serif",
                  fontSize: "1.05rem",
                  color: "#e5e7eb",
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                }}
              >
                OverKill Hill
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  color: "#c46a2c",
                  letterSpacing: "0.12em",
                  marginTop: "2px",
                }}
              >
                P³ · Found·Ry
              </div>
            </motion.div>

            {/* Bottom teal accent line */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "20%",
                right: "20%",
                height: "1px",
                background: "rgba(28,90,80,0.6)",
              }}
            />
          </div>

          {/* Right — content panel */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              padding: "1.5rem 1.5rem 1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.9rem",
            }}
          >
            {/* Category label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.2em",
                color: "#4b5563",
                textTransform: "uppercase",
              }}
            >
              Custom GPT Creator · v2026
            </motion.div>

            {/* Product headline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.4 }}
            >
              <div
                style={{
                  fontFamily: "'Alfa Slab One', serif",
                  fontSize: "1.35rem",
                  color: "#e5e7eb",
                  lineHeight: 1.15,
                }}
              >
                Build GPTs With{" "}
                <span style={{ color: "#c46a2c" }}>Protocol</span>
              </div>
            </motion.div>

            {/* Descriptor */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.4 }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.82rem",
                color: "#6b7280",
                lineHeight: 1.55,
                marginTop: "-0.45rem",
              }}
            >
              Structured practitioner workflow from brief to ship — no generic
              prompt gymnastics.
            </motion.div>

            {/* Forge attributes — monospace data plate style */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.4 }}
              style={{
                background: "#111827",
                border: "1px solid #2a3a4a",
                borderRadius: "8px",
                padding: "0.65rem 0.85rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              {[
                ["ORIGIN", "overkillhill.com"],
                ["STACK", "React · Vite · TypeScript"],
                ["LICENSE", "MIT · Free to fork"],
              ].map(([key, val]) => (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.62rem",
                  }}
                >
                  <span
                    style={{
                      color: "#c46a2c",
                      minWidth: "56px",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {key}
                  </span>
                  <span style={{ color: "#9ca3af" }}>{val}</span>
                </div>
              ))}
            </motion.div>

            {/* Palette swatches */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.55rem",
                  color: "#374151",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: "0.4rem",
                }}
              >
                Forge Palette
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                {swatches.map((s) => (
                  <div
                    key={s.color}
                    title={s.label}
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "4px",
                      background: s.color,
                      border: "1px solid rgba(255,255,255,0.06)",
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          style={{
            padding: "0.6rem 1.25rem",
            borderTop: "1px solid #1e2936",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "#111827",
          }}
        >
          <div style={{ display: "flex", gap: "1.25rem" }}>
            {["Precision", "Protocol", "Promptcraft"].map((word, i) => (
              <span
                key={word}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.58rem",
                  color: i === 0 ? "#c46a2c" : "#374151",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {word}
              </span>
            ))}
          </div>
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "6px",
              height: "6px",
              background: "#c46a2c",
              borderRadius: "50%",
              boxShadow: "0 0 6px #c46a2c",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
