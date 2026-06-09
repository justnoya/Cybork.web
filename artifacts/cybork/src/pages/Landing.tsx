import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Music,
  BarChart3,
  Zap,
  Users,
  MessageSquare,
  Star,
  ChevronDown,
  ArrowRight,
  Terminal,
  Trophy,
  Globe,
  Check,
} from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { NoiseBackground } from "@/components/NoiseBackground";
import logoUrl from "@assets/5e491840e325ffc189450199e39413a5_1780984645568.webp";

const DISCORD_INVITE = "https://discord.com/oauth2/authorize";

/* ─── Noise band palette (exact RGB values from the shader) ─────────────────
   These are the 6 hard color bands rendered by NoiseBackground.
   Pulling them directly into the UI creates visual harmony.                  */
const B = {
  5: "rgb(100, 106, 118)",   // lightest visible band — primary accent
  4: "rgb(76,  81,  92)",    // medium
  3: "rgb(56,  59,  67)",    // dark-medium
  2: "rgb(36,  38,  44)",    // very dark
  1: "rgb(20,  21,  24)",    // near-black
} as const;

const ACCENT = {
  iconBg:      "rgba(56, 59, 67, 0.55)",
  iconBorder:  "rgba(100, 106, 118, 0.32)",
  badgeBg:     "rgba(20, 21, 24, 0.85)",
  badgeBorder: "rgba(76, 81, 92, 0.45)",
  checkBg:     "rgba(56, 59, 67, 0.5)",
  checkBorder: "rgba(100, 106, 118, 0.35)",
  pillBg:      "rgba(36, 38, 44, 0.8)",
  pillBorder:  "rgba(76, 81, 92, 0.4)",
  icon:        B[5],
  label:       B[5],
  badge:       "hsl(0 0% 75%)",
  prefix:      B[5],
};

/* ─── Glass card surface styles ──────────────────────────────────────────────
   Cards are frosted glass floating above the terrain map.
   The backdrop-filter composites the animated noise through the panel.       */
const GLASS = {
  front: {
    background:    "rgba(8, 8, 10, 0.80)",
    backdropFilter:"blur(28px) saturate(1.3)",
    WebkitBackdropFilter: "blur(28px) saturate(1.3)",
    border:        "1px solid rgba(100, 106, 118, 0.22)",
    boxShadow:     "inset 0 1px 0 rgba(120, 128, 144, 0.12), 0 24px 48px rgba(0,0,0,0.5)",
  },
  mid: {
    background:    "rgba(20, 21, 24, 0.55)",
    border:        "1px solid rgba(76, 81, 92, 0.22)",
  },
  back: {
    background:    "rgba(36, 38, 44, 0.38)",
    border:        "1px solid rgba(56, 59, 67, 0.3)",
  },
  feature: {
    background:    "rgba(12, 12, 14, 0.70)",
    backdropFilter:"blur(20px) saturate(1.2)",
    WebkitBackdropFilter: "blur(20px) saturate(1.2)",
    border:        "1px solid rgba(76, 81, 92, 0.28)",
    boxShadow:     "inset 0 1px 0 rgba(100, 106, 118, 0.08), 0 8px 24px rgba(0,0,0,0.35)",
  },
};

/* ─── Section divider — cartographic legend style ───────────────────────────
   Thin horizontal rule fades from center label outward, like contour lines
   on a survey map.                                                           */
function ContourLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <div style={{
        height: "1px", flex: 1,
        background: `linear-gradient(to right, transparent, rgba(100,106,118,0.28))`,
      }} />
      <span style={{
        color: B[5], fontSize: "9px", fontWeight: 700,
        letterSpacing: "0.22em", textTransform: "uppercase",
        fontFamily: "var(--app-font-mono)",
      }}>
        {children}
      </span>
      <div style={{
        height: "1px", flex: 1,
        background: `linear-gradient(to left, transparent, rgba(100,106,118,0.28))`,
      }} />
    </div>
  );
}

/* ─── Stacked Card Wrapper ───────────────────────────────────────────────── */
function CardStack({
  children,
  className = "",
  animate = true,
}: {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 28 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : false}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${className}`}
    >
      {/* Back card — deep terrain layer */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          ...GLASS.back,
          transform: "rotate(-2.6deg) translateY(6px) scale(0.966)",
          zIndex: 0,
        }}
      />
      {/* Mid card */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          ...GLASS.mid,
          transform: "rotate(1.9deg) translateY(3px) scale(0.982)",
          zIndex: 1,
        }}
      />
      {/* Front card — glass surface */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ ...GLASS.front, zIndex: 2 }}
      >
        {/* Subtle grain texture overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            opacity: 0.022,
            mixBlendMode: "overlay",
          }}
        />
        {children}
      </div>
    </motion.div>
  );
}

/* ─── Feature Card ───────────────────────────────────────────────────────── */
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1], delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300"
      style={{
        ...GLASS.feature,
        border: hovered
          ? "1px solid rgba(100, 106, 118, 0.5)"
          : GLASS.feature.border,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? `inset 0 1px 0 rgba(120,128,144,0.14), 0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(100,106,118,0.1)`
          : GLASS.feature.boxShadow,
      }}
    >
      {/* Icon container — uses band-3 as background */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{
          background: ACCENT.iconBg,
          border: `1px solid ${ACCENT.iconBorder}`,
        }}
      >
        <Icon size={17} style={{ color: ACCENT.icon }} />
      </div>
      <div>
        <h3
          className="text-sm font-semibold mb-1.5"
          style={{ color: "hsl(0 0% 90%)", letterSpacing: "-0.01em" }}
        >
          {title}
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: "hsl(0 0% 44%)" }}>
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Stat Item ──────────────────────────────────────────────────────────── */
function StatItem({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="flex flex-col items-center gap-2"
    >
      {/* Monospace number — Space Mono + contour glow */}
      <span
        style={{
          fontFamily: "var(--app-font-mono)",
          fontSize: "clamp(1.5rem, 4vw, 2rem)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "hsl(0 0% 95%)",
          textShadow: `0 0 28px rgba(100, 106, 118, 0.45)`,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      {/* Label in band-5 color */}
      <span
        style={{
          color: B[4],
          fontSize: "10px",
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontFamily: "var(--app-font-mono)",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ─── Command Line ───────────────────────────────────────────────────────── */
function CommandLine({
  prefix,
  command,
  description,
  delay = 0,
}: {
  prefix: string;
  command: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.38, delay }}
      className="flex items-center gap-3 py-3 border-b last:border-b-0"
      style={{ borderColor: "rgba(56, 59, 67, 0.6)" }}
    >
      <span
        style={{
          fontFamily: "var(--app-font-mono)",
          fontSize: "11px",
          padding: "2px 8px",
          borderRadius: "4px",
          background: ACCENT.pillBg,
          color: B[5],
          border: `1px solid ${ACCENT.pillBorder}`,
          minWidth: "28px",
          textAlign: "center" as const,
        }}
      >
        {prefix}
      </span>
      <span
        style={{
          fontFamily: "var(--app-font-mono)",
          fontSize: "13px",
          fontWeight: 400,
          color: "hsl(0 0% 86%)",
          letterSpacing: "-0.01em",
        }}
      >
        {command}
      </span>
      <span
        className="ml-auto text-xs hidden sm:block"
        style={{ color: B[4], fontFamily: "var(--app-font-mono)", fontSize: "10px" }}
      >
        — {description}
      </span>
    </motion.div>
  );
}

/* ─── Nav ────────────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 transition-all duration-400"
      style={{
        background: scrolled ? "rgba(8, 8, 10, 0.84)" : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(1.3)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px) saturate(1.3)" : "none",
        borderBottom: scrolled ? `1px solid rgba(76, 81, 92, 0.28)` : "none",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <img
          src={logoUrl}
          alt="Cybork"
          className="w-8 h-8 rounded-lg object-contain"
          style={{ mixBlendMode: "screen" }}
        />
        <span
          style={{
            fontWeight: 700,
            fontSize: "13px",
            letterSpacing: "0.16em",
            color: "hsl(0 0% 88%)",
            fontFamily: "var(--app-font-sans)",
          }}
        >
          CYBORK
        </span>
      </div>

      {/* Links */}
      <div className="hidden md:flex items-center gap-8">
        {["Features", "Commands", "Stats"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="transition-colors duration-150"
            style={{
              color: B[5],
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(0 0% 92%)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = B[5])}
          >
            {item}
          </a>
        ))}
      </div>

      {/* CTA */}
      <a
        href={DISCORD_INVITE}
        data-testid="nav-invite-button"
        className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 active:scale-95"
        style={{
          background: "rgba(100, 106, 118, 0.15)",
          border: "1px solid rgba(100, 106, 118, 0.35)",
          color: "hsl(0 0% 88%)",
          fontSize: "12px",
          fontWeight: 600,
          backdropFilter: "blur(10px)",
          letterSpacing: "0.02em",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(100,106,118,0.26)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(100,106,118,0.55)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "rgba(100,106,118,0.15)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(100,106,118,0.35)";
        }}
      >
        <SiDiscord size={13} />
        Add to Discord
      </a>
    </motion.nav>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 overflow-hidden">
      <CardStack className="w-full max-w-lg mt-8">
        <div className="px-10 py-12 text-center">

          {/* Coordinate badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-8"
            style={{
              background: ACCENT.badgeBg,
              border: `1px solid ${ACCENT.badgeBorder}`,
              backdropFilter: "blur(10px)",
            }}
          >
            <span style={{ color: B[5], display: "flex" }}>
              <Zap size={10} />
            </span>
            <span
              style={{
                color: B[5],
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                fontFamily: "var(--app-font-mono)",
                textTransform: "uppercase",
              }}
            >
              Live on 1,200+ servers
            </span>
          </motion.div>

          {/* Logo wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <img
              src={logoUrl}
              alt="Cybork"
              className="w-14 h-14 object-contain"
              style={{ mixBlendMode: "screen" }}
            />
            <span
              style={{
                fontSize: "clamp(1.6rem, 6vw, 2rem)",
                fontWeight: 700,
                letterSpacing: "0.16em",
                color: "hsl(0 0% 95%)",
                fontFamily: "var(--app-font-sans)",
              }}
            >
              CYBORK
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            style={{
              fontSize: "clamp(1.3rem, 5vw, 1.7rem)",
              fontWeight: 600,
              color: "hsl(0 0% 92%)",
              letterSpacing: "-0.025em",
              lineHeight: 1.25,
              marginBottom: "12px",
            }}
          >
            Your server, upgraded.
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="px-2 mb-9"
            style={{
              fontSize: "14px",
              lineHeight: 1.7,
              color: B[4],
              fontWeight: 400,
            }}
          >
            Cybork is the all-in-one Discord bot built for communities
            that demand more — moderation, music, leveling, and beyond.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <a
              href={DISCORD_INVITE}
              data-testid="hero-invite-button"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-92 active:scale-[0.98]"
              style={{
                background: "hsl(0 0% 91%)",
                color: "hsl(0 0% 6%)",
                letterSpacing: "0.01em",
              }}
            >
              <SiDiscord size={15} />
              Add to Discord
            </a>
            <a
              href="#features"
              data-testid="hero-features-link"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm transition-all duration-200"
              style={{
                background: "rgba(36, 38, 44, 0.7)",
                border: `1px solid rgba(76, 81, 92, 0.45)`,
                color: B[5],
                fontWeight: 500,
                backdropFilter: "blur(10px)",
                letterSpacing: "0.02em",
              }}
            >
              Explore features
              <ArrowRight size={14} />
            </a>
          </motion.div>

          {/* Contour coordinates — decorative */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{
              marginTop: "32px",
              color: B[3],
              fontSize: "9px",
              fontFamily: "var(--app-font-mono)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            ELEV · 00.00 · SECTOR 7 · GRID REF CYB-001
          </motion.p>
        </div>
      </CardStack>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="absolute bottom-8 flex flex-col items-center gap-1.5"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown size={16} style={{ color: B[3] }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Features ───────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Shield,
    title: "Smart Moderation",
    description:
      "Auto-mod, warning system, timed bans, and raid protection. Keep your community safe without lifting a finger.",
  },
  {
    icon: Music,
    title: "Crystal-Clear Music",
    description:
      "Stream from Spotify, YouTube, and SoundCloud. Queue management, lyrics, and 24/7 mode included.",
  },
  {
    icon: Trophy,
    title: "Leveling & XP",
    description:
      "Reward active members with an XP system, rank cards, role rewards, and leaderboards.",
  },
  {
    icon: BarChart3,
    title: "Server Analytics",
    description:
      "Visualize growth trends, message activity, and member engagement with beautiful in-chat charts.",
  },
  {
    icon: Globe,
    title: "Economy System",
    description:
      "Virtual currency, shops, gambling mini-games, and a global economy your members will love.",
  },
  {
    icon: MessageSquare,
    title: "Ticket System",
    description:
      "Professional support ticket management with transcripts, categories, and staff assignment.",
  },
];

function Features() {
  return (
    <section id="features" className="relative px-4 py-28">
      <div className="max-w-3xl mx-auto">
        {/* Section label */}
        <ContourLabel>Capabilities</ContourLabel>

        {/* Section header card */}
        <CardStack className="mb-10">
          <div className="px-8 py-8 text-center">
            <h2
              style={{
                fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
                fontWeight: 700,
                color: "hsl(0 0% 92%)",
                letterSpacing: "-0.02em",
                marginBottom: "8px",
              }}
            >
              Everything your server needs
            </h2>
            <p style={{ color: B[4], fontSize: "13px", lineHeight: 1.65 }}>
              One bot. Dozens of features. No bloat.
            </p>
          </div>
        </CardStack>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Commands ───────────────────────────────────────────────────────────── */
const COMMANDS = [
  { prefix: "/", command: "ban @user [reason]",  description: "Permanently ban a member" },
  { prefix: "/", command: "warn @user [reason]", description: "Issue a formal warning" },
  { prefix: "/", command: "play [song/url]",     description: "Stream audio in voice" },
  { prefix: "/", command: "queue",               description: "View the playback queue" },
  { prefix: "/", command: "rank [@user]",        description: "Display rank card" },
  { prefix: "/", command: "leaderboard",         description: "Top members by XP" },
  { prefix: "/", command: "balance [@user]",     description: "Check coin balance" },
  { prefix: "/", command: "ticket create",       description: "Open a support ticket" },
];

function Commands() {
  return (
    <section id="commands" className="relative px-4 py-28">
      <div className="max-w-2xl mx-auto">
        <ContourLabel>Command Interface</ContourLabel>
        <CardStack>
          <div className="px-8 py-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-7">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: ACCENT.iconBg,
                  border: `1px solid ${ACCENT.iconBorder}`,
                }}
              >
                <Terminal size={15} style={{ color: ACCENT.icon }} />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "hsl(0 0% 90%)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Commands
                </h2>
                <p style={{ fontSize: "11px", color: B[4], fontFamily: "var(--app-font-mono)" }}>
                  slash · always up to date
                </p>
              </div>
            </div>

            {/* Terminal inset panel */}
            <div
              className="rounded-xl p-1"
              style={{
                background: "rgba(6, 6, 8, 0.7)",
                border: `1px solid rgba(36, 38, 44, 0.8)`,
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              <div className="px-4 py-1">
                {COMMANDS.map((cmd, i) => (
                  <CommandLine key={cmd.command} {...cmd} delay={i * 0.05} />
                ))}
              </div>
            </div>

            {/* Footer note */}
            <p
              className="text-center mt-5"
              style={{ color: B[3], fontSize: "11px", fontFamily: "var(--app-font-mono)" }}
            >
              + 80 more commands — run{" "}
              <span
                style={{
                  padding: "1px 7px",
                  borderRadius: "4px",
                  background: "rgba(36,38,44,0.8)",
                  color: B[5],
                  border: `1px solid rgba(76,81,92,0.4)`,
                }}
              >
                /help
              </span>{" "}
              in your server
            </p>
          </div>
        </CardStack>
      </div>
    </section>
  );
}

/* ─── Stats ──────────────────────────────────────────────────────────────── */
function Stats() {
  return (
    <section id="stats" className="relative px-4 py-28">
      <div className="max-w-2xl mx-auto">
        <ContourLabel>Survey Data</ContourLabel>
        <CardStack>
          <div className="px-8 py-10">
            {/* Header */}
            <div className="text-center mb-12">
              <h2
                style={{
                  fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
                  fontWeight: 700,
                  color: "hsl(0 0% 92%)",
                  letterSpacing: "-0.02em",
                  marginBottom: "8px",
                }}
              >
                Trusted by communities worldwide
              </h2>
              <p style={{ color: B[4], fontSize: "13px" }}>
                Numbers don't lie.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              <StatItem value="1.2K+" label="Servers"         delay={0} />
              <StatItem value="48K+"  label="Members"         delay={0.08} />
              <StatItem value="2.1M+" label="Commands run"    delay={0.16} />
              <StatItem value="99.9%" label="Uptime"          delay={0.24} />
            </div>

            {/* Contour divider */}
            <div
              className="my-9"
              style={{
                height: "1px",
                background: `linear-gradient(to right, transparent, rgba(76,81,92,0.5) 20%, rgba(100,106,118,0.35) 50%, rgba(76,81,92,0.5) 80%, transparent)`,
              }}
            />

            {/* Trust marks */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {[
                { icon: Star,  label: "5-star rated" },
                { icon: Zap,   label: "< 50ms latency" },
                { icon: Users, label: "Active community" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={12} style={{ color: B[5] }} />
                  <span
                    style={{
                      color: B[4],
                      fontSize: "11px",
                      fontFamily: "var(--app-font-mono)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardStack>
      </div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────────────────────── */
const PLAN_FEATURES = [
  "Unlimited moderation actions",
  "Music streaming & queue",
  "XP leveling & rank cards",
  "Economy & virtual currency",
  "Support ticket system",
  "24/7 uptime guarantee",
];

function CTA() {
  return (
    <section className="relative px-4 py-28 pb-36">
      <div className="max-w-lg mx-auto">
        <ContourLabel>Deploy</ContourLabel>
        <CardStack>
          <div className="px-10 py-12 text-center">
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.82 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-7"
              style={{
                background: ACCENT.iconBg,
                border: `1px solid ${ACCENT.iconBorder}`,
              }}
            >
              <SiDiscord size={22} style={{ color: ACCENT.icon }} />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 }}
              style={{
                fontSize: "clamp(1.1rem, 4vw, 1.35rem)",
                fontWeight: 700,
                color: "hsl(0 0% 92%)",
                letterSpacing: "-0.02em",
                marginBottom: "8px",
              }}
            >
              Ready to power up your server?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.13 }}
              className="mb-8"
              style={{ color: B[4], fontSize: "13px", lineHeight: 1.7 }}
            >
              Add Cybork for free. No credit card required.
              All features included from day one.
            </motion.p>

            {/* Feature checklist */}
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="flex flex-col gap-2.5 mb-9 text-left"
            >
              {PLAN_FEATURES.map((feat, i) => (
                <motion.li
                  key={feat}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.05 }}
                  className="flex items-center gap-2.5"
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: ACCENT.checkBg,
                      border: `1px solid ${ACCENT.checkBorder}`,
                    }}
                  >
                    <Check size={9} style={{ color: B[5] }} />
                  </div>
                  <span style={{ color: B[5], fontSize: "12px" }}>{feat}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* CTA Button */}
            <motion.a
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              href={DISCORD_INVITE}
              data-testid="cta-invite-button"
              className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "hsl(0 0% 91%)",
                color: "hsl(0 0% 6%)",
                letterSpacing: "0.01em",
              }}
            >
              <SiDiscord size={16} />
              Add Cybork to Discord — Free
            </motion.a>

            <p
              className="mt-4"
              style={{ color: B[3], fontSize: "11px", fontFamily: "var(--app-font-mono)" }}
            >
              Takes 10 seconds.{" "}
              <a
                href="#"
                className="underline transition-colors"
                style={{ color: B[4] }}
                onMouseEnter={(e) => (e.currentTarget.style.color = B[5])}
                onMouseLeave={(e) => (e.currentTarget.style.color = B[4])}
              >
                Privacy policy
              </a>
            </p>
          </div>
        </CardStack>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      className="px-6 py-8"
      style={{
        borderTop: `1px solid rgba(36, 38, 44, 0.8)`,
        background: "rgba(6, 6, 8, 0.9)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <img
            src={logoUrl}
            alt="Cybork"
            className="w-5 h-5 object-contain"
            style={{ mixBlendMode: "screen", opacity: 0.55 }}
          />
          <span
            style={{
              color: B[3],
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              fontFamily: "var(--app-font-sans)",
            }}
          >
            CYBORK
          </span>
        </div>

        <p style={{ color: B[2], fontSize: "10px", fontFamily: "var(--app-font-mono)" }}>
          Not affiliated with Discord Inc.
        </p>

        <div className="flex gap-5">
          {["Terms", "Privacy", "Support"].map((item) => (
            <a
              key={item}
              href="#"
              style={{ color: B[3], fontSize: "11px", transition: "color 150ms" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = B[5])}
              onMouseLeave={(e) => (e.currentTarget.style.color = B[3])}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function Landing() {
  return (
    <div className="relative min-h-screen" style={{ background: "rgb(8, 8, 10)" }}>
      <NoiseBackground />
      <div className="relative" style={{ zIndex: 1 }}>
        <Nav />
        <Hero />
        <Features />
        <Commands />
        <Stats />
        <CTA />
        <Footer />
      </div>
    </div>
  );
}
