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
  Bot,
} from "lucide-react";
import { SiDiscord } from "react-icons/si";
import { FireBackground } from "@/components/FireBackground";

const DISCORD_INVITE = "https://discord.com/oauth2/authorize";

/* ─── Accent palette ─────────────────────────────────────────────────────── */
const ACCENT = {
  iconBg:     "rgba(255, 255, 255, 0.07)",
  iconBorder: "rgba(255, 255, 255, 0.13)",
  badgeBg:    "rgba(255, 255, 255, 0.06)",
  badgeBorder:"rgba(255, 255, 255, 0.11)",
  checkBg:    "rgba(255, 255, 255, 0.08)",
  checkBorder:"rgba(255, 255, 255, 0.14)",
  pillBg:     "rgba(255, 255, 255, 0.06)",
  pillBorder: "rgba(255, 255, 255, 0.10)",
  icon:       "hsl(0 0% 78%)",   /* icon color */
  label:      "hsl(0 0% 52%)",   /* section labels */
  badge:      "hsl(0 0% 60%)",   /* badge text */
  prefix:     "hsl(0 0% 58%)",   /* /command prefix */
};

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
      initial={animate ? { opacity: 0, y: 24 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : false}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${className}`}
    >
      {/* Back card — rotated left */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: "hsl(30 4% 11%)",
          border: "1px solid rgba(255,255,255,0.055)",
          transform: "rotate(-2.6deg) translateY(5px) scale(0.968)",
          zIndex: 0,
        }}
      />
      {/* Middle card — rotated right */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: "hsl(30 4% 11%)",
          border: "1px solid rgba(255,255,255,0.07)",
          transform: "rotate(1.9deg) translateY(3px) scale(0.984)",
          zIndex: 1,
        }}
      />
      {/* Front card */}
      <div
        className="relative rounded-2xl"
        style={{
          background: "hsl(30 4% 11%)",
          border: "1px solid rgba(255,255,255,0.085)",
          zIndex: 2,
        }}
      >
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
      className="rounded-2xl p-6 flex flex-col gap-4 hover-elevate transition-all duration-200"
      style={{
        background: "hsl(30 4% 11%)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{
          background: ACCENT.iconBg,
          border: `1px solid ${ACCENT.iconBorder}`,
        }}
      >
        <Icon size={18} style={{ color: ACCENT.icon }} />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-1.5" style={{ color: "hsl(0 0% 92%)" }}>
          {title}
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: "hsl(0 0% 48%)" }}>
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
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col items-center gap-1"
    >
      <span className="text-3xl font-bold tracking-tight" style={{ color: "hsl(0 0% 94%)" }}>
        {value}
      </span>
      <span className="text-xs" style={{ color: "hsl(0 0% 46%)" }}>
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
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-3 py-3 border-b last:border-b-0"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <span
        className="font-mono text-xs px-2 py-0.5 rounded"
        style={{
          background: ACCENT.pillBg,
          color: ACCENT.prefix,
          border: `1px solid ${ACCENT.pillBorder}`,
          minWidth: "28px",
          textAlign: "center",
        }}
      >
        {prefix}
      </span>
      <span className="font-mono text-sm font-medium" style={{ color: "hsl(0 0% 85%)" }}>
        {command}
      </span>
      <span className="ml-auto text-xs hidden sm:block" style={{ color: "hsl(0 0% 38%)" }}>
        {description}
      </span>
    </motion.div>
  );
}

/* ─── Nav ────────────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(18, 16, 14, 0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: ACCENT.iconBg,
            border: `1px solid ${ACCENT.iconBorder}`,
          }}
        >
          <Bot size={15} style={{ color: ACCENT.icon }} />
        </div>
        <span className="font-semibold text-sm tracking-wide" style={{ color: "hsl(0 0% 90%)" }}>
          CYBORK
        </span>
      </div>

      {/* Links */}
      <div className="hidden md:flex items-center gap-7">
        {["Features", "Commands", "Stats"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-xs font-medium transition-colors duration-150 hover:text-white"
            style={{ color: "hsl(0 0% 48%)" }}
          >
            {item}
          </a>
        ))}
      </div>

      {/* CTA */}
      <a
        href={DISCORD_INVITE}
        data-testid="nav-invite-button"
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
        style={{
          background: "hsl(0 0% 90%)",
          color: "hsl(0 0% 8%)",
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
      {/* Ambient glow — very subtle cool-neutral at top */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 42% at 50% 0%, rgba(210, 215, 230, 0.07) 0%, transparent 100%)",
        }}
      />

      <CardStack className="w-full max-w-lg mt-8">
        <div className="px-10 py-12 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-8"
            style={{
              background: ACCENT.badgeBg,
              border: `1px solid ${ACCENT.badgeBorder}`,
              color: ACCENT.badge,
            }}
          >
            <Zap size={11} />
            Now live on 1,200+ servers
          </motion.div>

          {/* Logo wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center justify-center gap-3 mb-7"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: ACCENT.iconBg,
                border: `1px solid ${ACCENT.iconBorder}`,
              }}
            >
              <Bot size={20} style={{ color: ACCENT.icon }} />
            </div>
            <span
              className="text-3xl font-bold"
              style={{ color: "hsl(0 0% 94%)", letterSpacing: "0.14em" }}
            >
              CYBORK
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="text-2xl font-semibold mb-3 leading-snug"
            style={{ color: "hsl(0 0% 93%)" }}
          >
            Your server, upgraded.
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="text-sm leading-relaxed mb-9 px-2"
            style={{ color: "hsl(0 0% 50%)" }}
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
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{
                background: "hsl(0 0% 90%)",
                color: "hsl(0 0% 7%)",
              }}
            >
              <SiDiscord size={15} />
              Add to Discord
            </a>
            <a
              href="#features"
              data-testid="hero-features-link"
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "hsl(0 0% 65%)",
              }}
            >
              Explore features
              <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </CardStack>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown size={18} style={{ color: "hsl(0 0% 28%)" }} />
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
    <section id="features" className="relative px-4 py-24">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <CardStack className="mb-12">
          <div className="px-8 py-8 text-center">
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: ACCENT.label }}
            >
              Capabilities
            </p>
            <h2 className="text-xl font-semibold" style={{ color: "hsl(0 0% 92%)" }}>
              Everything your server needs
            </h2>
            <p
              className="text-sm mt-2 max-w-sm mx-auto leading-relaxed"
              style={{ color: "hsl(0 0% 48%)" }}
            >
              One bot. Dozens of features. No bloat.
            </p>
          </div>
        </CardStack>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
  { prefix: "/", command: "ban @user [reason]",   description: "Permanently ban a member" },
  { prefix: "/", command: "warn @user [reason]",  description: "Issue a formal warning" },
  { prefix: "/", command: "play [song/url]",      description: "Stream audio in voice" },
  { prefix: "/", command: "queue",                description: "View the playback queue" },
  { prefix: "/", command: "rank [@user]",         description: "Display rank card" },
  { prefix: "/", command: "leaderboard",          description: "Top members by XP" },
  { prefix: "/", command: "balance [@user]",      description: "Check coin balance" },
  { prefix: "/", command: "ticket create",        description: "Open a support ticket" },
];

function Commands() {
  return (
    <section id="commands" className="relative px-4 py-24">
      <div className="max-w-2xl mx-auto">
        <CardStack>
          <div className="px-8 py-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: ACCENT.iconBg,
                  border: `1px solid ${ACCENT.iconBorder}`,
                }}
              >
                <Terminal size={16} style={{ color: ACCENT.icon }} />
              </div>
              <div>
                <h2 className="text-base font-semibold" style={{ color: "hsl(0 0% 92%)" }}>
                  Commands
                </h2>
                <p className="text-xs" style={{ color: "hsl(0 0% 44%)" }}>
                  Slash commands, always up to date
                </p>
              </div>
            </div>

            {/* Command list */}
            <div>
              {COMMANDS.map((cmd, i) => (
                <CommandLine key={cmd.command} {...cmd} delay={i * 0.05} />
              ))}
            </div>

            {/* Footer note */}
            <p className="text-xs mt-5 text-center" style={{ color: "hsl(0 0% 33%)" }}>
              + 80 more commands — use{" "}
              <span
                className="font-mono px-1.5 py-0.5 rounded"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "hsl(0 0% 58%)",
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
    <section id="stats" className="relative px-4 py-24">
      <div className="max-w-2xl mx-auto">
        <CardStack>
          <div className="px-8 py-10">
            {/* Header */}
            <div className="text-center mb-10">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: ACCENT.label }}
              >
                By the numbers
              </p>
              <h2 className="text-xl font-semibold" style={{ color: "hsl(0 0% 92%)" }}>
                Trusted by communities worldwide
              </h2>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              <StatItem value="1.2K+" label="Servers"         delay={0} />
              <StatItem value="48K+"  label="Members reached" delay={0.07} />
              <StatItem value="2.1M+" label="Commands run"    delay={0.14} />
              <StatItem value="99.9%" label="Uptime"          delay={0.21} />
            </div>

            {/* Divider */}
            <div className="my-8" style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

            {/* Trust marks */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {[
                { icon: Star,  label: "5-star rated" },
                { icon: Zap,   label: "< 50ms latency" },
                { icon: Users, label: "Active community" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon size={13} style={{ color: ACCENT.icon }} />
                  <span className="text-xs" style={{ color: "hsl(0 0% 48%)" }}>
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
    <section className="relative px-4 py-24 pb-32">
      {/* Subtle cool glow at bottom */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 50% 100%, rgba(210, 215, 230, 0.05) 0%, transparent 100%)",
        }}
      />

      <div className="max-w-lg mx-auto">
        <CardStack>
          <div className="px-10 py-12 text-center">
            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-7"
              style={{
                background: ACCENT.iconBg,
                border: `1px solid ${ACCENT.iconBorder}`,
              }}
            >
              <SiDiscord size={24} style={{ color: ACCENT.icon }} />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="text-xl font-semibold mb-2"
              style={{ color: "hsl(0 0% 93%)" }}
            >
              Ready to power up your server?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.13 }}
              className="text-sm mb-8 leading-relaxed"
              style={{ color: "hsl(0 0% 48%)" }}
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
                    <Check size={9} style={{ color: ACCENT.icon }} />
                  </div>
                  <span className="text-xs" style={{ color: "hsl(0 0% 62%)" }}>
                    {feat}
                  </span>
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
                background: "hsl(0 0% 90%)",
                color: "hsl(0 0% 7%)",
              }}
            >
              <SiDiscord size={16} />
              Add Cybork to Discord — Free
            </motion.a>

            <p className="text-xs mt-4" style={{ color: "hsl(0 0% 28%)" }}>
              Takes 10 seconds.{" "}
              <a
                href="#"
                className="underline transition-colors hover:text-white"
                style={{ color: "hsl(0 0% 38%)" }}
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
      className="border-t px-6 py-8"
      style={{
        borderColor: "rgba(255,255,255,0.06)",
        background: "hsl(30 5% 6%)",
      }}
    >
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bot size={14} style={{ color: ACCENT.icon, opacity: 0.6 }} />
          <span
            className="text-xs font-semibold tracking-widest"
            style={{ color: "hsl(0 0% 35%)" }}
          >
            CYBORK
          </span>
        </div>
        <p className="text-xs" style={{ color: "hsl(0 0% 26%)" }}>
          Not affiliated with Discord Inc.
        </p>
        <div className="flex gap-5">
          {["Terms", "Privacy", "Support"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs transition-colors hover:text-white"
              style={{ color: "hsl(0 0% 33%)" }}
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
    <div className="relative min-h-screen" style={{ background: "hsl(30 5% 7%)" }}>
      <FireBackground opacity={0.44} />
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
