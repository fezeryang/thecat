/**
 * Home.tsx — Campus Felines Homepage
 * Design: Kinetic Editorial — Filament particles & Fixed positioning
 * p5.js: Filament particles with mouse attraction
 * Color: Warm cream #f9f7f2
 * Features: Fixed cat nodes, hover effects, parallax, coordinates
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { CATS } from "@/lib/cats";

// Fixed positions for the cats to match the reference design aesthetic
const CAT_POSITIONS = [
  { top: "20%", left: "15%" },
  { top: "15%", left: "60%" },
  { top: "60%", left: "25%" },
  { top: "55%", left: "70%" },
  { top: "35%", left: "40%" }, // Extra position for 5th cat
  { top: "75%", left: "50%" }, // Extra position for 6th cat
];

// Blob shapes for variety
const BLOB_SHAPES = [
  "45% 55% 70% 30% / 30% 40% 60% 70%",
  "60% 40% 30% 70% / 60% 30% 70% 40%",
  "30% 70% 70% 30% / 50%",
  "50% 50% 20% 80%",
  "40% 60% 60% 40% / 40% 40% 60% 60%",
  "70% 30% 30% 70% / 60% 40% 60% 40%",
];

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse move handler for coordinates and parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Parallax effect
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;

      document.querySelectorAll(".cat-node").forEach((node, index) => {
        const factor = (index + 1) * 1.2;
        (node as HTMLElement).style.transform =
          `translate(${moveX * factor}px, ${moveY * factor}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // p5.js Sketch
  useEffect(() => {
    let p5Instance: any;

    const initP5 = async () => {
      const p5 = (await import("p5")).default;

      const sketch = (p: any) => {
        let particles: any[] = [];
        const numParticles = 80;
        const colors = ["#ff5f40", "#4070ff", "#2ecc71", "#f1c40f"];

        class Filament {
          pos: any;
          prevPos: any;
          vel: any;
          acc: any;
          maxSpeed: number;
          color: any;
          noiseScale: number;
          life: number;

          constructor() {
            this.pos = p.createVector(p.random(p.width), p.random(p.height));
            this.prevPos = this.pos.copy();
            this.vel = p.createVector(0, 0);
            this.acc = p.createVector(0, 0);
            this.maxSpeed = p.random(1, 3);
            this.color = p.color(p.random(colors));
            this.color.setAlpha(p.random(50, 150));
            this.noiseScale = 0.005;
            this.life = p.random(100, 300);
          }

          update() {
            let n = p.noise(
              this.pos.x * this.noiseScale,
              this.pos.y * this.noiseScale,
              p.frameCount * 0.002
            );
            let angle = p.map(n, 0, 1, 0, p.TWO_PI * 4);
            this.acc.add(p5.Vector.fromAngle(angle).mult(0.1));

            // Attraction to mouse
            let d = p.dist(p.mouseX, p.mouseY, this.pos.x, this.pos.y);
            if (d < 300) {
              let attract = p.createVector(
                p.mouseX - this.pos.x,
                p.mouseY - this.pos.y
              );
              attract.normalize();
              attract.mult(0.2);
              this.acc.add(attract);
            }

            this.vel.add(this.acc);
            this.vel.limit(this.maxSpeed);
            this.pos.add(this.vel);
            this.acc.mult(0);

            if (
              this.pos.x < 0 ||
              this.pos.x > p.width ||
              this.pos.y < 0 ||
              this.pos.y > p.height
            ) {
              this.pos = p.createVector(p.random(p.width), p.random(p.height));
              this.prevPos = this.pos.copy();
            }
          }

          display() {
            p.strokeWeight(p.random(0.5, 2));
            p.stroke(this.color);
            p.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);

            // Add granular "pollen" dots
            if (p.random() > 0.95) {
              p.noStroke();
              p.fill(this.color);
              p.ellipse(this.pos.x, this.pos.y, 2, 2);
            }

            this.prevPos = this.pos.copy();
          }
        }

        p.setup = () => {
          const cnv = p.createCanvas(p.windowWidth, p.windowHeight);
          cnv.parent(canvasRef.current!);
          cnv.style("position", "fixed");
          cnv.style("top", "0");
          cnv.style("left", "0");
          cnv.style("z-index", "1");

          for (let i = 0; i < numParticles; i++) {
            particles.push(new Filament());
          }
          p.background("#f9f7f2");
        };

        p.draw = () => {
          // Subtle fade for trail effect
          p.background(249, 247, 242, 15);

          particles.forEach(pt => {
            pt.update();
            pt.display();
          });
        };

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
          p.background("#f9f7f2");
        };
      };

      p5Instance = new p5(sketch);
    };

    initP5();
    return () => {
      if (p5Instance) p5Instance.remove();
    };
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden grain-overlay"
      style={{ backgroundColor: "#f9f7f2", cursor: "crosshair" }}
    >
      <div ref={canvasRef} />

      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-10 flex justify-between items-start z-10 pointer-events-none">
        <div className="font-mono text-xs tracking-[0.2em] uppercase leading-relaxed text-[#1a1a1a]">
          CAMPUS ARCHIVE / VOL.01
          <span className="block font-extrabold text-3xl tracking-tighter mt-2 text-[#ff5f40] font-sans">
            FELINE TRACES
          </span>
        </div>
        <div className="font-mono text-xs tracking-[0.2em] uppercase leading-relaxed text-right text-[#1a1a1a]">
          COORDINATES: <br />
          <span className="text-sm text-[#1a1a1a]">
            {mousePos.x.toFixed(2).padStart(6, "0")},{" "}
            {mousePos.y.toFixed(2).padStart(6, "0")}
          </span>
        </div>
      </header>

      {/* Cat Nodes */}
      <div className="absolute top-0 left-0 w-full h-full z-10">
        {CATS.map((cat, idx) => {
          const position = CAT_POSITIONS[idx % CAT_POSITIONS.length];
          const blobShape = BLOB_SHAPES[idx % BLOB_SHAPES.length];
          const isHovered = hoveredCat === cat.id;

          return (
            <Link key={cat.id} href={`/cat/${cat.id}`}>
              <div
                className="cat-node absolute cursor-pointer transition-transform duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-105"
                style={{
                  top: position.top,
                  left: position.left,
                  zIndex: isHovered ? 50 : 10,
                }}
                onMouseEnter={() => setHoveredCat(cat.id)}
                onMouseLeave={() => setHoveredCat(null)}
              >
                {/* Blob Image Container */}
                <div
                  className="cat-blob relative overflow-hidden bg-white transition-all duration-1000 ease-in-out mix-blend-multiply"
                  style={{
                    width: "280px",
                    height: "340px",
                    borderRadius: isHovered ? "50%" : blobShape,
                    boxShadow: "0 30px 60px rgba(0,0,0,0.05)",
                  }}
                >
                  <img
                    src={`https://images.unsplash.com/${cat.unsplashId}?auto=format&fit=crop&w=800&q=80`}
                    alt={cat.cnName}
                    className="w-full h-full object-cover transition-all duration-500 ease-in-out"
                    style={{
                      filter: isHovered ? "grayscale(0%) contrast(1)" : "grayscale(100%) contrast(1.1)",
                      opacity: isHovered ? 1 : 0.9,
                    }}
                  />
                </div>

                {/* Info Box */}
                <div
                  className="cat-info absolute bg-white px-4 py-2.5 font-mono text-[11px] text-[#1a1a1a]"
                  style={{
                    bottom: "-20px",
                    left: "20px",
                    transform: "rotate(-2deg)",
                    boxShadow: "10px 10px 0px rgba(0,0,0,0.05)",
                  }}
                >
                  <b className="block text-base font-sans mb-1">{cat.cnName}</b>
                  ID: #{cat.id.toUpperCase()} / {cat.role.toUpperCase()}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Nav Hint */}
      <div className="absolute bottom-10 right-10 font-mono text-[10px] text-right opacity-50 z-10 pointer-events-none">
        HOVER TO RESOLVE FILAMENTS
        <br />
        CLICK TO ENTER ARCHIVE
      </div>

      {/* Family Link - Keeping as requested */}
      <Link
        href="/family"
        className="absolute bottom-10 left-10 z-20 flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105 bg-[#1a1208] text-[#fdf8f2] rounded-full no-underline font-mono tracking-wide"
      >
        大家庭 →
      </Link>
    </div>
  );
}
