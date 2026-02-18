import { useState, useEffect, useRef } from "react";

// Design Tokens
const C = {
  bg: "#09090B",
  surface: "#131316",
  card: "#18181D",
  cardHover: "#1E1E24",
  border: "#27272E",
  borderLight: "#32323C",
  dim: "#52526B",
  muted: "#7E7E9A",
  body: "#A8A8C4",
  bright: "#D6D6ED",
  white: "#F0F0FF",
  red: "#E5383B",
  redSoft: "#E5383B18",
  redGlow: "#E5383B33",
  orange: "#F48C06",
  green: "#06D6A0",
  blue: "#4895EF",
  purple: "#9B5DE5",
  serif: "'Instrument Serif','Playfair Display',Georgia,serif",
  mono: "'IBM Plex Mono',Menlo,monospace",
  sans: "'DM Sans','Helvetica Neue',sans-serif",
};

// Live Activity Feed Data
const ACTIVITY_FEED = [
  { user: "shopper_k", action: "just logged", product: "Doritos Party Size", change: "−2oz, same price", tag: "Shrinkflation", icon: "🔥" },
  { user: "pissed_in_portland", action: "confirmed", product: "Netflix password share ban", change: "−4.2M subs abandoned it", tag: "Enshittification", icon: "😤" },
  { user: "r/shrinkflation mod", action: "verified", product: "Charmin Ultra", change: "−56 sheets per roll", tag: "Shrinkflation", icon: "📉" },
  { user: "data_nerd_99", action: "documented", product: "Google Search", change: "58% zero-click results now", tag: "Enshittification", icon: "🗑️" },
  { user: "grocery_watcher", action: "reported", product: "Tide 100oz", change: "now 80oz, same shelf price", tag: "Shrinkflation", icon: "🔥" },
  { user: "brand_forensics", action: "flagged", product: "Kellogg's Frosted Flakes", change: "24oz → 21.7oz, +40% per-oz", tag: "Shrinkflation", icon: "👀" },
  { user: "antienshittifier", action: "logged", product: "Reddit API change", change: "killed 3rd party apps overnight", tag: "Enshittification", icon: "💀" },
  { user: "receipts_only", action: "confirmed", product: "Lay's Family Size", change: "15.25oz → 13oz (−15%)", tag: "Shrinkflation", icon: "📉" },
  { user: "deal_watcher_miami", action: "reported", product: "Spotify Free tier", change: "+30 sec ads between songs", tag: "Enshittification", icon: "😤" },
  { user: "unit_price_hawk", action: "documented", product: "Reese's Party Pack", change: "40oz → 35.6oz, no price drop", tag: "Shrinkflation", icon: "🔥" },
];

// Community Quotes
const HOT_TAKES = [
  { quote: "I append 'reddit' to every Google search now. The real product got worse, not me.", user: "SearchRIP", votes: "4,102", product: "Google Search" },
  { quote: "Literally counted the Charmin sheets. 264 last year, 208 today. SAME PRICE. I have receipts.", user: "toilet_paper_archivist", votes: "8,841", product: "Charmin Ultra" },
  { quote: "The bag is the same size but somehow there are fewer chips. The physics of corporate greed.", user: "bagged_air_truther", votes: "6,230", product: "Lay's" },
  { quote: "Streaming used to be 'all your shows, no ads.' Now it's 'some shows, all the ads.' Full circle.", user: "cord_cutter_regret", votes: "3,917", product: "Netflix" },
];

// Utility Components
function useInterval(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// Live Activity Ticker
function ActivityTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useInterval(() => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(i => (i + 1) % ACTIVITY_FEED.length);
      setTransitioning(false);
    }, 300);
  }, 3200);

  const item = ACTIVITY_FEED[currentIndex];
  const tagColor = item.tag === "Shrinkflation" ? C.orange : C.red;

  return (
    <div style={{
      background: `linear-gradient(90deg, ${C.surface} 0%, #1A1A22 100%)`,
      borderTop: `1px solid ${C.border}`,
      borderBottom: `1px solid ${C.border}`,
      padding: "0",
      overflow: "hidden",
    }}>
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}>
        {/* Pulse dot */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 8, height: 8,
            borderRadius: "50%",
            background: C.red,
            animation: "pulse 2s infinite",
          }} />
        </div>
        <span style={{ color: C.dim, fontFamily: C.mono, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", flexShrink: 0 }}>
          Live
        </span>
        <div style={{
          flex: 1,
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(-4px)" : "translateY(0)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          minHeight: 22,
        }}>
          <span style={{ fontSize: 14 }}>{item.icon}</span>
          <span style={{ color: C.muted, fontFamily: C.sans, fontSize: 13 }}>
            <strong style={{ color: C.bright, fontWeight: 600 }}>@{item.user}</strong>
            {" "}{item.action}{" "}
            <strong style={{ color: C.white }}>{item.product}</strong>
            {" — "}
            <span style={{ color: tagColor }}>{item.change}</span>
          </span>
          <span style={{
            fontFamily: C.mono, fontSize: 10, letterSpacing: "0.06em",
            color: tagColor, background: `${tagColor}15`,
            border: `1px solid ${tagColor}30`,
            padding: "2px 8px", borderRadius: 4, flexShrink: 0
          }}>
            {item.tag}
          </span>
        </div>
        <span style={{ color: C.dim, fontFamily: C.mono, fontSize: 11, flexShrink: 0 }}>
          {ACTIVITY_FEED.length * 214 + currentIndex * 17 + 2847} on waitlist
        </span>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 ${C.red}60; }
          50% { box-shadow: 0 0 0 6px ${C.red}00; }
        }
      `}</style>
    </div>
  );
}

// Hot Take Card
function HotTakeCard({ index }) {
  const [currentTake, setCurrentTake] = useState(index % HOT_TAKES.length);
  const take = HOT_TAKES[currentTake];

  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.card} 0%, #1E1E2A 100%)`,
      border: `1px solid ${C.border}`,
      borderLeft: `3px solid ${C.red}`,
      borderRadius: 12,
      padding: "20px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Quote mark */}
      <div style={{
        position: "absolute", top: 12, right: 16,
        fontFamily: C.serif, fontSize: 60,
        color: `${C.red}15`, lineHeight: 1, userSelect: "none",
      }}>
        "
      </div>

      <p style={{
        fontFamily: C.sans, fontSize: 15,
        color: C.white, margin: "0 0 14px 0", lineHeight: 1.65,
        position: "relative", zIndex: 1, fontWeight: 400,
      }}>
        "{take.quote}"
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Avatar */}
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.red} 0%, ${C.purple} 100%)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0,
            fontFamily: C.mono,
          }}>
            {take.user[0].toUpperCase()}
          </div>
          <div>
            <span style={{ color: C.muted, fontFamily: C.mono, fontSize: 11 }}>@{take.user}</span>
            <span style={{ color: C.dim, fontFamily: C.mono, fontSize: 10, marginLeft: 8 }}>on {take.product}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ color: C.red, fontSize: 13 }}>▲</span>
          <span style={{ fontFamily: C.mono, fontSize: 12, color: C.orange, fontWeight: 600 }}>{take.votes}</span>
          <span style={{ color: C.dim, fontFamily: C.sans, fontSize: 11 }}>agreed</span>
        </div>
      </div>
    </div>
  );
}

// Stat Counter
function AnimatedCount({ target, suffix = "", duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// Product Card
function ProductCard({ product, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  const declined = product.peak - product.score;
  const scoreColor = product.score >= 75 ? C.green : product.score >= 55 ? C.orange : product.score >= 35 ? C.red : "#888";

  return (
    <FadeIn delay={delay}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? C.cardHover : C.card,
          border: `1px solid ${hovered ? C.borderLight : C.border}`,
          borderRadius: 14,
          padding: "22px 24px",
          transition: "all 0.25s ease",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          boxShadow: hovered ? `0 12px 40px ${C.red}0A` : "none",
          cursor: "default",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <h3 style={{ fontFamily: C.sans, fontSize: 16, fontWeight: 700, color: C.white, margin: 0 }}>
              {product.name}
            </h3>
            <span style={{
              display: "inline-block", marginTop: 5,
              fontFamily: C.mono, fontSize: 10, letterSpacing: "0.06em",
              color: product.tagColor || C.orange,
              background: `${product.tagColor || C.orange}15`,
              border: `1px solid ${product.tagColor || C.orange}30`,
              padding: "2px 8px", borderRadius: 4,
            }}>
              {product.tag}
            </span>
          </div>

          {/* Score badges */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: C.mono, fontSize: 11, color: C.dim, marginBottom: 2 }}>PEAK</div>
              <div style={{ fontFamily: C.mono, fontSize: 18, fontWeight: 700, color: C.green }}>{product.peak}</div>
            </div>
            <div style={{ color: C.red, fontSize: 18, fontWeight: 300 }}>→</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: C.mono, fontSize: 11, color: C.dim, marginBottom: 2 }}>NOW</div>
              <div style={{ fontFamily: C.mono, fontSize: 18, fontWeight: 700, color: scoreColor }}>{product.score}</div>
            </div>
          </div>
        </div>

        {/* Decline bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ height: 4, background: C.surface, borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 2,
              background: `linear-gradient(90deg, ${C.red} 0%, ${C.orange} 100%)`,
              width: `${(declined / product.peak) * 100}%`,
              transition: "width 0.8s ease",
            }} />
          </div>
        </div>

        {/* Key fact */}
        <p style={{ fontFamily: C.sans, fontSize: 13, color: C.body, margin: "0 0 14px 0", lineHeight: 1.5 }}>
          {product.fact}
        </p>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.dim }}>▲ {product.votes} confirmed</span>
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.dim }}>{product.reports} reports</span>
          </div>
          <div style={{
            fontFamily: C.mono, fontSize: 11,
            color: C.red, background: C.redSoft,
            border: `1px solid ${C.redGlow}`,
            padding: "3px 10px", borderRadius: 6,
          }}>
            −{declined} pts
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// Thank You / Queue View
function ThankYouView({ email, queuePosition, onShare }) {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://ruind.io?ref=${btoa(email).slice(0, 8)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const tweetText = encodeURIComponent(`I just joined the @ruind_app waitlist — they're building a platform to track every product that got smaller, worse, and more expensive. With receipts. 🔥\n\nJoin here: ${referralLink}`);

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
      <FadeIn>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.red} 0%, ${C.purple} 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px", fontSize: 26,
        }}>
          ✓
        </div>

        <h2 style={{ fontFamily: C.serif, fontSize: 34, color: C.white, margin: "0 0 8px 0", lineHeight: 1.2 }}>
          You're on the list.
        </h2>
        <p style={{ fontFamily: C.sans, fontSize: 16, color: C.muted, margin: "0 0 32px 0" }}>
          Welcome to the receipts-based resistance.
        </p>

        {/* Queue Position */}
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          padding: "28px 32px",
          marginBottom: 28,
        }}>
          <div style={{ fontFamily: C.mono, fontSize: 12, color: C.dim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
            Your spot in line
          </div>
          <div style={{ fontFamily: C.serif, fontSize: 56, fontWeight: 700, color: C.white, lineHeight: 1, marginBottom: 4 }}>
            #{queuePosition.toLocaleString()}
          </div>
          <div style={{ fontFamily: C.sans, fontSize: 14, color: C.body }}>
            of {(queuePosition + Math.floor(Math.random() * 400) + 1100).toLocaleString()} people waiting
          </div>
        </div>

        {/* Referral Incentive */}
        <div style={{
          background: `linear-gradient(135deg, ${C.redSoft} 0%, #1A1A2A 100%)`,
          border: `1px solid ${C.redGlow}`,
          borderRadius: 16,
          padding: "24px 28px",
          marginBottom: 28,
          textAlign: "left",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 20 }}>🚀</span>
            <h3 style={{ fontFamily: C.sans, fontSize: 16, fontWeight: 700, color: C.white, margin: 0 }}>
              Skip the line. Share to move up.
            </h3>
          </div>

          {/* Tier rewards */}
          {[
            { refs: 3, reward: "Jump 200 spots + Beta access", color: C.blue },
            { refs: 5, reward: "Jump 500 spots + Founding Member badge", color: C.purple },
            { refs: 10, reward: "Top 100 + Exclusive Hall of Shame access", color: C.orange },
          ].map(tier => (
            <div key={tier.refs} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "8px 0",
              borderBottom: `1px solid ${C.border}`,
            }}>
              <div style={{
                fontFamily: C.mono, fontSize: 11, color: tier.color,
                background: `${tier.color}20`, border: `1px solid ${tier.color}30`,
                padding: "3px 8px", borderRadius: 4, flexShrink: 0,
              }}>
                {tier.refs} refs
              </div>
              <span style={{ fontFamily: C.sans, fontSize: 13, color: C.body }}>{tier.reward}</span>
            </div>
          ))}
        </div>

        {/* Share buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <a
            href={`https://twitter.com/intent/tweet?text=${tweetText}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "#1DA1F2", color: "#fff",
              fontFamily: C.sans, fontSize: 14, fontWeight: 600,
              padding: "13px 24px", borderRadius: 10, textDecoration: "none",
              transition: "opacity 0.2s",
            }}
          >
            <span>𝕏</span> Share on X and jump the line
          </a>

          <button
            onClick={copyLink}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: copied ? `${C.green}20` : C.surface,
              border: `1px solid ${copied ? C.green : C.border}`,
              color: copied ? C.green : C.body,
              fontFamily: C.sans, fontSize: 13,
              padding: "12px 24px", borderRadius: 10,
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            {copied ? "✓ Copied!" : "📋 Copy your referral link"}
          </button>
        </div>

        <p style={{ fontFamily: C.mono, fontSize: 11, color: C.dim, marginTop: 20, lineHeight: 1.5 }}>
          We'll email {email} when it's your turn.<br />
          No spam. Just the receipts.
        </p>
      </FadeIn>
    </div>
  );
}

// Main App
export default function App() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(2847);

  // Slowly tick the signup counter
  useInterval(() => {
    if (!submitted) setCount(c => c + Math.floor(Math.random() * 3));
  }, 8000);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Please enter a valid email.");
      return;
    }
    setEmailError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setQueuePosition(count + Math.floor(Math.random() * 50) + 10);
    setSubmitted(true);
    setLoading(false);
  };

  const products = [
    {
      name: "Frosted Flakes",
      tag: "Shrinkflation",
      tagColor: C.orange,
      peak: 88,
      score: 54,
      fact: "Family size: 24oz → 21.7oz. Same box, same price. Per-ounce cost jumped 40%. Kellogg's didn't say a word.",
      votes: "12,441",
      reports: "847",
    },
    {
      name: "Google Search",
      tag: "Enshittification",
      tagColor: C.red,
      peak: 96,
      score: 58,
      fact: "58% of searches now end with zero clicks — answered by AI Overviews and ads. You came for results, you got a product.",
      votes: "31,082",
      reports: "2,103",
    },
    {
      name: "Charmin Ultra",
      tag: "Shrinkflation",
      tagColor: C.orange,
      peak: 82,
      score: 47,
      fact: "Lost 56 sheets per roll over 3 years. That's 21% less toilet paper. You just noticed the roll ending faster.",
      votes: "9,227",
      reports: "614",
    },
  ];

  const steps = [
    { num: "01", icon: "📸", title: "Spot It", desc: "You notice something is smaller, worse, or more expensive. Log it with your receipt or photo." },
    { num: "02", icon: "🗳️", title: "Community Confirms", desc: "Others verify it. Votes stack. Evidence accumulates. A data point becomes a documented fact." },
    { num: "03", icon: "📋", title: "Track the Record", desc: "Every product gets a permanent, searchable timeline. The receipts don't lie. Neither do we." },
  ];

  if (submitted) {
    return (
      <div style={{ background: C.bg, minHeight: "100vh", fontFamily: C.sans }}>
        <GoogleFonts />
        <Nav />
        <ThankYouView email={email} queuePosition={queuePosition} />
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: C.sans, overflowX: "hidden" }}>
      <GoogleFonts />

      {/* ── Nav ── */}
      <Nav />

      {/* ── Live Ticker ── */}
      <ActivityTicker />

      {/* ── Hero ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px 64px", textAlign: "center" }}>
        <FadeIn>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: C.redSoft, border: `1px solid ${C.redGlow}`,
            borderRadius: 999, padding: "6px 16px", marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.red, display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.red, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Tracking {count.toLocaleString()}+ products in decline
            </span>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 style={{
            fontFamily: C.serif,
            fontSize: "clamp(38px, 7vw, 64px)",
            fontWeight: 400,
            fontStyle: "italic",
            color: C.white,
            lineHeight: 1.15,
            margin: "0 0 20px 0",
            letterSpacing: "-0.02em",
          }}>
            They peaked.<br />
            <span style={{ color: C.red }}>We tracked it.</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p style={{
            fontFamily: C.sans, fontSize: "clamp(16px, 2.5vw, 20px)",
            color: C.body, lineHeight: 1.65,
            margin: "0 auto 36px", maxWidth: 560,
          }}>
            Smaller portions. Worse quality. Higher prices.<br />
            <strong style={{ color: C.bright }}>Join {count.toLocaleString()}+ people</strong> documenting every brand that got away with it — with receipts, not opinions.
          </p>
        </FadeIn>

        {/* Email form */}
        <FadeIn delay={0.3}>
          <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: "0 auto 16px" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: 1, minWidth: 220,
                  background: C.surface,
                  border: `1px solid ${emailError ? C.red : C.border}`,
                  borderRadius: 10,
                  color: C.white,
                  fontFamily: C.sans, fontSize: 15,
                  padding: "14px 18px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? C.dim : `linear-gradient(135deg, ${C.red} 0%, #C1121F 100%)`,
                  color: "#fff",
                  fontFamily: C.sans, fontSize: 15, fontWeight: 600,
                  padding: "14px 28px",
                  borderRadius: 10, border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  boxShadow: loading ? "none" : `0 4px 20px ${C.red}40`,
                }}
              >
                {loading ? "Joining..." : "Get Early Access"}
              </button>
            </div>
            {emailError && <p style={{ fontFamily: C.sans, fontSize: 12, color: C.red, margin: "8px 0 0", textAlign: "left" }}>{emailError}</p>}
          </form>

          {/* Social proof micro-line */}
          <p style={{ fontFamily: C.sans, fontSize: 13, color: C.dim, margin: 0 }}>
            Join <strong style={{ color: C.muted }}>{count.toLocaleString()} shoppers, data nerds & journalists</strong> — free, no spam
          </p>
        </FadeIn>

        {/* Trust badges */}
        <FadeIn delay={0.4}>
          <div style={{
            display: "flex", justifyContent: "center", gap: 24,
            flexWrap: "wrap", marginTop: 32,
            paddingTop: 24, borderTop: `1px solid ${C.border}`,
          }}>
            {[
              { stat: "82%", label: "of Americans have noticed shrinkflation" },
              { stat: "48%", label: "abandoned a brand over it" },
              { stat: "200K+", label: "on r/shrinkflation alone" },
            ].map(({ stat, label }) => (
              <div key={stat} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: C.mono, fontSize: 18, fontWeight: 700, color: C.red }}>{stat}</div>
                <div style={{ fontFamily: C.sans, fontSize: 11, color: C.dim, maxWidth: 120 }}>{label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* ── Hot Takes ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 72px" }}>
        <FadeIn>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.dim, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              🔥 Community Hot Takes
            </span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.dim }}>most upvoted this week</span>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
          {HOT_TAKES.map((_, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <HotTakeCard index={i} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Product Cards ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>
        <FadeIn>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.dim, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              📋 Preview: Decline Reports
            </span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.dim }}>what Ruind will track</span>
          </div>
          <p style={{ fontFamily: C.sans, fontSize: 14, color: C.dim, margin: "0 0 24px 0" }}>
            Every data point below was verified by community members. Peak score vs now. Real numbers.
          </p>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {products.map((p, i) => (
            <ProductCard key={p.name} product={p} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ borderTop: `1px solid ${C.border}`, padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <h2 style={{ fontFamily: C.serif, fontSize: "clamp(28px, 4vw, 42px)", fontStyle: "italic", color: C.white, margin: "0 0 12px" }}>
                Built by the crowd.
              </h2>
              <p style={{ fontFamily: C.sans, fontSize: 16, color: C.muted, margin: 0 }}>
                Anyone can spot a decline. Here, you can actually prove it.
              </p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
            {steps.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.15}>
                <div style={{
                  background: C.surface, border: `1px solid ${C.border}`,
                  borderRadius: 14, padding: "28px 24px",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", top: -8, right: 12,
                    fontFamily: C.mono, fontSize: 56, fontWeight: 700,
                    color: `${C.red}10`, lineHeight: 1, userSelect: "none",
                  }}>
                    {step.num}
                  </div>
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{step.icon}</div>
                  <h3 style={{ fontFamily: C.sans, fontSize: 17, fontWeight: 700, color: C.white, margin: "0 0 10px" }}>
                    {step.title}
                  </h3>
                  <p style={{ fontFamily: C.sans, fontSize: 14, color: C.body, margin: 0, lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "20px 24px 80px" }}>
        <FadeIn>
          <h2 style={{ fontFamily: C.serif, fontSize: "clamp(26px, 4vw, 38px)", fontStyle: "italic", color: C.white, textAlign: "center", margin: "0 0 40px" }}>
            Backed by receipts.
          </h2>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { icon: "🔔", title: "Get Alerted First", desc: "Know when your trusted brands make changes before you're already out the money." },
            { icon: "📷", title: "Receipts, Not Opinions", desc: "Photos, measurements, and purchase data. Everything is verifiable." },
            { icon: "🏆", title: "Hall of Shame", desc: "Annual leaderboard of the worst offenders, ranked by community votes." },
            { icon: "📊", title: "Your Year in Decline", desc: "Wrapped-style shareable card showing the products that got you this year." },
          ].map((b, i) => (
            <FadeIn key={b.title} delay={i * 0.1}>
              <div style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: "22px 20px",
              }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{b.icon}</div>
                <h3 style={{ fontFamily: C.sans, fontSize: 15, fontWeight: 700, color: C.white, margin: "0 0 8px" }}>{b.title}</h3>
                <p style={{ fontFamily: C.sans, fontSize: 13, color: C.body, margin: 0, lineHeight: 1.55 }}>{b.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Social Stats Bar ── */}
      <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "40px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
          {[
            { target: 82, suffix: "%", label: "of Americans noticed shrinkflation", src: "YouGov 2024" },
            { target: 48, suffix: "%", label: "abandoned a brand over it", src: "Attest 2024" },
            { target: 200, suffix: "K+", label: "on r/shrinkflation", src: "Reddit" },
            { target: count, suffix: "+", label: "on the Ruind.io waitlist", src: "and counting" },
          ].map(({ target, suffix, label, src }) => (
            <FadeIn key={label}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: C.mono, fontSize: 32, fontWeight: 700, color: C.red, lineHeight: 1 }}>
                  <AnimatedCount target={target} suffix={suffix} />
                </div>
                <div style={{ fontFamily: C.sans, fontSize: 13, color: C.body, margin: "8px 0 4px" }}>{label}</div>
                <div style={{ fontFamily: C.mono, fontSize: 10, color: C.dim }}>{src}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{ maxWidth: 600, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <FadeIn>
          <h2 style={{
            fontFamily: C.serif, fontSize: "clamp(28px, 5vw, 44px)",
            fontStyle: "italic", color: C.white,
            margin: "0 0 16px", lineHeight: 1.2,
          }}>
            They peaked.<br />
            <span style={{ color: C.red }}>We tracked it.</span>
          </h2>
          <p style={{ fontFamily: C.sans, fontSize: 16, color: C.body, margin: "0 0 36px", lineHeight: 1.6 }}>
            Be first to know when it launches. Every report you submit makes the database harder to ignore.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <form onSubmit={handleSubmit} style={{ maxWidth: 440, margin: "0 auto 14px" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: 1, minWidth: 200,
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10, color: C.white,
                  fontFamily: C.sans, fontSize: 15,
                  padding: "13px 18px", outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: `linear-gradient(135deg, ${C.red} 0%, #C1121F 100%)`,
                  color: "#fff",
                  fontFamily: C.sans, fontSize: 15, fontWeight: 600,
                  padding: "13px 24px", borderRadius: 10, border: "none",
                  cursor: "pointer",
                  boxShadow: `0 4px 20px ${C.red}40`,
                }}
              >
                Get Early Access
              </button>
            </div>
          </form>
          <p style={{ fontFamily: C.sans, fontSize: 12, color: C.dim }}>
            Free forever for founding members. Join {count.toLocaleString()}+ on the waitlist.
          </p>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: `1px solid ${C.border}`,
        padding: "28px 24px",
        textAlign: "center",
      }}>
        <p style={{ fontFamily: C.mono, fontSize: 12, color: C.dim, margin: 0 }}>
          ruind.io · © 2026 · Built in Miami 🌴 · The receipts don't lie.
        </p>
      </footer>

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        input:focus { border-color: ${C.red} !important; box-shadow: 0 0 0 3px ${C.red}20; }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 ${C.red}60; }
          50% { box-shadow: 0 0 0 6px ${C.red}00; }
        }
        @media (max-width: 480px) {
          input, button[type="submit"] { width: 100% !important; min-width: 100% !important; }
        }
      `}</style>
    </div>
  );
}

// Nav
function Nav() {
  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 32px", maxWidth: 1100, margin: "0 auto",
    }}>
      <div style={{
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        fontSize: 22, fontWeight: 400, fontStyle: "normal",
        color: C.white, letterSpacing: "-0.01em",
      }}>
        ruind<span style={{ color: C.red }}>.</span><span style={{ color: C.red }}>io</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <span style={{ fontFamily: C.mono, fontSize: 11, color: C.dim, letterSpacing: "0.06em" }}>
          EARLY ACCESS
        </span>
        <a
          href="#"
          onClick={e => { e.preventDefault(); document.querySelector("input[type=email]")?.focus(); }}
          style={{
            background: C.red, color: "#fff",
            fontFamily: C.sans, fontSize: 13, fontWeight: 600,
            padding: "8px 18px", borderRadius: 8,
            textDecoration: "none", transition: "opacity 0.2s",
          }}
        >
          Get Early Access
        </a>
      </div>
    </nav>
  );
}

// Google Fonts
function GoogleFonts() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);
  return null;
}
