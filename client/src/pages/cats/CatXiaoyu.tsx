/**
 * CatXiaoyu.tsx — 小橘 | 图书馆守护者
 * Design: Warm editorial — elastic spring grid physics + ASCII art cat
 * Theme: Warm orange #ff7043 on cream #fdf8f2
 * Layout: Left data panel + Right full-bleed p5 canvas
 * Features: Spring mesh, ASCII cat, feeding interaction, timeline, mood tracker
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "wouter";
import { getCatById } from "@/lib/cats";

const cat = getCatById("xiaoyu")!;

const ASCII_CAT = [
  "  /\\_____/\\",
  " /  o   o  \\",
  "( ==  ^  == )",
  " )         (",
  "(           )",
  " \\  |   |  /",
  "  \\_|___|_/",
];

const TIMELINE = [
  { time: "07:30", event: "在图书馆门口等待开门", icon: "🌅" },
  { time: "09:00", event: "巡视书架，陪伴早自习同学", icon: "📚" },
  { time: "12:00", event: "午休时间，趴在暖气片上打盹", icon: "😴" },
  { time: "14:00", event: "在阅览室巡逻，接受投喂", icon: "🍊" },
  { time: "18:00", event: "目送同学下课离开", icon: "👋" },
  { time: "21:00", event: "图书馆关门，转移至宿舍楼", icon: "🌙" },
];

export default function CatXiaoyu() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"stats" | "facts" | "timeline">("stats");
  const [feedCount, setFeedCount] = useState(0);
  const [mood, setMood] = useState(50);
  const [showAscii, setShowAscii] = useState(false);
  const [isSummoned, setIsSummoned] = useState(false);
  const p5Ref = useRef<any>(null);

  const handleFeed = useCallback(() => {
    setFeedCount((c) => c + 1);
    setMood((m) => Math.min(100, m + 10));
    if (p5Ref.current) {
      p5Ref.current._isSummoned = true;
      setIsSummoned(true);
      setTimeout(() => {
        if (p5Ref.current) p5Ref.current._isSummoned = false;
        setIsSummoned(false);
      }, 3000);
    }
  }, []);

  useEffect(() => {
    let p5Instance: any;
    const initP5 = async () => {
      const p5 = (await import("p5")).default;

      const sketch = (p: any) => {
        const COLS = 24, ROWS = 18;
        let pts: Array<{ x: number; y: number; ox: number; oy: number; vx: number; vy: number }> = [];
        let fishParticles: Array<{ x: number; y: number; vx: number; vy: number; life: number; size: number; angle: number }> = [];
        let pawPrints: Array<{ x: number; y: number; alpha: number; angle: number }> = [];
        let frameCounter = 0;

        p.setup = () => {
          const cnv = p.createCanvas(p.windowWidth, p.windowHeight);
          cnv.parent(canvasRef.current!);
          cnv.style("position", "absolute");
          cnv.style("top", "0"); cnv.style("left", "0");
          cnv.style("z-index", "0");
          initGrid();
          // Add some initial paw prints
          for (let i = 0; i < 8; i++) {
            pawPrints.push({
              x: p.random(p.width * 0.45, p.width),
              y: p.random(50, p.height - 50),
              alpha: p.random(20, 60),
              angle: p.random(p.TWO_PI),
            });
          }
        };

        const initGrid = () => {
          pts = [];
          for (let r = 0; r <= ROWS; r++) {
            for (let c = 0; c <= COLS; c++) {
              const x = (c / COLS) * p.width;
              const y = (r / ROWS) * p.height;
              pts.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
            }
          }
        };

        p.draw = () => {
          frameCounter++;
          p.background(253, 248, 242);

          // Paw prints
          pawPrints.forEach((pw) => {
            p.push();
            p.translate(pw.x, pw.y);
            p.rotate(pw.angle);
            p.noStroke();
            p.fill(255, 112, 67, pw.alpha);
            // Main pad
            p.ellipse(0, 0, 14, 12);
            // Toe pads
            p.ellipse(-6, -8, 7, 6);
            p.ellipse(0, -10, 7, 6);
            p.ellipse(6, -8, 7, 6);
            p.pop();
          });

          // Update grid physics
          const summoned = p5Ref.current?._isSummoned;
          pts.forEach((pt) => {
            const dx = p.mouseX - pt.x;
            const dy = p.mouseY - pt.y;
            const d = p.sqrt(dx * dx + dy * dy);
            const radius = summoned ? 200 : 130;
            if (d < radius && d > 0) {
              const force = p.map(d, 0, radius, summoned ? 6 : 3, 0);
              pt.vx -= (dx / d) * force;
              pt.vy -= (dy / d) * force;
            }
            pt.vx += (pt.ox - pt.x) * 0.07;
            pt.vy += (pt.oy - pt.y) * 0.07;
            pt.vx *= 0.87;
            pt.vy *= 0.87;
            pt.x += pt.vx;
            pt.y += pt.vy;
          });

          // Draw grid
          p.stroke(255, 112, 67, 22);
          p.strokeWeight(0.7);
          for (let r = 0; r <= ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
              const a = pts[r * (COLS + 1) + c];
              const b = pts[r * (COLS + 1) + c + 1];
              if (a && b) p.line(a.x, a.y, b.x, b.y);
            }
          }
          for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c <= COLS; c++) {
              const a = pts[r * (COLS + 1) + c];
              const b = pts[(r + 1) * (COLS + 1) + c];
              if (a && b) p.line(a.x, a.y, b.x, b.y);
            }
          }

          // Grid dots with deformation glow
          p.noStroke();
          pts.forEach((pt) => {
            const dx = pt.x - pt.ox;
            const dy = pt.y - pt.oy;
            const dist2 = dx * dx + dy * dy;
            const alpha = p.map(dist2, 0, 500, 25, 180);
            p.fill(255, 112, 67, alpha);
            p.circle(pt.x, pt.y, p.map(dist2, 0, 500, 1.5, 5.5));
          });

          // Fish / food particles when summoned
          if (summoned && frameCounter % 3 === 0 && fishParticles.length < 60) {
            fishParticles.push({
              x: p.width * 0.65 + p.random(-80, 80),
              y: p.height * 0.45 + p.random(-80, 80),
              vx: p.random(-2, 2),
              vy: p.random(-3, -0.5),
              life: 1,
              size: p.random(6, 16),
              angle: p.random(p.TWO_PI),
            });
          }
          fishParticles = fishParticles.filter((fp) => fp.life > 0);
          fishParticles.forEach((fp) => {
            fp.x += fp.vx;
            fp.y += fp.vy;
            fp.vy -= 0.05;
            fp.angle += 0.08;
            fp.life -= 0.018;
            p.push();
            p.translate(fp.x, fp.y);
            p.rotate(fp.angle);
            p.fill(255, 140, 80, fp.life * 220);
            p.noStroke();
            // Fish shape
            p.ellipse(0, 0, fp.size * fp.life, fp.size * 0.6 * fp.life);
            p.triangle(
              fp.size * 0.4 * fp.life, 0,
              fp.size * 0.8 * fp.life, -fp.size * 0.3 * fp.life,
              fp.size * 0.8 * fp.life, fp.size * 0.3 * fp.life
            );
            p.pop();
          });

          // Summoned glow ring
          if (summoned) {
            const pulse = p.sin(frameCounter * 0.08) * 20;
            for (let i = 4; i > 0; i--) {
              p.fill(255, 112, 67, 8 * i);
              p.noStroke();
              p.circle(p.width * 0.65, p.height * 0.45, 200 + pulse + i * 35);
            }
            // Sparkles
            for (let i = 0; i < 6; i++) {
              const angle = (frameCounter * 0.04) + (i * p.TWO_PI / 6);
              const r = 110 + pulse * 0.5;
              const sx = p.width * 0.65 + p.cos(angle) * r;
              const sy = p.height * 0.45 + p.sin(angle) * r;
              p.fill(255, 180, 80, 180);
              p.noStroke();
              p.circle(sx, sy, 5);
            }
          }

          // Ambient floating circles
          for (let i = 0; i < 3; i++) {
            const t = frameCounter * 0.005 + i * 2;
            const cx = p.width * (0.55 + 0.1 * i) + p.sin(t) * 30;
            const cy = p.height * (0.3 + 0.2 * i) + p.cos(t * 0.7) * 20;
            p.fill(255, 112, 67, 8);
            p.noStroke();
            p.circle(cx, cy, 80 + i * 40);
          }
        };

        p.mouseMoved = () => {
          // Add paw print occasionally
          if (p.frameCount % 40 === 0 && p.mouseX > p.width * 0.45) {
            pawPrints.push({
              x: p.mouseX + p.random(-10, 10),
              y: p.mouseY + p.random(-10, 10),
              alpha: 40,
              angle: p.random(p.TWO_PI),
            });
            if (pawPrints.length > 20) pawPrints.shift();
          }
        };

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
          initGrid();
        };

        p5Ref.current = p;
      };

      p5Instance = new p5(sketch);
    };
    initP5();
    return () => {
      if (p5Instance) p5Instance.remove();
      p5Ref.current = null;
    };
  }, []);

  const moodLabel = mood >= 80 ? "心满意足" : mood >= 60 ? "悠然自得" : mood >= 40 ? "有点饿了" : "饥肠辘辘";
  const moodColor = mood >= 80 ? "#ff7043" : mood >= 60 ? "#ff8a65" : mood >= 40 ? "#ffa726" : "#ef5350";

  return (
    <div className="relative w-full min-h-screen overflow-hidden" style={{ background: "#fdf8f2" }}>
      <div ref={canvasRef} className="fixed inset-0 z-0" />

      {/* Left data panel */}
      <div
        className="relative z-10 flex flex-col"
        style={{
          width: "min(440px, 44vw)",
          minHeight: "100vh",
          padding: "36px 32px 36px 36px",
          background: "rgba(253,248,242,0.85)",
          backdropFilter: "blur(12px)",
          borderRight: "1px solid rgba(255,112,67,0.12)",
        }}
      >
        {/* Back link */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "#ff7043",
            textDecoration: "none",
            letterSpacing: "0.1em",
            fontWeight: 700,
            marginBottom: 28,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ← 返回
        </Link>

        {/* Archive label */}
        <div className="data-label mb-2" style={{ color: "#ff7043" }}>
          // 校园猫咪档案 #{cat.number} / {cat.role}
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(3rem, 6vw, 5.5rem)",
            lineHeight: 0.88,
            color: "#1a1208",
            letterSpacing: "-0.03em",
            marginBottom: 10,
          }}
        >
          XIAO
          <br />
          JU
        </h1>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", color: "#ff7043", marginBottom: 4 }}>
          小 橘
        </div>
        <div className="data-label" style={{ color: "#b0956a", marginBottom: 24 }}>
          {cat.breed} · {cat.location}
        </div>

        {/* ASCII Cat toggle */}
        <div
          style={{
            background: "rgba(255,112,67,0.06)",
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 20,
            cursor: "pointer",
            border: "1px solid rgba(255,112,67,0.15)",
          }}
          onClick={() => setShowAscii((s) => !s)}
        >
          {showAscii ? (
            <pre style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              color: "#ff7043",
              lineHeight: 1.4,
              margin: 0,
            }}>
              {ASCII_CAT.join("\n")}
            </pre>
          ) : (
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "#b0956a", letterSpacing: "0.08em" }}>
              [ 点击查看 ASCII 猫咪 ]
            </div>
          )}
        </div>

        {/* Mood tracker */}
        <div
          className="glass-panel rounded-2xl"
          style={{ padding: "16px 18px", marginBottom: 16 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div className="data-label" style={{ color: "#ff7043" }}>心情指数</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: moodColor, fontWeight: 700 }}>
              {moodLabel} · {mood}%
            </div>
          </div>
          <div style={{ height: 8, background: "#ffe0d0", borderRadius: 4, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${mood}%`,
                background: `linear-gradient(90deg, #ff8a65, ${moodColor})`,
                borderRadius: 4,
                transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "#c0a880" }}>饥饿</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "#c0a880" }}>满足</div>
          </div>
        </div>

        {/* Vitals */}
        <div className="glass-panel rounded-2xl" style={{ padding: "16px 18px", marginBottom: 16 }}>
          <div className="data-label mb-3" style={{ color: "#ff7043" }}>实时状态监测</div>
          {cat.vitals.map((v) => (
            <div key={v.label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "0.62rem", marginBottom: 3, color: "#4a3c28" }}>
                <span>{v.label}</span>
                <span style={{ color: v.color, fontWeight: 700 }}>{v.value}%</span>
              </div>
              <div style={{ height: 3, background: "#ffe0d0", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${v.value}%`, background: v.color, borderRadius: 2, transition: "width 1.2s ease" }} />
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {(["stats", "facts", "timeline"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  padding: "5px 12px",
                  borderRadius: 100,
                  border: "none",
                  background: activeTab === tab ? "#ff7043" : "rgba(255,112,67,0.1)",
                  color: activeTab === tab ? "#fff" : "#ff7043",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                {tab === "stats" ? "档案" : tab === "facts" ? "趣闻" : "日程"}
              </button>
            ))}
          </div>

          {activeTab === "stats" && (
            <div className="glass-panel rounded-xl" style={{ padding: "12px 14px" }}>
              {cat.stats.map((s) => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(255,112,67,0.07)", fontFamily: "var(--font-mono)", fontSize: "0.6rem" }}>
                  <span style={{ color: "#8a7a60" }}>{s.label}</span>
                  <span style={{ color: "#1a1208", fontWeight: 700 }}>{s.value}{s.unit ? ` ${s.unit}` : ""}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "facts" && (
            <div className="glass-panel rounded-xl" style={{ padding: "12px 14px" }}>
              {cat.funFacts.map((fact, i) => (
                <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: "1px solid rgba(255,112,67,0.07)", fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "#4a3c28", lineHeight: 1.5 }}>
                  <span style={{ color: "#ff7043", fontWeight: 700, flexShrink: 0, fontFamily: "var(--font-mono)" }}>0{i + 1}</span>
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="glass-panel rounded-xl" style={{ padding: "12px 14px" }}>
              <div className="data-label mb-3" style={{ color: "#ff7043" }}>小橘的一天</div>
              {TIMELINE.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: i < TIMELINE.length - 1 ? "1px solid rgba(255,112,67,0.07)" : "none", alignItems: "flex-start" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "#ff7043", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{item.time}</div>
                  <div style={{ fontSize: "0.85rem", flexShrink: 0 }}>{item.icon}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "#4a3c28", lineHeight: 1.4 }}>{item.event}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="glass-panel rounded-xl" style={{ padding: "14px 16px", marginTop: 12 }}>
          <div className="data-label mb-2" style={{ color: "#ff7043" }}>档案描述</div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.74rem", color: "#4a3c28", lineHeight: 1.7, margin: 0 }}>
            {cat.description}
          </p>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 5 }}>
            {cat.tags.map((tag) => (
              <span key={tag} className="tag-pill" style={{ background: "rgba(255,112,67,0.1)", color: "#ff7043" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right side stats */}
      <div
        className="fixed z-10"
        style={{ right: 28, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}
      >
        <div className="data-label" style={{ color: "#ff7043" }}>性格</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "#1a1208" }}>极高</div>
        <div style={{ width: 1, height: 36, background: "rgba(255,112,67,0.25)", margin: "4px 0" }} />
        <div className="data-label" style={{ color: "#ff7043" }}>状态</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "#1a1208" }}>巡逻</div>
        <div style={{ width: 1, height: 36, background: "rgba(255,112,67,0.25)", margin: "4px 0" }} />
        <div className="data-label" style={{ color: "#ff7043" }}>投喂次数</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.5rem", color: "#ff7043" }}>{feedCount}</div>
      </div>

      {/* Feed button */}
      <button
        onClick={handleFeed}
        className="fixed z-20"
        style={{
          bottom: 32,
          right: 32,
          padding: "14px 28px",
          borderRadius: 100,
          border: "none",
          background: isSummoned ? "#1a1208" : "#ff7043",
          color: "#fff",
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: isSummoned ? "0 4px 24px rgba(26,18,8,0.35)" : "0 4px 24px rgba(255,112,67,0.45)",
          transform: isSummoned ? "scale(1.05)" : "scale(1)",
        }}
      >
        {isSummoned ? "🐱 小橘来了！" : "🐟 投喂小橘"}
      </button>

      {/* Interaction hint */}
      <div
        className="fixed z-10 data-label"
        style={{ bottom: 40, left: "calc(min(440px, 44vw) + 50%)", transform: "translateX(-50%)", color: "#b0956a", whiteSpace: "nowrap" }}
      >
        鼠标推动场域 / 点击投喂按钮召唤
      </div>
    </div>
  );
}
