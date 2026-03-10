/**
 * CatMomo.tsx — 墨墨 | 棱镜折光师
 * Design: Prism rainbow fluid — black cat with rainbow light refraction
 * Theme: Purple #7c6bff on lavender #f4f0ff
 * Layout: Full-screen canvas + left sidebar + floating panels
 * Features: Rainbow fluid cat, prism spectrum analyzer, velocity tracker, toy launcher
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "wouter";
import ParticleBackground from "@/components/ParticleBackground";
import { getCatById } from "@/lib/cats";

const cat = getCatById("momo")!;

const SPECTRUM_COLORS = [
  { name: "红", wavelength: 700, hex: "#ff4444" },
  { name: "橙", wavelength: 620, hex: "#ff8800" },
  { name: "黄", wavelength: 580, hex: "#ffdd00" },
  { name: "绿", wavelength: 530, hex: "#44cc44" },
  { name: "蓝", wavelength: 470, hex: "#4488ff" },
  { name: "靛", wavelength: 445, hex: "#4444cc" },
  { name: "紫", wavelength: 400, hex: "#8844cc" },
];

const MOMO_FACTS = [
  { icon: "⚡", label: "最高速度", value: "12.4 m/s" },
  { icon: "🌈", label: "折光系数", value: "7.2 λ" },
  { icon: "🎯", label: "追踪精度", value: "99.7%" },
  { icon: "🌑", label: "隐身时长", value: "∞" },
];

export default function CatMomo() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [toyCount, setToyCount] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [activeTab, setActiveTab] = useState<"stats" | "spectrum" | "facts">("stats");
  const p5Ref = useRef<any>(null);
  const lastMouseRef = useRef({ x: 0, y: 0, time: 0 });

  const launchToy = useCallback(() => {
    setToyCount((c) => c + 1);
    if (p5Ref.current) {
      p5Ref.current._launchToy = true;
      setTimeout(() => { if (p5Ref.current) p5Ref.current._launchToy = false; }, 100);
    }
  }, []);

  useEffect(() => {
    const trackSpeed = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastMouseRef.current.time;
      if (dt > 0) {
        const dx = e.clientX - lastMouseRef.current.x;
        const dy = e.clientY - lastMouseRef.current.y;
        const spd = Math.sqrt(dx * dx + dy * dy) / dt * 100;
        setSpeed(Math.min(Math.round(spd), 999));
      }
      lastMouseRef.current = { x: e.clientX, y: e.clientY, time: now };
    };
    window.addEventListener("mousemove", trackSpeed);
    return () => window.removeEventListener("mousemove", trackSpeed);
  }, []);

  useEffect(() => {
    let p5Instance: any;
    const initP5 = async () => {
      const p5 = (await import("p5")).default;

      const sketch = (p: any) => {
        let catX: number, catY: number;
        let catVX = 0, catVY = 0;
        let rainbowTrail: Array<{ x: number; y: number; hue: number; size: number; life: number }> = [];
        let toys: Array<{ x: number; y: number; vx: number; vy: number; type: number; angle: number }> = [];
        let prismParticles: Array<{ x: number; y: number; vx: number; vy: number; hue: number; life: number; size: number }> = [];
        let frameCounter = 0;
        let hueShift = 0;

        p.setup = () => {
          const cnv = p.createCanvas(p.windowWidth, p.windowHeight);
          cnv.parent(canvasRef.current!);
          cnv.style("position", "absolute");
          cnv.style("top", "0"); cnv.style("left", "0");
          catX = p.width * 0.6;
          catY = p.height * 0.45;
          p.colorMode(p.HSB, 360, 100, 100, 100);
        };

        p.draw = () => {
          frameCounter++;
          hueShift = (hueShift + 0.8) % 360;
          p.background(270, 25, 96);

          // Ambient prism light beams
          for (let i = 0; i < 7; i++) {
            const hue = (hueShift + i * 51) % 360;
            const beamX = p.width * 0.7 + p.sin(frameCounter * 0.01 + i) * 80;
            p.stroke(hue, 60, 90, 8);
            p.strokeWeight(30);
            p.line(beamX, 0, beamX + p.sin(frameCounter * 0.008 + i) * 40, p.height);
          }

          // Cat movement — chase mouse
          const dx = p.mouseX - catX;
          const dy = p.mouseY - catY;
          const dist = p.sqrt(dx * dx + dy * dy);
          if (dist > 5) {
            const spd = p.map(dist, 0, 400, 0, 8);
            catVX += (dx / dist) * spd * 0.15;
            catVY += (dy / dist) * spd * 0.15;
          }
          catVX *= 0.88;
          catVY *= 0.88;
          catX += catVX;
          catY += catVY;

          // Rainbow trail
          if (frameCounter % 2 === 0) {
            rainbowTrail.push({
              x: catX + p.random(-8, 8),
              y: catY + p.random(-8, 8),
              hue: hueShift,
              size: p.random(8, 20),
              life: 1,
            });
          }
          rainbowTrail = rainbowTrail.filter((t) => t.life > 0);
          rainbowTrail.forEach((t) => {
            t.life -= 0.025;
            p.fill(t.hue, 80, 90, t.life * 120);
            p.noStroke();
            p.circle(t.x, t.y, t.size * t.life);
          });

          // Toys
          const launchToyFlag = p5Ref.current?._launchToy;
          if (launchToyFlag) {
            toys.push({
              x: p.random(p.width * 0.15, p.width * 0.55),
              y: p.random(p.height * 0.2, p.height * 0.8),
              vx: p.random(-1.5, 1.5),
              vy: p.random(-1.5, 1.5),
              type: Math.floor(p.random(3)),
              angle: 0,
            });
          }
          toys.forEach((toy, idx) => {
            toy.x += toy.vx;
            toy.y += toy.vy;
            toy.angle += 0.05;
            if (toy.x < 0 || toy.x > p.width) toy.vx *= -1;
            if (toy.y < 0 || toy.y > p.height) toy.vy *= -1;

            p.push();
            p.translate(toy.x, toy.y);
            p.rotate(toy.angle);
            const toyHue = (hueShift + idx * 60) % 360;
            p.fill(toyHue, 80, 95, 90);
            p.noStroke();
            if (toy.type === 0) {
              p.circle(0, 0, 18);
              p.fill(toyHue, 40, 100, 60);
              p.circle(-3, -3, 6);
            } else if (toy.type === 1) {
              for (let i = 0; i < 5; i++) {
                const a = (i / 5) * p.TWO_PI - p.HALF_PI;
                const bAngle = a + p.PI / 5;
                p.triangle(p.cos(a) * 12, p.sin(a) * 12, p.cos(bAngle) * 5, p.sin(bAngle) * 5, p.cos(a + p.TWO_PI / 5) * 12, p.sin(a + p.TWO_PI / 5) * 12);
              }
            } else {
              p.ellipse(0, 0, 8, 22);
              p.fill(toyHue, 60, 100, 50);
              p.ellipse(0, 0, 4, 18);
            }
            p.pop();

            // Cat catches toy
            const tdx = toy.x - catX;
            const tdy = toy.y - catY;
            if (p.sqrt(tdx * tdx + tdy * tdy) < 30) {
              for (let i = 0; i < 12; i++) {
                const angle = (i / 12) * p.TWO_PI;
                prismParticles.push({ x: toy.x, y: toy.y, vx: p.cos(angle) * p.random(2, 5), vy: p.sin(angle) * p.random(2, 5), hue: (hueShift + i * 30) % 360, life: 1, size: p.random(4, 10) });
              }
              toys.splice(idx, 1);
            }
          });

          // Prism burst particles
          prismParticles = prismParticles.filter((pp) => pp.life > 0);
          prismParticles.forEach((pp) => {
            pp.x += pp.vx; pp.y += pp.vy;
            pp.vx *= 0.95; pp.vy *= 0.95;
            pp.life -= 0.02;
            p.fill(pp.hue, 80, 95, pp.life * 100);
            p.noStroke();
            p.circle(pp.x, pp.y, pp.size * pp.life);
          });

          // Cat body glow
          for (let i = 4; i > 0; i--) {
            const glowHue = (hueShift + i * 25) % 360;
            p.fill(glowHue, 70, 90, 10 * i);
            p.noStroke();
            p.ellipse(catX, catY, 160 + i * 20, 130 + i * 15);
          }

          // Cat body — black
          p.fill(10, 5, 12, 100);
          p.noStroke();
          p.ellipse(catX, catY, 140, 115);

          // Ears
          p.fill(15, 5, 18, 100);
          p.triangle(catX - 50, catY - 45, catX - 25, catY - 80, catX - 10, catY - 42);
          p.triangle(catX + 50, catY - 45, catX + 25, catY - 80, catX + 10, catY - 42);
          const earHue = (hueShift + 180) % 360;
          p.fill(earHue, 60, 80, 60);
          p.triangle(catX - 44, catY - 47, catX - 27, catY - 72, catX - 14, catY - 45);
          p.triangle(catX + 44, catY - 47, catX + 27, catY - 72, catX + 14, catY - 45);

          // Eyes — glowing green
          p.fill(120, 90, 95, 100);
          p.noStroke();
          p.ellipse(catX - 28, catY - 8, 22, 18);
          p.ellipse(catX + 28, catY - 8, 22, 18);
          p.fill(0, 0, 5, 100);
          p.ellipse(catX - 28, catY - 8, 8, 14);
          p.ellipse(catX + 28, catY - 8, 8, 14);
          p.fill(0, 0, 100, 80);
          p.circle(catX - 31, catY - 11, 5);
          p.circle(catX + 25, catY - 11, 5);

          // Nose
          p.fill(350, 40, 90, 100);
          p.triangle(catX - 4, catY + 8, catX + 4, catY + 8, catX, catY + 14);

          // Whiskers (rainbow)
          for (let i = 0; i < 3; i++) {
            const wHue = (hueShift + i * 40) % 360;
            p.stroke(wHue, 60, 80, 60);
            p.strokeWeight(0.8);
            p.line(catX - 15, catY + 10 + i * 4, catX - 70, catY + 8 + i * 5);
            p.line(catX + 15, catY + 10 + i * 4, catX + 70, catY + 8 + i * 5);
          }

          // Tail
          p.noFill();
          p.stroke(hueShift, 70, 80, 80);
          p.strokeWeight(5);
          p.beginShape();
          p.curveVertex(catX + 60, catY + 30);
          p.curveVertex(catX + 80, catY + 60);
          p.curveVertex(catX + 100, catY + 40);
          p.curveVertex(catX + 90, catY + 10);
          p.endShape();

          p.colorMode(p.RGB, 255);
        };

        p5Ref.current = p;

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
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

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "#f4f0ff" }}>
      <div ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Back */}
      <Link href="/" className="absolute top-6 right-6 z-30" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", padding: "8px 18px", borderRadius: 100, background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(124,107,255,0.2)", color: "#5a4aaa", textDecoration: "none" }}>
        ← 返回
      </Link>

      {/* Left sidebar */}
      <div className="absolute left-0 top-0 h-full z-20 flex flex-col" style={{ width: "min(360px, 36vw)", padding: "36px 28px", background: "rgba(244,240,255,0.82)", backdropFilter: "blur(14px)", borderRight: "1px solid rgba(124,107,255,0.12)", overflowY: "auto" }}>
        <div className="data-label mb-1" style={{ color: "#7c6bff" }}>品种 {cat.breed}</div>
        <div className="data-label mb-1" style={{ color: "#9b59ff" }}>特质 棱镜折光</div>
        <div className="data-label mb-4" style={{ color: "#c46bff" }}>档案 #{cat.number}</div>

        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(3rem, 5vw, 4.5rem)", lineHeight: 0.88, color: "#1a0a30", letterSpacing: "-0.03em", marginBottom: 8 }}>
          MOMO
        </h1>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.4rem", color: "#7c6bff", marginBottom: 20 }}>墨 墨</div>

        {/* Quick facts grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          {MOMO_FACTS.map((f) => (
            <div key={f.label} style={{ background: "rgba(124,107,255,0.08)", borderRadius: 10, padding: "10px 12px", border: "1px solid rgba(124,107,255,0.12)" }}>
              <div style={{ fontSize: "1.1rem", marginBottom: 3 }}>{f.icon}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: "#8a7ab0", letterSpacing: "0.06em" }}>{f.label}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#1a0a30", fontWeight: 700 }}>{f.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {(["stats", "spectrum", "facts"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", fontWeight: 700, letterSpacing: "0.06em", padding: "5px 10px", borderRadius: 100, border: "none", background: activeTab === tab ? "#7c6bff" : "rgba(124,107,255,0.1)", color: activeTab === tab ? "#fff" : "#7c6bff", cursor: "pointer", transition: "all 0.2s", flexShrink: 0 }}>
              {tab === "stats" ? "档案" : tab === "spectrum" ? "光谱" : "趣闻"}
            </button>
          ))}
        </div>

        {activeTab === "stats" && (
          <div className="glass-panel rounded-xl" style={{ padding: "12px 14px" }}>
            <div className="data-label mb-2" style={{ color: "#7c6bff" }}>核心属性</div>
            {cat.stats.map((s) => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(124,107,255,0.07)", fontFamily: "var(--font-mono)", fontSize: "0.6rem" }}>
                <span style={{ color: "#8a7ab0" }}>{s.label}</span>
                <span style={{ color: "#1a0a30", fontWeight: 700 }}>{s.value}{s.unit ? ` ${s.unit}` : ""}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "spectrum" && (
          <div className="glass-panel rounded-xl" style={{ padding: "12px 14px" }}>
            <div className="data-label mb-3" style={{ color: "#7c6bff" }}>可见光谱分析</div>
            {SPECTRUM_COLORS.map((sc) => (
              <div key={sc.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                <div style={{ width: 18, height: 12, borderRadius: 3, background: sc.hex, flexShrink: 0 }} />
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.56rem", color: "#4a3a70", flexShrink: 0, width: 14 }}>{sc.name}</div>
                <div style={{ flex: 1, height: 4, background: "rgba(124,107,255,0.1)", borderRadius: 2 }}>
                  <div style={{ height: "100%", width: `${((700 - sc.wavelength) / 300) * 100}%`, background: sc.hex, borderRadius: 2 }} />
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: "#8a7ab0", flexShrink: 0 }}>{sc.wavelength}nm</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "facts" && (
          <div className="glass-panel rounded-xl" style={{ padding: "12px 14px" }}>
            <div className="data-label mb-2" style={{ color: "#7c6bff" }}>档案描述</div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "#2a1a50", lineHeight: 1.7, margin: "0 0 10px" }}>{cat.description}</p>
            {cat.funFacts.map((fact, i) => (
              <div key={i} style={{ display: "flex", gap: 8, padding: "5px 0", borderBottom: "1px solid rgba(124,107,255,0.07)", fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "#4a3a70", lineHeight: 1.5 }}>
                <span style={{ color: "#7c6bff", fontWeight: 700, flexShrink: 0, fontFamily: "var(--font-mono)" }}>0{i + 1}</span>
                <span>{fact}</span>
              </div>
            ))}
          </div>
        )}

        {/* Vitals */}
        <div className="glass-panel rounded-xl" style={{ padding: "12px 14px", marginTop: 12 }}>
          <div className="data-label mb-2" style={{ color: "#7c6bff" }}>状态监测</div>
          {cat.vitals.map((v) => (
            <div key={v.label} style={{ marginBottom: 7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "0.58rem", marginBottom: 3, color: "#5a4a8a" }}>
                <span>{v.label}</span>
                <span style={{ color: v.color, fontWeight: 700 }}>{v.value}%</span>
              </div>
              <div style={{ height: 3, background: "rgba(124,107,255,0.12)", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${v.value}%`, background: v.color, borderRadius: 2, transition: "width 1.2s ease" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Speed indicator */}
      <div className="absolute z-20" style={{ top: 32, right: 120, background: "rgba(244,240,255,0.85)", backdropFilter: "blur(12px)", borderRadius: 12, padding: "12px 16px", border: "1px solid rgba(124,107,255,0.2)" }}>
        <div className="data-label mb-1" style={{ color: "#7c6bff" }}>鼠标速度</div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.8rem", color: "#1a0a30", lineHeight: 1 }}>{speed}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "#8a7ab0" }}>px/s</div>
      </div>

      {/* Toy launcher */}
      <button onClick={launchToy} className="absolute z-20" style={{ bottom: 32, left: "calc(min(360px, 36vw) + 24px)", padding: "12px 24px", borderRadius: 100, border: "none", background: "#7c6bff", color: "#fff", fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,107,255,0.4)", transition: "all 0.2s" }}>
        🎯 召唤玩具 ({toyCount})
      </button>

      {/* Hint */}
      <div className="absolute z-10 data-label" style={{ bottom: 16, left: "50%", transform: "translateX(-50%)", color: "#9b59ff" }}>
        移动鼠标 · 墨墨会追随你 / 点击按钮召唤玩具
      </div>
          <ParticleBackground isRainbow />
</div>
  );
}
