/**
 * CatHuahua.tsx — 花花 | 活版印刷师
 * Design: Risograph letterpress — layered ink print aesthetic
 * Theme: Botanical green #3d9a5c + warm orange #ff7820 on cream #f2faf4
 * Layout: Floating editorial windows with Risograph chrome
 * Features: Ink stamp canvas, halftone animation, color layer selector, knowledge cards
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { getCatById } from "@/lib/cats";
import ParticleBackground from "@/components/ParticleBackground";

const cat = getCatById("huahua")!;

const RISO_COLORS = [
  { name: "植物绿", hex: "#3d9a5c", rgb: [61, 154, 92] },
  { name: "暖橙", hex: "#ff7820", rgb: [255, 120, 32] },
  { name: "深墨", hex: "#1a1a1a", rgb: [26, 26, 26] },
  { name: "玫瑰红", hex: "#e8402a", rgb: [232, 64, 42] },
  { name: "天蓝", hex: "#4488cc", rgb: [68, 136, 204] },
];

const PRINT_FACTS = [
  { title: "三花基因", content: "三花猫（Calico）的三色毛发是X染色体连锁遗传的结果，几乎全为雌性。" },
  { title: "印刷技艺", content: "花花的花纹如同精心设计的Risograph印刷，每一块色域都恰到好处，层次分明。" },
  { title: "艺术据点", content: "花花最爱蹲守在艺术楼门口，仿佛在审视每一件经过的艺术作品。" },
  { title: "色彩感知", content: "猫咪能看到蓝色和黄色，但无法区分红色和绿色——花花的世界是双色印刷的。" },
];

export default function CatHuahua() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<any>({});
  const [inkStamps, setInkStamps] = useState<Array<{ x: number; y: number; id: number; color: number[] }>>([]);
  const [stampCount, setStampCount] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [activeKnowledge, setActiveKnowledge] = useState(0);
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [printLayer, setPrintLayer] = useState<"all" | "green" | "orange" | "black">("all");

  useEffect(() => {
    let p5Instance: any;
    const initP5 = async () => {
      const p5 = (await import("p5")).default;

      const sketch = (p: any) => {
        let halftoneT = 0;
        let inkParticles: Array<{ x: number; y: number; vx: number; vy: number; life: number; color: number[]; size: number }> = [];
        let bgDots: Array<{ x: number; y: number; size: number; color: number[]; phase: number }> = [];
        let frameCount = 0;

        p.setup = () => {
          const cnv = p.createCanvas(p.windowWidth, p.windowHeight);
          cnv.parent(canvasRef.current!);
          cnv.style("position", "fixed");
          cnv.style("top", "0"); cnv.style("left", "0");
          cnv.style("pointer-events", "none");
          generateBgDots();
        };

        const generateBgDots = () => {
          bgDots = [];
          const spacing = 20;
          for (let x = 0; x < p.width; x += spacing) {
            for (let y = 0; y < p.height; y += spacing) {
              const n = p.noise(x * 0.007, y * 0.007);
              const colorIdx = Math.floor(n * 3);
              const colors = [[61, 154, 92], [255, 120, 32], [26, 26, 26]];
              bgDots.push({ x, y, size: n * 5 + 1, color: colors[colorIdx], phase: p.random(p.TWO_PI) });
            }
          }
        };

        p.draw = () => {
          p.background(242, 250, 244);
          halftoneT += 0.004;
          frameCount++;

          const layer = p5Ref.current._printLayer ?? "all";

          // Animated halftone background
          bgDots.forEach((dot, i) => {
            const pulse = p.sin(halftoneT + dot.phase) * 0.5 + 0.5;
            const show = layer === "all" ||
              (layer === "green" && dot.color[0] < 100) ||
              (layer === "orange" && dot.color[0] > 200) ||
              (layer === "black" && dot.color[0] < 50);
            if (!show) return;
            p.fill(dot.color[0], dot.color[1], dot.color[2], 16 + pulse * 14);
            p.noStroke();
            p.circle(dot.x, dot.y, dot.size * (0.8 + pulse * 0.4));
          });

          // Ink particles
          inkParticles = inkParticles.filter((ip) => ip.life > 0);
          inkParticles.forEach((ip) => {
            ip.x += ip.vx; ip.y += ip.vy;
            ip.vy += 0.06; ip.vx *= 0.97;
            ip.life -= 0.01; ip.size *= 0.99;
            p.fill(ip.color[0], ip.color[1], ip.color[2], ip.life * 200);
            p.noStroke();
            for (let j = 0; j < 3; j++) {
              p.circle(ip.x + p.random(-ip.size * 0.3, ip.size * 0.3), ip.y + p.random(-ip.size * 0.3, ip.size * 0.3), ip.size * p.random(0.5, 1.3));
            }
          });

          // Stamps
          const stamps = p5Ref.current._stamps ?? [];
          stamps.forEach((stamp: any) => {
            const offsets = [
              { dx: 3, dy: 2, color: [...stamp.color, 35] },
              { dx: -2, dy: 3, color: [61, 154, 92, 35] },
              { dx: 0, dy: 0, color: [...stamp.color, 180] },
            ];
            offsets.forEach(({ dx, dy, color }) => {
              p.fill(color[0], color[1], color[2], color[3]);
              p.noStroke();
              p.textSize(32);
              p.textAlign(p.CENTER, p.CENTER);
              p.text("🐾", stamp.x + dx, stamp.y + dy);
            });
          });

          // Mouse press ink drip
          if (p.mouseIsPressed) {
            const activeC = p5Ref.current._activeColor ?? [61, 154, 92];
            for (let i = 0; i < 5; i++) {
              inkParticles.push({
                x: p.mouseX + p.random(-10, 10),
                y: p.mouseY + p.random(-10, 10),
                vx: p.random(-2, 2),
                vy: p.random(-2.5, 0.5),
                life: 1,
                color: activeC,
                size: p.random(6, 20),
              });
            }
          }

          // Decorative letterpress border
          p.noFill();
          p.stroke(61, 154, 92, 28);
          p.strokeWeight(10);
          p.rect(16, 16, p.width - 32, p.height - 32);
          p.stroke(255, 120, 32, 18);
          p.strokeWeight(5);
          p.rect(26, 26, p.width - 52, p.height - 52);
          p.stroke(26, 26, 26, 12);
          p.strokeWeight(2);
          p.rect(34, 34, p.width - 68, p.height - 68);

          // Corner marks (registration marks)
          const corners = [[40, 40], [p.width - 40, 40], [40, p.height - 40], [p.width - 40, p.height - 40]];
          corners.forEach(([cx, cy]) => {
            p.stroke(26, 26, 26, 50);
            p.strokeWeight(1);
            p.line(cx - 8, cy, cx + 8, cy);
            p.line(cx, cy - 8, cx, cy + 8);
            p.noFill();
            p.circle(cx, cy, 8);
          });
        };

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
          generateBgDots();
        };
      };

      p5Instance = new p5(sketch);
    };
    initP5();
    return () => { if (p5Instance) p5Instance.remove(); };
  }, []);

  useEffect(() => {
    p5Ref.current._stamps = inkStamps;
    p5Ref.current._activeColor = RISO_COLORS[activeColor].rgb;
    p5Ref.current._printLayer = printLayer;
  }, [inkStamps, activeColor, printLayer]);

  const handleStamp = (e: React.MouseEvent) => {
    const newStamp = { x: e.clientX, y: e.clientY, id: stampCount, color: RISO_COLORS[activeColor].rgb };
    setInkStamps((prev) => [...prev.slice(-25), newStamp]);
    setStampCount((c) => c + 1);
  };

  const risoWindow = (title: string, dotColor: string, children: React.ReactNode, extraStyle?: React.CSSProperties) => (
    <div style={{ ...extraStyle }} onClick={(e) => e.stopPropagation()}>
      <div style={{ background: "#1a1a1a", padding: "4px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "#f2faf4", letterSpacing: "0.08em" }}>{title}</span>
        <div style={{ display: "flex", gap: 4 }}>
          {["#3d9a5c", "#ff7820", dotColor].map((c, i) => (
            <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
          ))}
        </div>
      </div>
      <div style={{ background: "rgba(242,250,244,0.94)", backdropFilter: "blur(10px)", border: "2px solid #1a1a1a", borderTop: "none", padding: "18px 20px" }}>
        {children}
      </div>
    </div>
  );

  const risoTitle = (text: string, size = "2rem") => (
    <div style={{ position: "relative", marginBottom: 12 }}>
      <div style={{ position: "absolute", top: 3, left: 3, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: size, color: "#ff7820", opacity: 0.4, lineHeight: 1 }}>{text}</div>
      <div style={{ position: "absolute", top: -2, left: -2, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: size, color: "#3d9a5c", opacity: 0.4, lineHeight: 1 }}>{text}</div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: size, color: "#1a1a1a", lineHeight: 1, position: "relative" }}>{text}</div>
    </div>
  );

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "#f2faf4", cursor: "crosshair" }} onClick={handleStamp}>
      <div ref={canvasRef} className="absolute inset-0 z-0" />
      <ParticleBackground color="#3d9a5c" />

      {/* Back */}
      <Link href="/" className="absolute top-5 left-5 z-30" onClick={(e) => e.stopPropagation()} style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, padding: "6px 14px", borderRadius: 0, background: "#f2faf4", border: "2px solid #3d9a5c", color: "#3d9a5c", textDecoration: "none", letterSpacing: "0.06em" }}>
        ← 返回
      </Link>

      {/* Profile card — top left */}
      {risoWindow("HUAHUA_PROFILE.RISO", "#e8402a",
        <>
          {risoTitle("花花\nHUA HUA")}
          <div style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "#2a4a2e", marginBottom: 10 }}>
            三花猫 · 活版印刷师 · 艺术楼常客
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {cat.tags.map((tag) => (
              <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", fontWeight: 700, padding: "2px 7px", border: "1.5px solid #3d9a5c", color: "#3d9a5c", letterSpacing: "0.06em" }}>{tag}</span>
            ))}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", fontWeight: 700, padding: "2px 7px", border: "1.5px solid #ff7820", color: "#ff7820", letterSpacing: "0.06em" }}>#{cat.number}</span>
          </div>
        </>,
        { position: "absolute", top: 48, left: 48, zIndex: 20, maxWidth: 300 }
      )}

      {/* Color selector — top right */}
      {risoWindow("INK_PALETTE.RISO", "#4488cc",
        <>
          <div className="data-label mb-2" style={{ color: "#3d9a5c" }}>油墨颜色选择</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {RISO_COLORS.map((c, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setActiveColor(i); }}
                style={{ width: 28, height: 28, borderRadius: "50%", background: c.hex, border: activeColor === i ? "3px solid #1a1a1a" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s", boxShadow: activeColor === i ? "2px 2px 0 #1a1a1a" : "none" }} />
            ))}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "#3d9a5c", marginBottom: 10 }}>
            当前: {RISO_COLORS[activeColor].name} · 已盖 {stampCount} 个印章
          </div>
          <div className="data-label mb-2" style={{ color: "#3d9a5c" }}>印刷层显示</div>
          <div style={{ display: "flex", gap: 5 }}>
            {(["all", "green", "orange", "black"] as const).map((layer) => (
              <button key={layer} onClick={(e) => { e.stopPropagation(); setPrintLayer(layer); }}
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", fontWeight: 700, padding: "3px 8px", border: "1.5px solid #1a1a1a", background: printLayer === layer ? "#1a1a1a" : "transparent", color: printLayer === layer ? "#f2faf4" : "#1a1a1a", cursor: "pointer", letterSpacing: "0.04em" }}>
                {layer === "all" ? "全层" : layer === "green" ? "绿" : layer === "orange" ? "橙" : "墨"}
              </button>
            ))}
          </div>
        </>,
        { position: "absolute", top: 48, right: 48, zIndex: 20, width: 260 }
      )}

      {/* Story card — bottom left */}
      {risoWindow("CAT_STORY.TXT", "#e8402a",
        <>
          {risoTitle("活版印刷\n的灵魂", "1.5rem")}
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "#2a4a2e", lineHeight: 1.7, marginBottom: 14 }}>
            {cat.description}
          </p>
          <button onClick={(e) => { e.stopPropagation(); setShowKnowledge(true); }}
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", fontWeight: 700, padding: "7px 16px", background: "#3d9a5c", color: "#f2faf4", border: "none", cursor: "pointer", letterSpacing: "0.06em", boxShadow: "2px 2px 0 #1a1a1a" }}>
            查看印刷档案
          </button>
        </>,
        { position: "absolute", bottom: 80, left: 48, zIndex: 20, maxWidth: 340 }
      )}

      {/* Stats card — bottom right */}
      {risoWindow("VITAL_STATS.DAT", "#ff7820",
        <>
          <div className="data-label mb-3" style={{ color: "#3d9a5c" }}>核心数据</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)", fontSize: "0.6rem" }}>
            <tbody>
              {cat.stats.map((s) => (
                <tr key={s.label} style={{ borderBottom: "1px solid rgba(61,154,92,0.15)" }}>
                  <td style={{ padding: "4px 0", color: "#6a8a6e" }}>{s.label}</td>
                  <td style={{ padding: "4px 0", color: "#1a1a1a", fontWeight: 700, textAlign: "right" }}>{s.value}{s.unit ? ` ${s.unit}` : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 10 }}>
            {cat.vitals.slice(0, 3).map((v) => (
              <div key={v.label} style={{ marginBottom: 7 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "0.56rem", marginBottom: 3, color: "#4a6a4e" }}>
                  <span>{v.label}</span>
                  <span style={{ color: v.color, fontWeight: 700 }}>{v.value}%</span>
                </div>
                <div style={{ height: 3, background: "rgba(61,154,92,0.12)", borderRadius: 0 }}>
                  <div style={{ height: "100%", width: `${v.value}%`, background: v.color, transition: "width 1.2s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </>,
        { position: "absolute", bottom: 80, right: 48, zIndex: 20, width: 240 }
      )}

      {/* Knowledge popup */}
      {showKnowledge && (
        <div className="absolute z-30" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 380 }} onClick={(e) => e.stopPropagation()}>
          <div style={{ background: "#1a1a1a", padding: "4px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#f2faf4", letterSpacing: "0.08em" }}>
              PRINT_ARCHIVE.RISO — {activeKnowledge + 1}/{PRINT_FACTS.length}
            </span>
            <button onClick={() => setShowKnowledge(false)} style={{ background: "none", border: "none", color: "#f2faf4", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>×</button>
          </div>
          <div style={{ background: "#f2faf4", border: "2px solid #1a1a1a", borderTop: "none", padding: "24px 26px" }}>
            {risoTitle(PRINT_FACTS[activeKnowledge].title, "1.6rem")}
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#1a1a1a", lineHeight: 1.7, marginBottom: 16 }}>
              {PRINT_FACTS[activeKnowledge].content}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setActiveKnowledge((k) => (k + 1) % PRINT_FACTS.length)}
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 700, padding: "6px 14px", background: "#3d9a5c", color: "#fff", border: "none", cursor: "pointer", boxShadow: "2px 2px 0 #1a1a1a" }}>
                下一条 →
              </button>
              <button onClick={() => setActiveKnowledge((k) => (k - 1 + PRINT_FACTS.length) % PRINT_FACTS.length)}
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 700, padding: "6px 14px", background: "transparent", color: "#3d9a5c", border: "1.5px solid #3d9a5c", cursor: "pointer" }}>
                ← 上一条
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hint */}
      <div className="absolute z-20 data-label" style={{ bottom: 28, left: "50%", transform: "translateX(-50%)", color: "#3d9a5c" }}>
        点击盖印章 · 按住拖动墨迹 · 切换油墨颜色
      </div>
    </div>
  );
}
