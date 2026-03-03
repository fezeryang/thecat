/**
 * FamilyPage.tsx — Campus Felines Family
 * Design: 3D cube unfold scroll-driven animation (参考正方体3.html)
 * p5.js: WEBGL rotating cube → unfold → film strip → grid
 * Color: Warm cream #f5f0e8 with bold coral #e8402a typography
 * Features: Scroll-driven 3D cube, cat grid, relationship map, timeline
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { CATS } from "@/lib/cats";

const FAMILY_TIMELINE = [
  { year: "2020", event: "小橘入驻图书馆", cat: "小橘", color: "#ff7043" },
  { year: "2021", event: "雪球开始夜间巡逻", cat: "雪球", color: "#4a90d9" },
  { year: "2021", event: "墨墨占领理工楼天台", cat: "墨墨", color: "#7c6bff" },
  { year: "2022", event: "条纹绘制完整领地地图", cat: "条纹", color: "#5a8a5e" },
  { year: "2022", event: "布丁成为食堂吉祥物", cat: "布丁", color: "#e8956d" },
  { year: "2023", event: "花花首次在艺术楼留下印章", cat: "花花", color: "#3d9a5c" },
  { year: "2024", event: "六猫首次齐聚中央广场", cat: "全员", color: "#e8402a" },
];

export default function FamilyPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      const prog = max > 0 ? el.scrollTop / max : 0;
      setScrollProgress(prog);
      setActiveSection(Math.floor(prog * 5.5));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let p5Instance: any;
    const scrollRefCopy = scrollRef;

    const initP5 = async () => {
      const p5 = (await import("p5")).default;

      const sketch = (p: any) => {
        let angle = 0;
        let unfoldProgress = 0;
        let targetUnfold = 0;
        let particles: Array<{ x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; color: number[] }> = [];
        let frameCount = 0;

        p.setup = () => {
          const cnv = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
          cnv.parent(canvasRef.current!);
          cnv.style("position", "fixed");
          cnv.style("top", "0");
          cnv.style("left", "0");
          cnv.style("pointer-events", "none");
        };

        p.draw = () => {
          p.clear();
          frameCount++;

          const scrollEl = scrollRefCopy.current;
          if (scrollEl) {
            const max = scrollEl.scrollHeight - scrollEl.clientHeight;
            const prog = max > 0 ? scrollEl.scrollTop / max : 0;
            targetUnfold = prog;
          }
          unfoldProgress += (targetUnfold - unfoldProgress) * 0.055;
          angle += 0.007;

          // Ambient particles
          if (frameCount % 4 === 0 && particles.length < 50) {
            const colors = [[255, 112, 67], [74, 144, 217], [124, 107, 255], [90, 138, 94], [232, 149, 109], [61, 154, 92]];
            const c = colors[Math.floor(p.random(colors.length))];
            particles.push({
              x: p.random(-p.width / 2, p.width / 2),
              y: p.random(-p.height / 2, p.height / 2),
              z: p.random(-200, 200),
              vx: p.random(-0.4, 0.4),
              vy: p.random(-0.8, -0.2),
              vz: p.random(-0.3, 0.3),
              life: 1,
              color: c,
            });
          }

          p.noStroke();
          particles = particles.filter((pt) => pt.life > 0);
          particles.forEach((pt) => {
            pt.x += pt.vx; pt.y += pt.vy; pt.z += pt.vz;
            pt.life -= 0.007;
            p.fill(pt.color[0], pt.color[1], pt.color[2], pt.life * 100);
            p.push();
            p.translate(pt.x, pt.y, pt.z);
            p.sphere(3);
            p.pop();
          });

          // 3D Cube
          p.push();
          // Offset to right side
          p.translate(p.width * 0.22, 0, 0);

          const spinAngle = angle + unfoldProgress * p.PI * 1.5;
          p.rotateY(spinAngle);
          p.rotateX(p.PI / 10 + unfoldProgress * 0.25);

          const size = p.min(p.width, p.height) * 0.17;
          const faceColors = [
            [255, 112, 67, 200],
            [74, 144, 217, 200],
            [124, 107, 255, 200],
            [90, 138, 94, 200],
            [232, 149, 109, 200],
            [61, 154, 92, 200],
          ];

          const faces = [
            { tx: 0, ty: 0, tz: size, rx: 0, ry: 0 },
            { tx: 0, ty: 0, tz: -size, rx: p.PI, ry: 0 },
            { tx: 0, ty: -size, tz: 0, rx: p.PI / 2, ry: 0 },
            { tx: 0, ty: size, tz: 0, rx: -p.PI / 2, ry: 0 },
            { tx: size, ty: 0, tz: 0, rx: 0, ry: -p.PI / 2 },
            { tx: -size, ty: 0, tz: 0, rx: 0, ry: p.PI / 2 },
          ];

          faces.forEach((face, i) => {
            p.push();
            p.translate(face.tx, face.ty, face.tz);
            p.rotateX(face.rx);
            p.rotateY(face.ry);

            // Unfold offset
            const unfoldAmt = i * 0.12 * unfoldProgress;
            p.translate(0, 0, unfoldAmt * size * 0.6);

            const fc = faceColors[i];
            const alpha = Math.max(80, fc[3] - unfoldProgress * 100);
            p.fill(fc[0], fc[1], fc[2], alpha);
            p.stroke(255, 255, 255, 150);
            p.strokeWeight(1.5);
            p.plane(size * 1.92, size * 1.92);

            // Cat emoji
            p.fill(255, 255, 255, 230);
            p.noStroke();
            p.textSize(size * 0.52);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(CATS[i].emoji, 0, 0);

            p.pop();
          });

          p.pop();

          // Connecting lines between cube and content (when unfolding)
          if (unfoldProgress > 0.3) {
            const lineAlpha = p.map(unfoldProgress, 0.3, 0.7, 0, 60);
            p.stroke(200, 180, 150, lineAlpha);
            p.strokeWeight(0.5);
            for (let i = 0; i < 6; i++) {
              const x1 = p.width * 0.22 + p.cos(i * p.TWO_PI / 6) * 80;
              const y1 = p.sin(i * p.TWO_PI / 6) * 80;
              const x2 = p.width * 0.22 + p.cos(i * p.TWO_PI / 6) * 300;
              const y2 = p.sin(i * p.TWO_PI / 6) * 300;
              p.line(x1, y1, 0, x2, y2, 0);
            }
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

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "#f5f0e8" }}>
      <div ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Back */}
      <Link href="/" className="fixed top-6 left-6 z-30" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, padding: "8px 18px", borderRadius: 100, background: "rgba(245,240,232,0.85)", backdropFilter: "blur(8px)", border: "1px solid rgba(196,168,130,0.3)", color: "#6a5a40", textDecoration: "none", letterSpacing: "0.06em" }}>
        ← 返回
      </Link>

      {/* Scroll progress */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: activeSection >= i ? "#e8402a" : "rgba(196,168,130,0.4)", transition: "background 0.3s" }} />
        ))}
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="absolute inset-0 z-10 overflow-y-scroll" style={{ scrollbarWidth: "none" }}>
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        {/* Section 1 — Hero */}
        <section className="h-screen flex items-center" style={{ paddingLeft: "55vw" }}>
          <div>
            <div className="data-label mb-4" style={{ color: "#c4a882" }}>CHRONICLE 001 / FAMILY_CORE</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(3.5rem, 10vw, 9rem)", lineHeight: 0.88, color: "#e8402a", letterSpacing: "-0.02em" }}>
              CAMPUS
              <br />
              FAMILY
            </h1>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#8a7a60", marginTop: 16, maxWidth: 280, lineHeight: 1.7 }}>
              六只校园猫咪，六种截然不同的个性，共同守护着这片校园。向下滚动，探索他们的故事。
            </div>
            <div className="data-label mt-4" style={{ color: "#c4a882" }}>↓ 滚动展开正方体</div>
          </div>
        </section>

        {/* Section 2 — Six Souls */}
        <section className="h-screen flex items-center" style={{ paddingLeft: "55vw" }}>
          <div>
            <div className="data-label mb-4" style={{ color: "#c4a882" }}>ARCHIVE / 006_CATS</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(3.5rem, 10vw, 9rem)", lineHeight: 0.88, color: "#1a1208", letterSpacing: "-0.02em" }}>
              SIX
              <br />
              SOULS
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 16 }}>
              {CATS.map((cat) => (
                <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-mono)", fontSize: "0.62rem" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.colorHex, flexShrink: 0 }} />
                  <span style={{ color: cat.colorHex, fontWeight: 700 }}>{cat.cnName}</span>
                  <span style={{ color: "#8a7a60" }}>— {cat.role}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3 — One Home */}
        <section className="h-screen flex items-center" style={{ paddingLeft: "55vw" }}>
          <div>
            <div className="data-label mb-4" style={{ color: "#c4a882" }}>MEMORY_STREAM / UNRAVEL</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(3.5rem, 10vw, 9rem)", lineHeight: 0.88, color: "#1a1208", letterSpacing: "-0.02em" }}>
              ONE
              <br />
              HOME
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#6a5a40", maxWidth: 280, lineHeight: 1.7, marginTop: 16 }}>
              这片校园是他们共同的家园。无论是图书馆的书架间、夜晚的小径上，还是食堂门口的阳光里，每一处都留下了他们的足迹。
            </p>
          </div>
        </section>

        {/* Section 4 — Timeline */}
        <section className="min-h-screen py-20" style={{ paddingLeft: "8vw", paddingRight: "8vw" }}>
          <div className="data-label mb-8" style={{ color: "#c4a882" }}>大事记 / FAMILY_TIMELINE</div>
          <div style={{ position: "relative", paddingLeft: 32 }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom, #e8402a, #c4a882)" }} />
            {FAMILY_TIMELINE.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 20, marginBottom: 28, position: "relative" }}>
                <div style={{ position: "absolute", left: -38, top: 4, width: 12, height: 12, borderRadius: "50%", background: item.color, border: "2px solid #f5f0e8", boxShadow: `0 0 0 3px ${item.color}40` }} />
                <div style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "12px 16px", border: `1px solid ${item.color}25`, flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: item.color, fontWeight: 700 }}>{item.year}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "#8a7a60" }}>{item.cat}</div>
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#1a1208" }}>{item.event}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 — Cat grid */}
        <section className="min-h-screen py-20" style={{ paddingLeft: "8vw", paddingRight: "8vw" }}>
          <div className="data-label mb-8" style={{ color: "#c4a882" }}>大家庭成员 / FAMILY_MEMBERS</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {CATS.map((cat) => (
              <Link
                key={cat.id}
                href={`/cat/${cat.id}`}
                style={{
                  display: "block",
                  borderRadius: 16,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.78)",
                  backdropFilter: "blur(12px)",
                  border: `2px solid ${cat.colorHex}28`,
                  textDecoration: "none",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  boxShadow: `0 4px 20px ${cat.colorHex}18`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-6px) scale(1.02)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${cat.colorHex}38`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 20px ${cat.colorHex}18`;
                }}
              >
                <div style={{ height: 5, background: cat.colorHex }} />
                <div style={{ height: 160, overflow: "hidden", position: "relative" }}>
                  <img
                    src={`https://images.unsplash.com/${cat.unsplashId}?w=500&h=320&fit=crop&auto=format`}
                    alt={cat.cnName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    loading="lazy"
                  />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${cat.colorHex}40, transparent)` }} />
                </div>
                <div style={{ padding: "18px 20px 20px" }}>
                  <div style={{ fontSize: "2rem", marginBottom: 8 }}>{cat.emoji}</div>
                  <div className="data-label" style={{ color: cat.colorHex, marginBottom: 4 }}>{cat.name}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.7rem", color: "#1a1208", lineHeight: 1, marginBottom: 6 }}>
                    {cat.cnName}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "#8a7a60", marginBottom: 12 }}>
                    {cat.role}
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "#4a3a28", lineHeight: 1.6, marginBottom: 12 }}>
                    {cat.description.slice(0, 80)}...
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {cat.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag-pill" style={{ background: `${cat.colorHex}14`, color: cat.colorHex }}>{tag}</span>
                    ))}
                  </div>
                  <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                    {cat.vitals.slice(0, 2).map((v) => (
                      <div key={v.label} style={{ flex: 1 }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.52rem", color: "#8a7a60", marginBottom: 3 }}>{v.label}</div>
                        <div style={{ height: 3, background: "rgba(0,0,0,0.06)", borderRadius: 2 }}>
                          <div style={{ height: "100%", width: `${v.value}%`, background: v.color, borderRadius: 2 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 6 — Footer */}
        <section className="h-screen flex items-center justify-center">
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: 16 }}>🐾</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem, 6vw, 5rem)", color: "#e8402a", letterSpacing: "-0.02em", marginBottom: 16 }}>
              ALWAYS<br />TOGETHER
            </h2>
            <div className="data-label" style={{ color: "#c4a882" }}>CAMPUS FELINES · 2020 — PRESENT</div>
            <Link href="/" style={{ display: "inline-block", marginTop: 24, fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, padding: "10px 24px", borderRadius: 100, background: "#1a1208", color: "#fdf8f2", textDecoration: "none", letterSpacing: "0.06em" }}>
              返回主页
            </Link>
          </div>
        </section>
      </div>

      {/* Scroll progress bar */}
      <div className="fixed bottom-0 left-0 z-30" style={{ height: 2, background: `linear-gradient(to right, #e8402a ${scrollProgress * 100}%, transparent ${scrollProgress * 100}%)`, width: "100%", transition: "background 0.1s" }} />
    </div>
  );
}
