/**
 * CatXueqiu.tsx — 雪球 | 月光巡逻队
 * Design: Lunar crystal — eye tracking + moonlight particle constellation
 * Theme: Moonlight blue #4a90d9 on pale blue #f0f4ff
 * Layout: Full-screen p5 canvas + floating info panels
 * Features: Real-time eye tracking, star constellation, refraction calculator, night log
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { getCatById } from "@/lib/cats";

const cat = getCatById("xueqiu")!;

const NIGHT_LOG = [
  { time: "22:00", entry: "开始夜间巡逻，月光明亮，能见度极佳", phase: "🌕" },
  { time: "23:30", entry: "发现一只迷路的小刺猬，已护送至草丛", phase: "🌖" },
  { time: "01:00", entry: "在喷水池边静坐，观察水中月影", phase: "🌗" },
  { time: "02:45", entry: "与另一只流浪猫短暂对视，互不侵犯", phase: "🌘" },
  { time: "04:00", entry: "巡逻结束，返回宿舍楼门廊休息", phase: "🌑" },
];

export default function CatXueqiu() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activePanel, setActivePanel] = useState<"profile" | "log" | "refraction">("profile");
  const [refractionAngle, setRefractionAngle] = useState(30);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let p5Instance: any;
    const initP5 = async () => {
      const p5 = (await import("p5")).default;

      const sketch = (p: any) => {
        let stars: Array<{ x: number; y: number; size: number; twinkle: number; speed: number }> = [];
        let eyeX: number, eyeY: number;
        let eyeTargetX: number, eyeTargetY: number;
        let moonParticles: Array<{ x: number; y: number; vx: number; vy: number; life: number; size: number }> = [];
        let frameCounter = 0;

        p.setup = () => {
          const cnv = p.createCanvas(p.windowWidth, p.windowHeight);
          cnv.parent(canvasRef.current!);
          cnv.style("position", "absolute");
          cnv.style("top", "0"); cnv.style("left", "0");
          eyeX = eyeTargetX = p.width * 0.55;
          eyeY = eyeTargetY = p.height * 0.44;
          for (let i = 0; i < 180; i++) {
            stars.push({
              x: p.random(p.width),
              y: p.random(p.height),
              size: p.random(0.5, 3.5),
              twinkle: p.random(p.TWO_PI),
              speed: p.random(0.008, 0.035),
            });
          }
        };

        p.draw = () => {
          frameCounter++;
          // Sky gradient
          const bg = p.drawingContext as CanvasRenderingContext2D;
          const grad = bg.createLinearGradient(0, 0, 0, p.height);
          grad.addColorStop(0, "#e0eaf8");
          grad.addColorStop(0.5, "#dce8f5");
          grad.addColorStop(1, "#f0f4ff");
          bg.fillStyle = grad;
          bg.fillRect(0, 0, p.width, p.height);

          // Stars
          stars.forEach((star) => {
            star.twinkle += star.speed;
            const alpha = p.map(p.sin(star.twinkle), -1, 1, 50, 210);
            p.fill(74, 144, 217, alpha);
            p.noStroke();
            p.circle(star.x, star.y, star.size);
          });

          // Constellation lines
          p.stroke(74, 144, 217, 18);
          p.strokeWeight(0.5);
          for (let i = 0; i < stars.length - 1; i += 7) {
            const s1 = stars[i], s2 = stars[i + 1];
            if (s1 && s2 && p.dist(s1.x, s1.y, s2.x, s2.y) < 110) {
              p.line(s1.x, s1.y, s2.x, s2.y);
            }
          }

          // Moon
          const moonX = p.width * 0.82;
          const moonY = p.height * 0.18;
          const moonR = 55;
          for (let i = 5; i > 0; i--) {
            p.fill(74, 144, 217, 10 * i);
            p.noStroke();
            p.circle(moonX, moonY, moonR * 2 + i * 22);
          }
          p.fill(220, 235, 255, 240);
          p.noStroke();
          p.circle(moonX, moonY, moonR * 2);
          p.fill(190, 210, 240, 160);
          p.circle(moonX + moonR * 0.4, moonY, moonR * 1.7);

          // Moon particles
          if (frameCounter % 10 === 0) {
            moonParticles.push({
              x: moonX + p.random(-moonR, moonR),
              y: moonY + p.random(-moonR, moonR),
              vx: p.random(-0.4, 0.4),
              vy: p.random(-0.8, -0.1),
              life: 1,
              size: p.random(2, 5),
            });
          }
          moonParticles = moonParticles.filter((mp) => mp.life > 0);
          moonParticles.forEach((mp) => {
            mp.x += mp.vx;
            mp.y += mp.vy;
            mp.life -= 0.007;
            p.fill(180, 205, 240, mp.life * 100);
            p.noStroke();
            p.circle(mp.x, mp.y, mp.size * mp.life);
          });

          // Smooth eye tracking
          eyeTargetX = p.lerp(eyeTargetX, p.mouseX, 0.04);
          eyeTargetY = p.lerp(eyeTargetY, p.mouseY, 0.04);
          eyeX += (eyeTargetX - eyeX) * 0.07;
          eyeY += (eyeTargetY - eyeY) * 0.07;

          // Cat eyes
          const eyeOffsets = [-80, 80];
          const bg2 = p.drawingContext as CanvasRenderingContext2D;
          eyeOffsets.forEach((offset) => {
            const cx = p.width * 0.5 + offset;
            const cy = p.height * 0.44;
            const eyeW = 72, eyeH = 68;

            // Glow
            for (let i = 3; i > 0; i--) {
              p.fill(74, 144, 217, 14 * i);
              p.noStroke();
              p.ellipse(cx, cy, eyeW + i * 22, eyeH + i * 20);
            }

            // Sclera
            p.fill(230, 240, 255, 240);
            p.stroke(74, 144, 217, 55);
            p.strokeWeight(1.5);
            p.ellipse(cx, cy, eyeW, eyeH);

            // Iris gradient
            p.noStroke();
            const irisGrad = bg2.createRadialGradient(cx, cy, 0, cx, cy, 26);
            irisGrad.addColorStop(0, "rgba(30,90,180,1)");
            irisGrad.addColorStop(0.6, "rgba(50,120,210,1)");
            irisGrad.addColorStop(1, "rgba(20,60,140,1)");
            bg2.fillStyle = irisGrad;
            bg2.beginPath();
            bg2.ellipse(cx, cy, 26, 26, 0, 0, Math.PI * 2);
            bg2.fill();

            // Pupil follows mouse
            const angle = p.atan2(eyeY - cy, eyeX - cx);
            const dist = p.min(p.dist(eyeX, eyeY, cx, cy) * 0.12, 8);
            const px = cx + p.cos(angle) * dist;
            const py = cy + p.sin(angle) * dist;

            const pupilH = p.map(p.dist(p.mouseX, p.mouseY, cx, cy), 0, p.width * 0.5, 4, 42);
            p.fill(5, 15, 40, 240);
            p.noStroke();
            p.ellipse(px, py, 7, p.constrain(pupilH, 4, 42));

            // Highlights
            p.fill(255, 255, 255, 200);
            p.circle(px - 5, py - 6, 8);
            p.fill(255, 255, 255, 100);
            p.circle(px + 6, py + 5, 4);

            // Refraction rays
            const rayAlpha = 20 + p.sin(frameCounter * 0.04) * 12;
            p.stroke(74, 144, 217, rayAlpha);
            p.strokeWeight(0.7);
            for (let i = 0; i < 8; i++) {
              const rayAngle = (i / 8) * p.TWO_PI + frameCounter * 0.008;
              p.line(cx, cy, cx + p.cos(rayAngle) * 65, cy + p.sin(rayAngle) * 65);
            }
          });

          // Nose
          p.fill(200, 140, 160, 200);
          p.noStroke();
          p.triangle(p.width * 0.5, p.height * 0.52, p.width * 0.5 - 8, p.height * 0.52 + 12, p.width * 0.5 + 8, p.height * 0.52 + 12);

          // Whiskers
          p.stroke(100, 140, 200, 100);
          p.strokeWeight(1);
          const whiskers = [
            [p.width * 0.5 - 20, p.height * 0.535, p.width * 0.5 - 120, p.height * 0.525],
            [p.width * 0.5 - 20, p.height * 0.545, p.width * 0.5 - 120, p.height * 0.555],
            [p.width * 0.5 - 20, p.height * 0.555, p.width * 0.5 - 110, p.height * 0.575],
            [p.width * 0.5 + 20, p.height * 0.535, p.width * 0.5 + 120, p.height * 0.525],
            [p.width * 0.5 + 20, p.height * 0.545, p.width * 0.5 + 120, p.height * 0.555],
            [p.width * 0.5 + 20, p.height * 0.555, p.width * 0.5 + 110, p.height * 0.575],
          ];
          whiskers.forEach(([x1, y1, x2, y2]) => p.line(x1, y1, x2, y2));

          // Mouse hover ripple
          if (p.dist(p.mouseX, p.mouseY, p.width * 0.5, p.height * 0.44) < 150) {
            const rippleR = p.dist(p.mouseX, p.mouseY, p.width * 0.5, p.height * 0.44);
            p.stroke(74, 144, 217, 35);
            p.strokeWeight(1);
            p.noFill();
            p.circle(p.width * 0.5, p.height * 0.44, rippleR * 2 + p.sin(frameCounter * 0.1) * 12);
          }
        };

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
      };

      p5Instance = new p5(sketch);
    };
    initP5();
    return () => { if (p5Instance) p5Instance.remove(); };
  }, []);

  const nightHour = time.getHours();
  const isNight = nightHour >= 22 || nightHour < 6;
  const n1 = 1.0;
  const n2 = 1.336;
  const refractedAngle = Math.asin((n1 / n2) * Math.sin((refractionAngle * Math.PI) / 180)) * (180 / Math.PI);

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "#f0f4ff" }}>
      <div ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Back button */}
      <Link href="/" className="absolute top-6 right-6 z-30" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", padding: "8px 18px", borderRadius: 100, background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(74,144,217,0.2)", color: "#2060a0", textDecoration: "none" }}>
        ← 返回
      </Link>

      {/* Title */}
      <div className="absolute top-8 left-8 z-20">
        <div className="data-label mb-2" style={{ color: "#4a90d9" }}>// 档案 #{cat.number} / {cat.role}</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.8rem, 5.5vw, 5rem)", lineHeight: 0.88, color: "#1a2a4a", letterSpacing: "-0.03em" }}>
          XUEQIU
        </h1>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", color: "#4a90d9", marginTop: 4 }}>雪 球</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: isNight ? "#4a90d9" : "#8a9ab0", fontWeight: 700, marginTop: 8 }}>
          {isNight ? "● 巡逻中" : "○ 休息中"} · {time.toLocaleTimeString("zh-CN")}
        </div>
      </div>

      {/* Panel switcher */}
      <div className="absolute top-8 left-1/2 z-20 flex gap-2" style={{ transform: "translateX(-50%)" }}>
        {(["profile", "log", "refraction"] as const).map((panel) => (
          <button key={panel} onClick={() => setActivePanel(panel)} style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em", padding: "6px 14px", borderRadius: 100, border: "1px solid rgba(74,144,217,0.3)", background: activePanel === panel ? "#4a90d9" : "rgba(240,244,255,0.85)", color: activePanel === panel ? "#fff" : "#4a90d9", cursor: "pointer", backdropFilter: "blur(8px)", transition: "all 0.2s" }}>
            {panel === "profile" ? "档案" : panel === "log" ? "夜行日志" : "折射仪"}
          </button>
        ))}
      </div>

      {/* Left bottom panel */}
      <div className="glass-panel rounded-2xl absolute z-20" style={{ left: 32, bottom: 32, width: 260, padding: "18px 20px", border: "1px solid rgba(74,144,217,0.2)" }}>
        {activePanel === "profile" && (
          <>
            <div className="data-label mb-3" style={{ color: "#4a90d9" }}>档案编号 #{cat.number}</div>
            {cat.stats.map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(74,144,217,0.08)", fontFamily: "var(--font-mono)", fontSize: "0.6rem" }}>
                <span style={{ color: "#6080a0" }}>{s.label}</span>
                <span style={{ color: "#1a2a4a", fontWeight: 700 }}>{s.value}{s.unit ? ` ${s.unit}` : ""}</span>
              </div>
            ))}
            <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 5 }}>
              {cat.tags.map((tag) => (
                <span key={tag} className="tag-pill" style={{ background: "rgba(74,144,217,0.1)", color: "#4a90d9" }}>{tag}</span>
              ))}
            </div>
          </>
        )}
        {activePanel === "log" && (
          <>
            <div className="data-label mb-3" style={{ color: "#4a90d9" }}>夜行日志 · 今夜</div>
            {NIGHT_LOG.map((entry, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "6px 0", borderBottom: i < NIGHT_LOG.length - 1 ? "1px solid rgba(74,144,217,0.08)" : "none", alignItems: "flex-start" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", color: "#4a90d9", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{entry.time}</div>
                <div style={{ fontSize: "0.8rem", flexShrink: 0 }}>{entry.phase}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.66rem", color: "#2a3460", lineHeight: 1.4 }}>{entry.entry}</div>
              </div>
            ))}
          </>
        )}
        {activePanel === "refraction" && (
          <>
            <div className="data-label mb-3" style={{ color: "#4a90d9" }}>猫眼折射仪 · 斯涅尔定律</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "#5a6a90", marginBottom: 10 }}>n₁ sin θ₁ = n₂ sin θ₂</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#4a90d9", marginBottom: 5 }}>
                <span>入射角 θ₁</span>
                <span style={{ fontWeight: 700 }}>{refractionAngle}°</span>
              </div>
              <input type="range" min={0} max={89} value={refractionAngle} onChange={(e) => setRefractionAngle(Number(e.target.value))} style={{ width: "100%", accentColor: "#4a90d9" }} />
            </div>
            <div style={{ background: "rgba(74,144,217,0.08)", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "0.58rem", marginBottom: 5 }}>
                <span style={{ color: "#5a6a90" }}>空气折射率 n₁</span>
                <span style={{ color: "#1a2040", fontWeight: 700 }}>1.000</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "0.58rem", marginBottom: 5 }}>
                <span style={{ color: "#5a6a90" }}>猫眼折射率 n₂</span>
                <span style={{ color: "#4a90d9", fontWeight: 700 }}>1.336</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "0.58rem" }}>
                <span style={{ color: "#5a6a90" }}>折射角 θ₂</span>
                <span style={{ color: "#1a2040", fontWeight: 700 }}>{refractedAngle.toFixed(2)}°</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right description */}
      <div className="glass-panel rounded-2xl absolute z-20" style={{ right: 32, top: "50%", transform: "translateY(-50%)", width: 240, padding: "20px 22px", border: "1px solid rgba(74,144,217,0.2)" }}>
        <div className="data-label mb-3" style={{ color: "#4a90d9" }}>档案描述</div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.74rem", color: "#2a3a5a", lineHeight: 1.7, margin: 0 }}>{cat.description}</p>
      </div>

      {/* Bottom right vitals */}
      <div className="glass-panel rounded-2xl absolute z-20" style={{ right: 32, bottom: 32, width: 240, padding: "18px 20px", border: "1px solid rgba(74,144,217,0.2)" }}>
        <div className="data-label mb-3" style={{ color: "#4a90d9" }}>状态监测</div>
        {cat.vitals.map((v) => (
          <div key={v.label} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "0.58rem", marginBottom: 3, color: "#4a6080" }}>
              <span>{v.label}</span>
              <span style={{ color: v.color, fontWeight: 700 }}>{v.value}%</span>
            </div>
            <div style={{ height: 3, background: "rgba(74,144,217,0.15)", borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${v.value}%`, background: v.color, borderRadius: 2, transition: "width 1.2s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Hint */}
      <div className="absolute z-20 data-label" style={{ bottom: 16, left: "50%", transform: "translateX(-50%)", color: "#4a90d9" }}>
        移动鼠标 · 雪球的眼睛会追踪你
      </div>
    </div>
  );
}
