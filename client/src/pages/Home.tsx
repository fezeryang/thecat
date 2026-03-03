/**
 * Home.tsx — Campus Felines Homepage
 * Design: Kinetic Editorial — Verlet physics pendulum cards
 * p5.js: Spring simulation with mouse repulsion + ambient particles
 * Color: Warm cream #fdf8f2, each cat has its own accent hue
 * Features: Physics pendulum cards, ambient particles, cat stats, search filter
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { CATS } from "@/lib/cats";

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [filter, setFilter] = useState("");
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let p5Instance: any;

    const initP5 = async () => {
      const p5 = (await import("p5")).default;

      const sketch = (p: any) => {
        const gravity = 0.42;
        const friction = 0.986;
        const springs: Array<{
          anchor: { x: number; y: number };
          bob: { x: number; y: number; oldX: number; oldY: number; targetLen: number; id: number };
        }> = [];
        const numCats = CATS.length;
        let ambientParticles: Array<{ x: number; y: number; vx: number; vy: number; size: number; hue: number; life: number; maxLife: number }> = [];
        let frameCount = 0;

        p.setup = () => {
          const cnv = p.createCanvas(p.windowWidth, p.windowHeight);
          cnv.parent(canvasRef.current!);
          cnv.style("position", "absolute");
          cnv.style("top", "0");
          cnv.style("left", "0");
          cnv.style("pointer-events", "none");

          const positions = [
            { ax: p.width * 0.10, targetLen: 280 },
            { ax: p.width * 0.26, targetLen: 320 },
            { ax: p.width * 0.42, targetLen: 260 },
            { ax: p.width * 0.58, targetLen: 340 },
            { ax: p.width * 0.74, targetLen: 290 },
            { ax: p.width * 0.90, targetLen: 310 },
          ];

          for (let i = 0; i < numCats; i++) {
            const anchor = { x: positions[i].ax, y: -20 };
            const bob = {
              x: anchor.x + p.random(-60, 60),
              y: p.height * 0.40 + p.random(-40, 40),
              oldX: anchor.x,
              oldY: p.height * 0.40,
              targetLen: positions[i].targetLen,
              id: i,
            };
            springs.push({ anchor, bob });
          }

          // Initialize ambient particles
          for (let i = 0; i < 40; i++) {
            ambientParticles.push(createParticle(p));
          }
        };

        const createParticle = (p: any) => ({
          x: p.random(p.width),
          y: p.random(p.height),
          vx: p.random(-0.3, 0.3),
          vy: p.random(-0.5, -0.1),
          size: p.random(2, 6),
          hue: p.random(360),
          life: p.random(100, 200),
          maxLife: p.random(100, 200),
        });

        p.draw = () => {
          p.clear();
          frameCount++;

          const catColors = CATS.map((c) => {
            const hex = c.colorHex;
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return [r, g, b];
          });

          // Ambient particles
          ambientParticles.forEach((ap, i) => {
            ap.x += ap.vx + p.noise(ap.x * 0.003, ap.y * 0.003, frameCount * 0.005) * 0.4 - 0.2;
            ap.y += ap.vy;
            ap.life--;
            if (ap.life <= 0) ambientParticles[i] = createParticle(p);
            const alpha = p.map(ap.life, 0, ap.maxLife, 0, 40);
            p.colorMode(p.HSB, 360, 100, 100, 100);
            p.fill(ap.hue, 30, 90, alpha);
            p.noStroke();
            p.circle(ap.x, ap.y, ap.size);
            p.colorMode(p.RGB, 255);
          });

          // Decorative grid lines (very subtle)
          p.stroke(180, 160, 130, 8);
          p.strokeWeight(0.5);
          for (let x = 0; x < p.width; x += 80) {
            p.line(x, 0, x, p.height);
          }
          for (let y = 0; y < p.height; y += 80) {
            p.line(0, y, p.width, y);
          }
          p.noStroke();

          springs.forEach((s, idx) => {
            const dx = s.bob.x - s.anchor.x;
            const dy = s.bob.y - s.anchor.y;
            const distance = p.sqrt(dx * dx + dy * dy);
            const difference = s.bob.targetLen - distance;
            const percent = (difference / distance) * 0.5;
            const offsetX = dx * percent;
            const offsetY = dy * percent;

            const vx = (s.bob.x - s.bob.oldX) * friction;
            const vy = (s.bob.y - s.bob.oldY) * friction;

            s.bob.oldX = s.bob.x;
            s.bob.oldY = s.bob.y;
            s.bob.x += vx + offsetX;
            s.bob.y += vy + offsetY + gravity;

            // Mouse repulsion
            const mDist = p.dist(p.mouseX, p.mouseY, s.bob.x, s.bob.y);
            if (mDist < 220) {
              const angle = p.atan2(s.bob.y - p.mouseY, s.bob.x - p.mouseX);
              const push = p.map(mDist, 0, 220, 4, 0);
              s.bob.x += p.cos(angle) * push;
              s.bob.y += p.sin(angle) * push;
            }

            s.bob.x = p.constrain(s.bob.x, 120, p.width - 120);
            s.bob.y = p.constrain(s.bob.y, 60, p.height - 200);

            const c = catColors[idx];

            // String with gradient
            for (let t = 0.05; t <= 1; t += 0.04) {
              const sx = p.lerp(s.anchor.x, s.bob.x, t);
              const sy = p.lerp(s.anchor.y, s.bob.y, t);
              const px2 = p.lerp(s.anchor.x, s.bob.x, t - 0.04);
              const py2 = p.lerp(s.anchor.y, s.bob.y, t - 0.04);
              const alpha = p.map(t, 0, 1, 12, 75);
              p.stroke(c[0], c[1], c[2], alpha);
              p.strokeWeight(p.map(t, 0, 1, 0.8, 2.5));
              p.line(px2, py2, sx, sy);
            }
            p.noStroke();

            // Anchor dot
            p.fill(c[0], c[1], c[2], 230);
            p.circle(s.anchor.x, 0, 10);

            // Glow halo
            p.fill(c[0], c[1], c[2], 16);
            p.circle(s.bob.x, s.bob.y, 260);
            p.fill(c[0], c[1], c[2], 8);
            p.circle(s.bob.x, s.bob.y, 340);

            // Update DOM card
            const card = cardRefs.current[idx];
            if (card) {
              const rotation = p.constrain((s.bob.x - s.bob.oldX) * 2.5, -16, 16);
              card.style.left = `${s.bob.x - 110}px`;
              card.style.top = `${s.bob.y - 40}px`;
              card.style.transform = `rotate(${rotation}deg)`;
            }
          });
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

  const filteredCats = CATS.filter((cat) =>
    filter === "" ||
    cat.cnName.includes(filter) ||
    cat.breed.includes(filter) ||
    cat.role.includes(filter) ||
    cat.tags.some((t) => t.includes(filter))
  );

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "linear-gradient(160deg, #fdf8f2 0%, #f8f2ea 50%, #f2ece0 100%)" }}>
      <div ref={canvasRef} className="absolute inset-0" />

      {/* Header */}
      <header className="absolute top-0 left-0 z-20 p-8">
        <div className="data-label mb-1" style={{ color: "#b0956a" }}>
          // 校园猫咪档案系统 V3.0 · {time.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.8rem, 6vw, 5.5rem)", color: "#1a1208", lineHeight: 0.92, letterSpacing: "-0.03em" }}>
          CAMPUS
          <br />
          FELINES
        </h1>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#8a7a60", marginTop: 8, maxWidth: 200, lineHeight: 1.5 }}>
          六只校园猫咪<br />的数字档案馆
        </div>
      </header>

      {/* Search */}
      <div className="absolute top-8 right-8 z-20" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="搜索猫咪..."
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", padding: "8px 14px", borderRadius: 100, border: "1.5px solid rgba(176,149,106,0.3)", background: "rgba(255,255,255,0.75)", backdropFilter: "blur(8px)", outline: "none", width: 160, color: "#1a1208" }}
        />
        {filter && (
          <button onClick={() => setFilter("")} style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", padding: "6px 12px", borderRadius: 100, border: "none", background: "#1a1208", color: "#fdf8f2", cursor: "pointer" }}>
            清除
          </button>
        )}
      </div>

      {/* Stats bar */}
      <div className="absolute z-20" style={{ top: 80, right: 32, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "#b0956a", letterSpacing: "0.06em" }}>
          ACTIVE: {CATS.length} CATS
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {CATS.map((cat) => (
            <div key={cat.id} style={{ width: 8, height: 8, borderRadius: "50%", background: cat.colorHex, opacity: 0.8 }} />
          ))}
        </div>
      </div>

      {/* System info */}
      <div className="absolute bottom-8 left-8 z-20">
        <div className="data-label" style={{ color: "#b0956a" }}>ARCHIVE / 006_CATS / ACTIVE</div>
        <div className="data-label mt-1" style={{ color: "#b0956a" }}>HOVER TO REPEL / CLICK TO EXPLORE</div>
      </div>

      {/* Family link */}
      <Link href="/family" className="absolute bottom-8 right-8 z-20 flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105" style={{ fontFamily: "var(--font-mono)", background: "#1a1208", color: "#fdf8f2", letterSpacing: "0.04em", borderRadius: 100, textDecoration: "none" }}>
        大家庭 →
      </Link>

      {/* Cat cards */}
      {CATS.map((cat, idx) => {
        const isFiltered = filter !== "" && !filteredCats.includes(cat);
        return (
          <Link
            key={cat.id}
            href={`/cat/${cat.id}`}
            ref={(el) => { cardRefs.current[idx] = el; }}
            onMouseEnter={() => setHoveredCat(cat.id)}
            onMouseLeave={() => setHoveredCat(null)}
            className="absolute z-10"
            style={{
              width: 220,
              borderRadius: 18,
              overflow: "hidden",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(14px)",
              border: `1.5px solid rgba(255,255,255,0.9)`,
              boxShadow: hoveredCat === cat.id
                ? `0 16px 48px rgba(0,0,0,0.18), 0 4px 16px ${cat.colorHex}50`
                : `0 8px 32px rgba(0,0,0,0.10), 0 2px 8px ${cat.colorHex}30`,
              textDecoration: "none",
              display: "block",
              willChange: "transform",
              opacity: isFiltered ? 0.25 : 1,
              transition: "opacity 0.3s, box-shadow 0.3s",
              pointerEvents: isFiltered ? "none" : "auto",
            }}
          >
            {/* Color band */}
            <div style={{ height: 5, background: cat.colorHex }} />

            {/* Cat image */}
            <div style={{ height: 160, background: cat.bgHex, overflow: "hidden", position: "relative" }}>
              <img
                src={`https://images.unsplash.com/${cat.unsplashId}?w=400&h=320&fit=crop&auto=format`}
                alt={cat.cnName}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", transform: hoveredCat === cat.id ? "scale(1.06)" : "scale(1)" }}
                loading="lazy"
              />
              <div className="absolute top-2 right-2 data-label" style={{ background: "rgba(255,255,255,0.92)", padding: "2px 7px", borderRadius: 4, color: cat.colorHex }}>
                #{cat.number}
              </div>
              {hoveredCat === cat.id && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: `${cat.colorHex}22` }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#fff", background: `${cat.colorHex}cc`, padding: "4px 10px", borderRadius: 100, letterSpacing: "0.06em" }}>
                    查看档案 →
                  </div>
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ padding: "12px 14px 14px" }}>
              <div className="data-label" style={{ color: cat.colorHex, marginBottom: 2 }}>{cat.breed}</div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.3rem", color: "#1a1208", lineHeight: 1.1 }}>
                {cat.cnName}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "#8a7a60", marginTop: 3 }}>
                {cat.role}
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                {cat.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="tag-pill" style={{ background: `${cat.colorHex}15`, color: cat.colorHex, fontSize: "0.5rem" }}>{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
