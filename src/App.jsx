import { useState, useEffect, useRef } from "react";

const C = {
  bg: "#09090B", surface: "#131316", card: "#18181D",
  border: "#27272E", borderHover: "#3A3A45",
  dim: "#52526B", muted: "#7E7E9A", body: "#A8A8C4",
  bright: "#D6D6ED", white: "#F0F0FF",
  red: "#E5383B", redGlow: "rgba(229,56,59,0.12)",
  orange: "#F48C06", green: "#06D6A0", blue: "#4895EF", purple: "#9B5DE5",
  serif: "'Instrument Serif','Playfair Display',Georgia,serif",
  mono: "'IBM Plex Mono',Menlo,monospace",
  sans: "'DM Sans','Helvetica Neue',sans-serif",
};

function AnimNum({ target, dur = 2000 }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let s = 0; const step = target / (dur / 16);
    const id = setInterval(() => { s += step; if (s >= target) { setV(target); clearInterval(id); } else setV(Math.floor(s)); }, 16);
    return () => clearInterval(id);
  }, [target, dur]);
  return <>{v.toLocaleString()}</>;
}

function Fade({ children, delay = 0, style = {} }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t); }, [delay]);
  return <div style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(20px)", transition: `all 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`, ...style }}>{children}</div>;
}

const SITE_URL = "https://ruind.io";
const SHARE_TEXT = "Your favorite products are getting worse and this site is tracking all of it 👀";

function handleXPost() {
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT + " " + SITE_URL)}`, "_blank");
}
function handleReddit() {
  window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(SITE_URL)}&title=${encodeURIComponent(SHARE_TEXT)}`, "_blank");
}
function handleCopy(setCopied) {
  navigator.clipboard.writeText(SITE_URL).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
}

const PREVIEWS = [
  { emoji: "🔍", name: "Google Search", peak: 95, current: 29, decline: 69, tag: "Enshittification" },
  { emoji: "🎬", name: "Netflix", peak: 92, current: 34, decline: 63, tag: "Price Hike" },
  { emoji: "📸", name: "Instagram", peak: 93, current: 31, decline: 67, tag: "Ads Everywhere" },
];

const FEATURES = [
  { icon: "📉", title: "Quality Timelines", desc: "Year-by-year visual history of how products declined. See exactly when they peaked." },
  { icon: "🗳️", title: "Community Voting", desc: "Upvote reports, confirm declines. Powered by the crowd, not corporations." },
  { icon: "🎁", title: "Annual Wrapped", desc: "Your personalized year-end report of products that betrayed you. Designed to go viral." },
  { icon: "💀", title: "Hall of Shame", desc: "Real-time leaderboard of the most declined products. Ranked by community data." },
];

function ShareButtons() {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      <button onClick={handleXPost} style={{ padding: "8px 16px", borderRadius: 8, background: "#1DA1F222", border: "1px solid #1DA1F244", color: C.bright, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: C.sans }}>𝕏 Post</button>
      <button onClick={() => handleCopy(setCopied)} style={{ padding: "8px 16px", borderRadius: 8, background: `${C.border}22`, border: `1px solid ${C.border}44`, color: C.bright, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: C.sans }}>{copied ? "✓ Copied!" : "Copy Link"}</button>
      <button onClick={handleReddit} style={{ padding: "8px 16px", borderRadius: 8, background: "#FF450022", border: "1px solid #FF450044", color: C.bright, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: C.sans }}>Reddit</button>
    </div>
  );
}

export default function RuindLanding() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState(null);
  const emailRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setPosition(Math.floor(Math.random() * 400) + 1200);
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.body, fontFamily: C.sans, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Mono:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0}body{background:${C.bg}}
        ::selection{background:${C.red}40;color:${C.white}}input::placeholder{color:${C.dim}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px ${C.redGlow}}50%{box-shadow:0 0 40px ${C.redGlow},0 0 80px rgba(229,56,59,.06)}}
      `}</style>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: `${C.bg}dd`, backdropFilter: "blur(16px)", borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <span style={{ fontFamily: C.serif, fontSize: 28, fontWeight: 700, color: C.white, letterSpacing: "-0.02em" }}>ruind</span>
          <span style={{ fontFamily: C.serif, fontSize: 28, fontWeight: 700, color: C.red }}>.</span>
          <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 600, color: C.muted, marginLeft: 2 }}>io</span>
        </div>
        <button onClick={() => emailRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })} style={{ padding: "7px 18px", borderRadius: 8, background: C.red, border: "none", color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: C.sans }}>Join Waitlist</button>
      </nav>

      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px 60px", position: "relative" }}>
        <div style={{ position: "absolute", top: "-10%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: `radial-gradient(circle,${C.red}08 0%,transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.02, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", pointerEvents: "none" }} />
        <Fade delay={100}>
          <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, background: C.redGlow, border: `1px solid ${C.red}30`, fontSize: 12, fontWeight: 600, color: C.red, fontFamily: C.mono, marginBottom: 28, animation: "pulse 3s ease infinite" }}>● Coming Soon — Join the Waitlist</div>
        </Fade>
        <Fade delay={250}>
          <h1 style={{ fontSize: "clamp(42px,8vw,72px)", fontWeight: 400, fontFamily: C.serif, color: C.white, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 700 }}>They peaked.<br /><span style={{ color: C.red, fontStyle: "italic" }}>We tracked it.</span></h1>
        </Fade>
        <Fade delay={400}>
          <p style={{ fontSize: 18, color: C.muted, maxWidth: 480, margin: "20px auto 0", lineHeight: 1.7 }}>
            Smaller portions. Worse quality. Higher prices.<br />
            <span style={{ color: C.body }}>Finally, someone's tracking it.</span>
          </p>
        </Fade>
        <Fade delay={550}>
          <div style={{ marginTop: 36, width: "100%", maxWidth: 440 }}>
            {!submitted ? (
              <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
                <input ref={emailRef} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, padding: "13px 16px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, color: C.white, fontSize: 15, outline: "none", fontFamily: C.sans }} onFocus={(e) => e.target.style.borderColor = C.red} onBlur={(e) => e.target.style.borderColor = C.border} />
                <button type="submit" style={{ padding: "13px 24px", background: C.red, border: "none", borderRadius: 10, color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: C.sans, whiteSpace: "nowrap", animation: "glow 3s ease infinite" }}>Get Early Access</button>
              </form>
            ) : (
              <div style={{ padding: 24, background: C.card, borderRadius: 16, border: `1px solid ${C.green}30` }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.white, fontFamily: C.serif }}>You're #{position} on the list</div>
                <p style={{ fontSize: 13, color: C.muted, margin: "8px 0 16px" }}>Share to move up. Every referral bumps you 10 spots.</p>
                <ShareButtons />
              </div>
            )}
            <p style={{ fontSize: 12, color: C.dim, marginTop: 10, fontFamily: C.mono }}>No spam. Unsubscribe anytime. <span style={{ color: C.muted }}>Join <AnimNum target={1847} /> others.</span></p>
          </div>
        </Fade>
        <Fade delay={800}><div style={{ position: "absolute", bottom: 32, animation: "float 2.5s ease infinite", color: C.dim, fontSize: 13, fontFamily: C.mono }}>↓ scroll</div></Fade>
      </section>

      <section style={{ padding: "80px 24px", maxWidth: 880, margin: "0 auto" }}>
        <Fade>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 400, color: C.white, fontFamily: C.serif, lineHeight: 1.2 }}>See the decline. <span style={{ color: C.red, fontStyle: "italic" }}>In real time.</span></h2>
            <p style={{ fontSize: 15, color: C.muted, marginTop: 10, maxWidth: 420, margin: "10px auto 0" }}>Community-tracked quality timelines for the products you care about.</p>
          </div>
        </Fade>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
          {PREVIEWS.map((item, i) => (
            <Fade key={item.name} delay={200 + i * 120}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{item.emoji}</span>
                    <span style={{ fontFamily: C.serif, fontSize: 16, fontWeight: 600, color: C.white }}>{item.name}</span>
                  </div>
                  <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 700, color: C.red, background: C.redGlow, padding: "2px 8px", borderRadius: 6 }}>↓{item.decline}%</span>
                </div>
                <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ height: "100%", width: `${item.decline}%`, background: `linear-gradient(90deg,${C.orange},${C.red})`, borderRadius: 3 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: C.mono, fontSize: 11, color: C.dim }}>
                  <span>Peak: <span style={{ color: C.green }}>{item.peak}</span></span>
                  <span>Now: <span style={{ color: C.red }}>{item.current}</span></span>
                  <span style={{ background: `${C.orange}18`, color: C.orange, padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 600 }}>{item.tag}</span>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      <section style={{ padding: "60px 24px 80px", maxWidth: 880, margin: "0 auto" }}>
        <Fade><h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 400, color: C.white, fontFamily: C.serif, marginBottom: 40 }}>How it works</h2></Fade>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
          {FEATURES.map((f, i) => (
            <Fade key={f.title} delay={100 + i * 100}>
              <div style={{ padding: "22px 20px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, height: "100%" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.white, fontFamily: C.sans, marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      <section style={{ padding: "60px 24px 80px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <Fade>
          <div style={{ padding: "32px 28px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20 }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 40, marginBottom: 24, flexWrap: "wrap" }}>
              {[{ value: "1.5M+", label: "r/BuyItForLife members" }, { value: "2023", label: "Word of the Year" }, { value: "0", label: "Competitors" }].map((s) => (
                <div key={s.label}>
                  <div style={{ fontFamily: C.mono, fontSize: 24, fontWeight: 700, color: C.white }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: C.dim, fontFamily: C.mono, textTransform: "uppercase", letterSpacing: ".05em" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 17, color: C.bright, fontFamily: C.serif, fontStyle: "italic", lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>"Enshittification" was named 2023 Word of the Year. Cory Doctorow published a book on it. 1.5 million people discuss it daily on Reddit. There is no tracker. Until now.</p>
          </div>
        </Fade>
      </section>

      <section style={{ padding: "60px 24px 100px", textAlign: "center" }}>
        <Fade>
          <h2 style={{ fontSize: 36, fontWeight: 400, fontFamily: C.serif, color: C.white, lineHeight: 1.15, marginBottom: 16 }}>Be first to know when it <span style={{ color: C.red, fontStyle: "italic" }}>launches</span>.</h2>
          {!submitted ? (
            <div style={{ maxWidth: 400, margin: "0 auto" }}>
              <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" style={{ flex: 1, padding: "13px 16px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, color: C.white, fontSize: 15, outline: "none", fontFamily: C.sans }} />
                <button type="submit" style={{ padding: "13px 24px", background: C.red, border: "none", borderRadius: 10, color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: C.sans }}>Join Waitlist</button>
              </form>
            </div>
          ) : (
            <p style={{ fontSize: 15, color: C.green, fontFamily: C.mono }}>✓ You're on the list at #{position}</p>
          )}
        </Fade>
      </section>

      <footer style={{ padding: 24, borderTop: `1px solid ${C.border}`, textAlign: "center", fontSize: 12, color: C.dim, fontFamily: C.mono }}>
        <span style={{ fontFamily: C.serif, color: C.muted }}>ruind</span><span style={{ color: C.red }}>.</span><span>io</span>
        <span style={{ margin: "0 10px", color: C.border }}>|</span>© 2025 · Built in Miami
      </footer>
    </div>
  );
}
