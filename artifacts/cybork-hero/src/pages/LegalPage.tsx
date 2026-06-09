import { ReactNode } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { NoiseBackground } from "@/components/NoiseBackground";
import CardNav from "@/components/CardNav";
import ASCIIText from "@/components/ASCIIText";
import logoUrl from "@assets/5e491840e325ffc189450199e39413a5_1780984645568.webp";
import { SiDiscord } from "react-icons/si";

const DISCORD_INVITE = "https://discord.com/oauth2/authorize";

const B = {
  5: "rgb(100, 106, 118)",
  4: "rgb(76,  81,  92)",
  3: "rgb(56,  59,  67)",
  2: "rgb(36,  38,  44)",
  1: "rgb(20,  21,  24)",
} as const;

const CYBORK_NAV_ITEMS = [
  {
    label: "Features",
    bgColor: "rgba(14, 16, 20, 0.97)",
    textColor: "rgba(255,255,255,0.85)",
    links: [
      { label: "Smart Moderation", href: "/#features", ariaLabel: "Smart Moderation" },
      { label: "Crystal Music",    href: "/#features", ariaLabel: "Music feature" },
      { label: "Leveling & XP",    href: "/#features", ariaLabel: "XP feature" },
      { label: "Economy System",   href: "/#features", ariaLabel: "Economy feature" },
    ],
  },
  {
    label: "Commands",
    bgColor: "rgba(18, 20, 26, 0.97)",
    textColor: "rgba(255,255,255,0.85)",
    links: [
      { label: "/play",    href: "/#commands", ariaLabel: "play command" },
      { label: "/ban",     href: "/#commands", ariaLabel: "ban command" },
      { label: "/rank",    href: "/#commands", ariaLabel: "rank command" },
      { label: "/economy", href: "/#commands", ariaLabel: "economy command" },
    ],
  },
  {
    label: "Legal",
    bgColor: "rgba(22, 24, 30, 0.97)",
    textColor: "rgba(255,255,255,0.85)",
    links: [
      { label: "Terms of Service", href: "/terms",   ariaLabel: "Terms of Service" },
      { label: "Privacy Policy",   href: "/privacy", ariaLabel: "Privacy Policy" },
      { label: "Support",          href: "/support", ariaLabel: "Support" },
    ],
  },
];

function HUDCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const Bracket = ({ top, bottom, left, right }: any) => (
    <span className="absolute block pointer-events-none" style={{
      width: "8px", height: "8px",
      top, bottom, left, right,
      borderTop:    top    !== undefined ? "1px solid rgba(255,255,255,0.18)" : "none",
      borderBottom: bottom !== undefined ? "1px solid rgba(255,255,255,0.18)" : "none",
      borderLeft:   left   !== undefined ? "1px solid rgba(255,255,255,0.18)" : "none",
      borderRight:  right  !== undefined ? "1px solid rgba(255,255,255,0.18)" : "none",
    }} />
  );
  return (
    <div className={`relative overflow-hidden ${className}`} style={{
      background: "rgba(15, 17, 20, 0.85)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
    }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px)",
      }} />
      <Bracket top="4px"    left="4px"  />
      <Bracket top="4px"    right="4px" />
      <Bracket bottom="4px" left="4px"  />
      <Bracket bottom="4px" right="4px" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface Section {
  heading: string;
  body: ReactNode;
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  sections: Section[];
}

export default function LegalPage({ title, lastUpdated, sections }: LegalPageProps) {
  const isMobile = useIsMobile();

  return (
    <div className="relative min-h-screen" style={{ background: "rgb(8, 8, 10)" }}>
      <NoiseBackground />
      <div className="relative" style={{ zIndex: 1 }}>
        <CardNav
          logo={logoUrl}
          logoAlt="Cybork"
          items={CYBORK_NAV_ITEMS}
          ctaHref={DISCORD_INVITE}
          ctaLabel="Add to Discord"
        />

        <div className="max-w-3xl mx-auto px-4 pt-28 pb-20">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <HUDCard className="mb-8">
              <div style={{ height: isMobile ? "80px" : "100px", position: "relative" }}>
                <ASCIIText
                  text={title}
                  asciiFontSize={isMobile ? 4 : 5}
                  textFontSize={isMobile ? 160 : 200}
                  textColor="#ffffff"
                  planeBaseHeight={9}
                  enableWaves={false}
                  gradientCss="linear-gradient(160deg, rgb(180,186,200) 0%, rgb(100,106,118) 100%)"
                />
              </div>
              <div style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "10px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <span style={{ color: B[4], fontSize: "9px", fontFamily: "var(--app-font-mono)", letterSpacing: "0.18em" }}>
                  LAST UPDATED · {lastUpdated}
                </span>
                <span style={{ color: B[3], fontSize: "9px", fontFamily: "var(--app-font-mono)", letterSpacing: "0.12em" }}>
                  CYBORK BOT
                </span>
              </div>
            </HUDCard>
          </motion.div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {sections.map((sec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <HUDCard>
                  <div style={{ padding: "20px 24px 22px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                      <span style={{ color: B[4], fontFamily: "var(--app-font-mono)", fontSize: "9px", letterSpacing: "0.18em" }}>
                        §{String(i + 1).padStart(2, "0")}
                      </span>
                      <span style={{
                        color: "rgba(255,255,255,0.75)",
                        fontSize: "11px", fontWeight: 700,
                        fontFamily: "var(--app-font-sans)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}>
                        {sec.heading}
                      </span>
                    </div>
                    <div style={{
                      color: "rgb(76, 81, 92)",
                      fontSize: "13px",
                      fontFamily: "var(--app-font-sans)",
                      lineHeight: "1.75",
                    }}>
                      {sec.body}
                    </div>
                  </div>
                </HUDCard>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            style={{ marginTop: "48px", textAlign: "center", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}
          >
            <a
              href={DISCORD_INVITE}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "12px 28px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.82)",
                fontSize: "11px", fontFamily: "var(--app-font-sans)", fontWeight: 600,
                letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none",
                transition: "all 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; e.currentTarget.style.borderColor = "rgba(200,160,60,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              <SiDiscord size={14} />
              Add Cybork to Discord — Free
            </a>
            <div style={{ display: "flex", gap: "24px" }}>
              {[["Terms", "/terms"], ["Privacy", "/privacy"], ["Support", "/support"]].map(([label, href]) => (
                <a key={label} href={href} style={{ color: B[3], fontSize: "10px", fontFamily: "var(--app-font-mono)", transition: "color 150ms", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = B[5])}
                  onMouseLeave={(e) => (e.currentTarget.style.color = B[3])}>
                  {label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
