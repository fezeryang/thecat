/**
 * CatTiaowen.tsx — 条纹 | 地形拓扑者
 * Design: Topographic terrain — particle field forms cat silhouette
 * Theme: Moss green #5a8a5e on natural cream #f2f7f2
 * Layout: Full canvas + left HUD + right panel
 * Features: Perlin noise terrain, particle cat, noise scale control, exploration log
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { getCatById } from "@/lib/cats";

const cat = getCatById("tiaowen")!;

const EXPLORE_LOG = [
  { zone: "北草坪", status: "已探索", coverage: 98, icon: "🌿" },
  { zone: "南操场", status: "已探索", coverage: 87, icon: "⚽" },
  { zone: "东湖边", status: "探索中", coverage: 64, icon: "🌊" },
  { zone: "西树林", status: "未探索", coverage: 12, icon: "🌲" },
  { zone: "中央广场", status: "已探索", coverage: 95, icon: "🏛️" },
];

const TERRAIN_STATS = [
  { label: "海拔差", value: "12.4m", icon: "⛰️" },
  { label: "领地面积", value: "3.2km²", icon: "📐" },
  { label: "地形复杂度", value: "7.8/10", icon: "🗺️" },
  { label: "巡逻路线", value: "14条", icon: "🛤️" },
];

export default function CatTiaowen() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [exploded, setExploded] = useState(false);
  const [noiseScale, setNoiseScale] = useState(0.004);
  const [activePanel, setActivePanel] = useState<"stats" | "explore" | "terrain">("stats");
  const p5Ref = useRef<any>(null);

  useEffect(() => {
    let p5Instance: any;
    const initP5 = async () => {
      const p5 = (await import("p5")).default;

      const sketch = (p: any) => {
        const NUM_PARTICLES = 380;
        let particles: Array<{
          x: number; y: number; tx: number; ty: number;
          vx: number; vy: number; size: number; brightness: number; exploded: boolean;
        }> = [];
        let isExploded = false;
        let noiseT = 0;
        let contourLines: Array<Array<{ x: number; y: number }>> = [];
        let currentNoiseScale = 0.004;

        const catShape = [
          [0.5, 0.62], [0.42, 0.58], [0.36, 0.52], [0.34, 0.44], [0.36, 0.36],
          [0.42, 0.30], [0.50, 0.28], [0.58, 0.30], [0.64, 0.36], [0.66, 0.44],
          [0.64, 0.52], [0.58, 0.58], [0.50, 0.62],
          [0.44, 0.28], [0.40, 0.22], [0.36, 0.16], [0.40, 0.12], [0.44, 0.18],
          [0.50, 0.20], [0.56, 0.18], [0.60, 0.12], [0.64, 0.16], [0.60, 0.22], [0.56, 0.28],
          [0.64, 0.62], [0.70, 0.68], [0.76, 0.72], [0.80, 0.68], [0.78, 0.62],
          [0.72, 0.60], [0.66, 0.62],
          [0.42, 0.62], [0.40, 0.72], [0.38, 0.80], [0.42, 0.82], [0.46, 0.78],
          [0.46, 0.70], [0.54, 0.70], [0.54, 0.78], [0.58, 0.82], [0.62, 0.80],
          [0.60, 0.72], [0.58, 0.62],
          [0.48, 0.40], [0.52, 0.40], [0.46, 0.46], [0.54, 0.46],
          [0.48, 0.52], [0.52, 0.52], [0.50, 0.35], [0.47, 0.44], [0.53, 0.44],
        ];

        p.setup = () => {
          const cnv = p.createCanvas(p.windowWidth, p.windowHeight);
          cnv.parent(canvasRef.current!);
          cnv.style("position", "absolute");
          cnv.style("top", "0"); cnv.style("left", "0");
          initParticles();
          generateContours();
        };

        const initParticles = () => {
          particles = [];
          const offsetX = p.width * 0.12;
          const scaleW = p.width * 0.76;
          const scaleH = p.height * 0.88;
          const offsetY = p.height * 0.06;
          for (let i = 0; i < NUM_PARTICLES; i++) {
            const shapeIdx = i % catShape.length;
            const [nx, ny] = catShape[shapeIdx];
            const jitter = 10;
            const tx = offsetX + nx * scaleW + p.random(-jitter, jitter);
            const ty = offsetY + ny * scaleH + p.random(-jitter, jitter);
            particles.push({
              x: p.random(p.width),
              y: p.random(p.height),
              tx, ty,
              vx: 0, vy: 0,
              size: p.random(3, 9),
              brightness: p.random(0.7, 1.0),
              exploded: false,
            });
          }
        };

        const generateContours = () => {
          contourLines = [];
          const levels = 10;
          for (let l = 0; l < levels; l++) {
            const threshold = l / levels;
            const line: Array<{ x: number; y: number }> = [];
            const step = 16;
            for (let x = 0; x < p.width; x += step) {
              for (let y = 0; y < p.height; y += step) {
                const n = p.noise(x * currentNoiseScale, y * currentNoiseScale);
                if (Math.abs(n - threshold) < 0.025) {
                  line.push({ x, y });
                }
              }
            }
            contourLines.push(line);
          }
        };

        p.draw = () => {
          p.background(242, 247, 242);
          noiseT += 0.003;

          // Update noise scale from React state
          const newScale = p5Ref.current?._noiseScale ?? 0.004;
          if (Math.abs(newScale - currentNoiseScale) > 0.0001) {
            currentNoiseScale = newScale;
            generateContours();
          }

          // Topographic contours
          const contourColors = [
            [90, 138, 94], [80, 128, 84], [70, 118, 74],
            [100, 148, 104], [110, 158, 114], [120, 168, 124],
            [60, 108, 64], [130, 178, 134], [140, 188, 144], [150, 198, 154],
          ];
          contourLines.forEach((line, li) => {
            const c = contourColors[li % contourColors.length];
            p.stroke(c[0], c[1], c[2], 38);
            p.strokeWeight(0.8);
            p.noFill();
            if (line.length > 2) {
              p.beginShape();
              line.forEach((pt) => {
                const nx = p.noise(pt.x * 0.003, pt.y * 0.003, noiseT);
                const ny = p.noise(pt.x * 0.003 + 100, pt.y * 0.003, noiseT);
                p.curveVertex(pt.x + nx * 10, pt.y + ny * 10);
              });
              p.endShape();
            }
          });

          // Elevation gradient overlay
          for (let x = 0; x < p.width; x += 30) {
            for (let y = 0; y < p.height; y += 30) {
              const n = p.noise(x * currentNoiseScale, y * currentNoiseScale, noiseT * 0.3);
              const green = p.map(n, 0, 1, 60, 140);
              p.fill(90, green, 80, n * 12);
              p.noStroke();
              p.rect(x, y, 30, 30);
            }
          }

          // Particles
          const explodedState = p5Ref.current?._exploded ?? false;
          isExploded = explodedState;

          particles.forEach((pt) => {
            if (isExploded) {
              if (!pt.exploded) {
                const angle = p.atan2(pt.y - p.height / 2, pt.x - p.width / 2);
                const speed = p.random(3, 14);
                pt.vx = p.cos(angle) * speed;
                pt.vy = p.sin(angle) * speed;
                pt.exploded = true;
              }
              pt.vx *= 0.96;
              pt.vy *= 0.96;
              pt.vy += 0.1;
            } else {
              pt.exploded = false;
              const dx = pt.tx - pt.x;
              const dy = pt.ty - pt.y;
              pt.vx += dx * 0.06;
              pt.vy += dy * 0.06;
              pt.vx *= 0.87;
              pt.vy *= 0.87;
              const md = p.dist(p.mouseX, p.mouseY, pt.x, pt.y);
              if (md < 90) {
                const ang = p.atan2(pt.y - p.mouseY, pt.x - p.mouseX);
                const push = p.map(md, 0, 90, 2.5, 0);
                pt.vx += p.cos(ang) * push;
                pt.vy += p.sin(ang) * push;
              }
            }
            pt.x += pt.vx;
            pt.y += pt.vy;

            const n = p.noise(pt.x * 0.01, pt.y * 0.01, noiseT);
            const green = p.map(n, 0, 1, 80, 145);
            const alpha = isExploded ? p.map(pt.vx * pt.vx + pt.vy * pt.vy, 0, 50, 180, 50) : 210;
            p.noStroke();
            p.fill(85, green, 88, alpha);
            p.circle(pt.x, pt.y, pt.size * pt.brightness);
          });

          // Mouse cursor ring
          p.noFill();
          p.stroke(90, 138, 94, 70);
          p.strokeWeight(1.2);
          p.circle(p.mouseX, p.mouseY, 44);
          p.stroke(90, 138, 94, 35);
          p.circle(p.mouseX, p.mouseY, 80);

          // Compass rose
          const cx = p.width - 60, cy = 60;
          p.stroke(90, 138, 94, 80);
          p.strokeWeight(1);
          p.noFill();
          p.circle(cx, cy, 40);
          p.fill(90, 138, 94, 100);
          p.noStroke();
          const dirs = [["N", 0], ["E", 90], ["S", 180], ["W", 270]];
          dirs.forEach(([label, deg]) => {
            const rad = (Number(deg) - 90) * p.PI / 180;
            const tx = cx + p.cos(rad) * 16;
            const ty = cy + p.sin(rad) * 16;
            p.textSize(7);
            p.textAlign(p.CENTER, p.CENTER);
            p.textFont("monospace");
            p.text(String(label), tx, ty);
          });
        };

        p5Ref.current = p;

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
          initParticles();
          generateContours();
        };
      };

      p5Instance = new p5(sketch);
    };
    initP5();
    return () => {
      if (p5Instance) p5Instance.remove();
      p5Ref.current = null;
    };
  }, []);

  // Sync state to p5
  useEffect(() => {
    if (p5Ref.current) {
      p5Ref.current._exploded = exploded;
      p5Ref.current._noiseScale = noiseScale;
    }
  }, [exploded, noiseScale]);

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "#f2f7f2" }}>
      <div ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Back */}
      <Link href="/" className="absolute top-6 right-6 z-30" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, padding: "8px 18px", borderRadius: 100, background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(90,138,94,0.2)", color: "#3a6a3e", textDecoration: "none", letterSpacing: "0.06em" }}>
        ← 返回
      </Link>

      {/* Title */}
      <div className="absolute top-8 left-8 z-20">
        <div className="data-label mb-1" style={{ color: "#5a8a5e" }}>// 档案 #{cat.number} / {cat.role}</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(3rem, 5.5vw, 5rem)", lineHeight: 0.88, color: "#1a2a1a", letterSpacing: "-0.03em" }}>
          TIAO<br />WEN
        </h1>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.4rem", color: "#5a8a5e", marginTop: 4 }}>条 纹</div>
      </div>

      {/* Left bottom panel */}
      <div className="absolute z-20" style={{ left: 32, bottom: 32, width: "min(320px, 32vw)", background: "rgba(242,247,242,0.88)", backdropFilter: "blur(14px)", borderRadius: 16, border: "1px solid rgba(90,138,94,0.18)", padding: "18px 20px" }}>
        {/* Panel tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {(["stats", "explore", "terrain"] as const).map((panel) => (
            <button key={panel} onClick={() => setActivePanel(panel)} style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.06em", padding: "5px 10px", borderRadius: 100, border: "none", background: activePanel === panel ? "#5a8a5e" : "rgba(90,138,94,0.1)", color: activePanel === panel ? "#fff" : "#5a8a5e", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 }}>
              {panel === "stats" ? "档案" : panel === "explore" ? "探索" : "地形"}
            </button>
          ))}
        </div>

        {activePanel === "stats" && (
          <>
            <div className="data-label mb-3" style={{ color: "#5a8a5e" }}>核心档案</div>
            {cat.stats.map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(90,138,94,0.08)", fontFamily: "var(--font-mono)", fontSize: "0.6rem" }}>
                <span style={{ color: "#6a8a6e" }}>{s.label}</span>
                <span style={{ color: "#1a2a1a", fontWeight: 700 }}>{s.value}{s.unit ? ` ${s.unit}` : ""}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 5 }}>
              {cat.tags.map((tag) => (
                <span key={tag} className="tag-pill" style={{ background: "rgba(90,138,94,0.1)", color: "#5a8a5e" }}>{tag}</span>
              ))}
            </div>
          </>
        )}

        {activePanel === "explore" && (
          <>
            <div className="data-label mb-3" style={{ color: "#5a8a5e" }}>领地探索记录</div>
            {EXPLORE_LOG.map((item, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: "0.9rem" }}>{item.icon}</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#1a2a1a", fontWeight: 600 }}>{item.zone}</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: item.status === "已探索" ? "#5a8a5e" : item.status === "探索中" ? "#8a9a5e" : "#aaa", fontWeight: 700 }}>{item.status}</span>
                </div>
                <div style={{ height: 4, background: "rgba(90,138,94,0.12)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${item.coverage}%`, background: item.status === "已探索" ? "#5a8a5e" : item.status === "探索中" ? "#8a9a5e" : "#ccc", borderRadius: 2, transition: "width 1s ease" }} />
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: "#8aaa8e", marginTop: 2 }}>{item.coverage}%</div>
              </div>
            ))}
          </>
        )}

        {activePanel === "terrain" && (
          <>
            <div className="data-label mb-3" style={{ color: "#5a8a5e" }}>地形参数控制</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#5a8a5e", marginBottom: 5 }}>
                <span>地形频率</span>
                <span style={{ fontWeight: 700 }}>{(noiseScale * 1000).toFixed(1)}</span>
              </div>
              <input type="range" min={1} max={12} step={0.5} value={noiseScale * 1000} onChange={(e) => setNoiseScale(Number(e.target.value) / 1000)} style={{ width: "100%", accentColor: "#5a8a5e" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {TERRAIN_STATS.map((ts) => (
                <div key={ts.label} style={{ background: "rgba(90,138,94,0.08)", borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: "1rem", marginBottom: 2 }}>{ts.icon}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: "#6a8a6e" }}>{ts.label}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "#1a2a1a", fontWeight: 700 }}>{ts.value}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right panel */}
      <div className="absolute z-20" style={{ right: 32, top: "50%", transform: "translateY(-50%)", width: "min(220px, 22vw)", background: "rgba(242,247,242,0.88)", backdropFilter: "blur(14px)", borderRadius: 16, border: "1px solid rgba(90,138,94,0.18)", padding: "18px 20px" }}>
        <div className="data-label mb-3" style={{ color: "#5a8a5e" }}>状态监测</div>
        {cat.vitals.map((v) => (
          <div key={v.label} style={{ marginBottom: 9 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "0.58rem", marginBottom: 3, color: "#4a6a4e" }}>
              <span>{v.label}</span>
              <span style={{ color: v.color, fontWeight: 700 }}>{v.value}%</span>
            </div>
            <div style={{ height: 3, background: "rgba(90,138,94,0.12)", borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${v.value}%`, background: v.color, borderRadius: 2, transition: "width 1.2s ease" }} />
            </div>
          </div>
        ))}
        <div style={{ marginTop: 12, fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "#2a3a2a", lineHeight: 1.6 }}>
          {cat.description.slice(0, 80)}...
        </div>
      </div>

      {/* Explode button */}
      <button
        onClick={() => setExploded((e) => !e)}
        className="absolute z-20"
        style={{ bottom: 32, right: 32, padding: "12px 22px", borderRadius: 100, border: "none", background: exploded ? "#1a2a1a" : "#5a8a5e", color: "#fff", fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer", boxShadow: exploded ? "0 4px 20px rgba(26,42,26,0.3)" : "0 4px 20px rgba(90,138,94,0.4)", transition: "all 0.3s" }}>
        {exploded ? "🔄 重组粒子" : "💥 扰动场域"}
      </button>

      {/* Hint */}
      <div className="absolute z-10 data-label" style={{ bottom: 16, left: "50%", transform: "translateX(-50%)", color: "#5a8a5e" }}>
        悬停推动粒子 · 点击扰动场域
      </div>
    </div>
  );
}
