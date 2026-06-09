import { useState, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
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

const B = {
  5: "rgb(100, 106, 118)",
  4: "rgb(76,  81,  92)",
  3: "rgb(56,  59,  67)",
  2: "rgb(36,  38,  44)",
  1: "rgb(20,  21,  24)",
} as const;

const ACCENT = {
  iconBg:      "rgba(56, 59, 67, 0.55)",
  iconBorder:  "rgba(100, 106, 118, 0.32)",
  badgeBg:     "rgba(0, 0, 0, 0.55)",
  badgeBorder: "rgba(255, 255, 255, 0.14)",
  checkBg:     "rgba(56, 59, 67, 0.5)",
  checkBorder: "rgba(100, 106, 118, 0.35)",
  pillBg:      "rgba(36, 38, 44, 0.8)",
  pillBorder:  "rgba(76, 81, 92, 0.4)",
  icon:        B[5],
  label:       B[5],
  badge:       "rgba(255,255,255,0.75)",
  prefix:      B[5],
  phosphor:    "rgba(127, 255, 127, 0.6)",
};

const HUDCard = ({
  children,
  className = "",
  animate = true,
  style = {},
  hoverable = false,
}: {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  style?: React.CSSProperties;
  hoverable?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const baseStyle = {
    background: "rgba(15, 17, 20, 0.85)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
    ...style,
  };

  if (hoverable) {
    baseStyle.border = hovered ? "1px solid rgba(255, 255, 255, 0.15)" : baseStyle.border;
    baseStyle.transform = hovered ? "translateY(-2px)" : "translateY(0)";
  }

  const Bracket = ({ top, bottom, left, right }: any) => (
    <span
      className="absolute block pointer-events-none"
      style={{
        width: "8px",
        height: "8px",
        top, bottom, left, right,
        borderTop: top !== undefined ? "1px solid rgba(255,255,255,0.18)" : "none",
        borderBottom: bottom !== undefined ? "1px solid rgba(255,255,255,0.18)" : "none",
        borderLeft: left !== undefined ? "1px solid rgba(255,255,255,0.18)" : "none",
        borderRight: right !== undefined ? "1px solid rgba(255,255,255,0.18)" : "none",
      }}
    />
  );

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 28 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : false}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative rounded-none overflow-hidden transition-all duration-300 ${className}`}
      style={baseStyle}
    >
      <div className="scan-lines absolute inset-0 z-0" />
      <Bracket top="4px" left="4px" />
      <Bracket top="4px" right="4px" />
      <Bracket bottom="4px" left="4px" />
      <Bracket bottom="4px" right="4px" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

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
  return (
    <HUDCard
      animate
      hoverable
      className="p-6 flex flex-col gap-4"
      style={{
        background: "rgba(12, 12, 14, 0.75)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div
        className="w-10 h-10 flex items-center justify-center"
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
    </HUDCard>
  );
}

function StatItem({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      className="flex flex-col items-center gap-2 relative"
    >
      <span
        style={{
          fontFamily: "var(--app-font-mono)",
          fontSize: "clamp(1.5rem, 4vw, 2rem)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "hsl(0 0% 95%)",
          textShadow: `0 0 12px ${ACCENT.phosphor}`,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
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
          background: ACCENT.pillBg,
          color: B[5],
          border: `1px solid ${ACCENT.pillBorder}`,
          minWidth: "28px",
          textAlign: "center",
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

const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Commands", href: "#commands" },
  { label: "Stats",    href: "#stats"    },
];

function CardNavItem({ label, href }: { label: string; href: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      data-testid={`nav-${label.toLowerCase()}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative px-3 py-1.5 transition-all duration-200 select-none"
      style={{
        fontFamily: "var(--app-font-sans)",
        fontSize: "12px",
        fontWeight: 500,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: hovered ? "hsl(0 0% 96%)" : B[5],
        textDecoration: "none",
      }}
    >
      {/* per-item card background — slides in on hover */}
      <motion.span
        className="absolute inset-0 pointer-events-none"
        initial={false}
        animate={{
          opacity: hovered ? 1 : 0,
          scale: hovered ? 1 : 0.88,
        }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "rgba(100, 106, 118, 0.12)",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: "4px",
        }}
      />
      <span className="relative z-10">{label}</span>
    </a>
  );
}

function Nav() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let prev = window.scrollY;
    const onScroll = () => {
      const curr = window.scrollY;
      setVisible(curr < 80 || curr < prev);
      prev = curr;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -8 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      {/* ── Outer scan-line card shell ── */}
      <div
        className="relative flex items-center gap-1 px-2 py-2"
        style={{
          background: "rgba(10, 11, 14, 0.82)",
          backdropFilter: "blur(20px) saturate(1.4)",
          WebkitBackdropFilter: "blur(20px) saturate(1.4)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "10px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)",
          /* subtle scan-line overlay */
          backgroundImage:
            "linear-gradient(rgba(10,11,14,0.82) 0%, rgba(10,11,14,0.82) 100%), repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.04) 1px, rgba(0,0,0,0.04) 2px)",
        }}
      >
        {/* Corner brackets — HUD targeting marks */}
        {[
          { top: "3px",  left:  "3px",  borderTop: "1px solid rgba(255,255,255,0.18)", borderLeft:  "1px solid rgba(255,255,255,0.18)" },
          { top: "3px",  right: "3px",  borderTop: "1px solid rgba(255,255,255,0.18)", borderRight: "1px solid rgba(255,255,255,0.18)" },
          { bottom:"3px",left:  "3px",  borderBottom:"1px solid rgba(255,255,255,0.18)",borderLeft:  "1px solid rgba(255,255,255,0.18)" },
          { bottom:"3px",right: "3px",  borderBottom:"1px solid rgba(255,255,255,0.18)",borderRight: "1px solid rgba(255,255,255,0.18)" },
        ].map((s, i) => (
          <span
            key={i}
            className="absolute pointer-events-none"
            style={{ width: "7px", height: "7px", ...s }}
          />
        ))}

        {/* ── Logo + wordmark ── */}
        <div className="flex items-center gap-2 pl-2 pr-3 mr-1" style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}>
          <img
            src={logoUrl}
            alt="Cybork"
            className="w-6 h-6 object-contain"
            style={{ mixBlendMode: "screen" }}
          />
          <span
            style={{
              fontFamily: "var(--app-font-sans)",
              fontWeight: 700,
              fontSize: "12px",
              letterSpacing: "0.18em",
              color: "hsl(0 0% 90%)",
              whiteSpace: "nowrap",
            }}
          >
            CYBORK
          </span>
        </div>

        {/* ── Nav items ── */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => (
            <CardNavItem key={item.label} label={item.label} href={item.href} />
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="hidden md:block mx-2 self-stretch" style={{ width: "1px", background: "rgba(255,255,255,0.07)" }} />

        {/* ── CTA ── */}
        <a
          href={DISCORD_INVITE}
          data-testid="nav-invite-button"
          className="group flex items-center gap-1.5 px-3 py-1.5 transition-all duration-250 active:scale-95 select-none"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.11)",
            borderRadius: "6px",
            color: "hsl(0 0% 92%)",
            fontSize: "11px",
            fontFamily: "var(--app-font-sans)",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            textDecoration: "none",
            transition: "box-shadow 0.25s, border-color 0.25s, background 0.25s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.boxShadow = "0 0 18px rgba(200,160,60,0.35), 0 0 6px rgba(200,160,60,0.2)";
            el.style.borderColor = "rgba(200,160,60,0.5)";
            el.style.background = "rgba(255,255,255,0.09)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.boxShadow = "none";
            el.style.borderColor = "rgba(255,255,255,0.11)";
            el.style.background = "rgba(255,255,255,0.06)";
          }}
        >
          <SiDiscord size={12} />
          Add to Discord
        </a>
      </div>
    </motion.div>
  );
}

function AnimatedCoordinates() {
  const [elev, setElev] = useState(410);
  const [sector, setSector] = useState(7);
  
  useEffect(() => {
    const elevInterval = setInterval(() => {
      setElev(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 800);
    
    const sectorInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setSector(prev => (prev === 7 ? 8 : 7));
      }
    }, 1500);

    return () => {
      clearInterval(elevInterval);
      clearInterval(sectorInterval);
    };
  }, []);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ delay: 0.9, duration: 0.6 }}
      style={{
        marginTop: "32px",
        color: "hsl(0 0% 90%)",
        fontSize: "10px",
        fontFamily: "var(--app-font-mono)",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
      }}
    >
      ELEV · {elev.toString().padStart(4, '0')} · SECTOR {sector} · GRID REF CYB-001
    </motion.p>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 overflow-hidden">
      <HUDCard className="w-full max-w-lg mt-8 text-center p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-8"
          style={{
            background: ACCENT.badgeBg,
            border: ACCENT.badgeBorder,
            backdropFilter: "blur(10px)",
          }}
        >
          <span style={{ color: ACCENT.phosphor, display: "flex", textShadow: `0 0 8px ${ACCENT.phosphor}` }}>
            <Zap size={10} />
          </span>
          <span
            style={{
              color: ACCENT.badge,
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

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          style={{
            fontSize: "clamp(2rem, 6vw, 3rem)",
            fontWeight: 700,
            color: "hsl(0 0% 95%)",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: "16px",
            fontFamily: "var(--app-font-sans)",
          }}
        >
          Your server, upgraded.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="px-2 mb-9"
          style={{
            fontSize: "15px",
            lineHeight: 1.7,
            color: B[4],
            fontWeight: 400,
          }}
        >
          Cybork is the all-in-one Discord bot built for communities
          that demand more — moderation, music, leveling, and beyond.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.34 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href={DISCORD_INVITE}
            data-testid="hero-invite-button"
            className="group flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold transition-all duration-250 active:scale-[0.98]"
            style={{
              background: "hsl(0 0% 91%)",
              color: "hsl(0 0% 6%)",
              letterSpacing: "0.01em",
            }}
          >
            <SiDiscord size={15} />
            Add to Discord
            <style dangerouslySetInnerHTML={{__html: `
              a[data-testid="hero-invite-button"]:hover {
                box-shadow: 0 0 18px rgba(200, 160, 60, 0.35), 0 0 6px rgba(200,160,60,0.2);
                background: white;
              }
            `}} />
          </a>
          <a
            href="#features"
            data-testid="hero-features-link"
            className="flex items-center justify-center gap-2 px-6 py-3.5 text-sm transition-all duration-250"
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
            <style dangerouslySetInnerHTML={{__html: `
              a[data-testid="hero-features-link"]:hover {
                box-shadow: 0 0 14px rgba(80, 200, 100, 0.2);
                border-color: rgba(80, 200, 100, 0.4) !important;
                color: white !important;
              }
            `}} />
          </a>
        </motion.div>

        <AnimatedCoordinates />
      </HUDCard>

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
        <ContourLabel>Capabilities</ContourLabel>

        <HUDCard className="mb-10 text-center p-8">
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
        </HUDCard>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}

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
        <HUDCard className="p-8">
          <div className="flex items-center gap-3 mb-7">
            <div
              className="w-9 h-9 flex items-center justify-center"
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

          <div
            className="p-1"
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

          <p
            className="text-center mt-5"
            style={{ color: B[3], fontSize: "11px", fontFamily: "var(--app-font-mono)" }}
          >
            + 80 more commands — run{" "}
            <span
              style={{
                padding: "1px 7px",
                background: "rgba(36,38,44,0.8)",
                color: B[5],
                border: `1px solid rgba(76,81,92,0.4)`,
              }}
            >
              /help
            </span>{" "}
            in your server
          </p>
        </HUDCard>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section id="stats" className="relative px-4 py-28">
      <div className="max-w-2xl mx-auto">
        <ContourLabel>Survey Data</ContourLabel>
        <HUDCard className="px-8 py-10">
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <StatItem value="1.2K+" label="Servers"         delay={0} />
            <StatItem value="48K+"  label="Members"         delay={0.08} />
            <StatItem value="2.1M+" label="Commands run"    delay={0.16} />
            <StatItem value="99.9%" label="Uptime"          delay={0.24} />
          </div>

          <div
            className="my-9"
            style={{
              height: "1px",
              background: `linear-gradient(to right, transparent, rgba(76,81,92,0.5) 20%, rgba(100,106,118,0.35) 50%, rgba(76,81,92,0.5) 80%, transparent)`,
            }}
          />

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
        </HUDCard>
      </div>
    </section>
  );
}

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
        <HUDCard className="px-10 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex w-14 h-14 items-center justify-center mb-7"
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
                  className="w-4 h-4 flex items-center justify-center flex-shrink-0"
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

          <motion.a
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
            href={DISCORD_INVITE}
            data-testid="cta-invite-button"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 text-sm font-semibold transition-all duration-250 active:scale-[0.98]"
            style={{
              background: "hsl(0 0% 91%)",
              color: "hsl(0 0% 6%)",
              letterSpacing: "0.01em",
            }}
          >
            <SiDiscord size={16} />
            Add Cybork to Discord — Free
            <style dangerouslySetInnerHTML={{__html: `
              a[data-testid="cta-invite-button"]:hover {
                box-shadow: 0 0 18px rgba(200, 160, 60, 0.35), 0 0 6px rgba(200,160,60,0.2);
                background: white;
              }
            `}} />
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
        </HUDCard>
      </div>
    </section>
  );
}

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
