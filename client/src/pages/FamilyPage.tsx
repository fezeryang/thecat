import React, { useEffect, useRef, useState } from "react";
import Sketch from "react-p5";
import P5 from "p5";
import { CATS } from "@/lib/cats";
import { Link, useLocation } from "wouter";

// --- Types ---
interface Particle {
  x: number;
  y: number;
  txt: string;
  size: number;
  speed: number;
}

// --- Constants ---
const COLORS = {
  bg: "#fdf6e3",
  pink: "#ff4d6d",
  blue: "#00b4d8",
  yellow: "#fee440",
  text: "#2b2d42",
};

const FONTS = {
  display: "'Syne', sans-serif",
  body: "'Space Grotesk', sans-serif",
  mono: "'Zilla Slab Highlight', monospace", // Using Zilla as the "highlight" font
};

// --- Component ---
export default function FamilyPage() {
  const [, setLocation] = useLocation();
  const texturesRef = useRef<any[]>([]);
  const flowField = useRef<Particle[]>([]);
  const cubeSize = 250;

  // Scroll tracking
  const scrollRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- P5 Setup & Draw ---

  const setup = (p5: any, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL).parent(
      canvasParentRef
    );
    p5.rectMode(p5.CENTER);

    // Create textures using p5.createGraphics
    const newTextures: any[] = [];
    CATS.slice(0, 6).forEach(cat => {
      const pg = p5.createGraphics(500, 500);
      pg.background(cat.colorHex);
      pg.noStroke();
      pg.fill(255, 255, 255, 30);
      pg.circle(250, 250, 400);
      pg.textAlign(p5.CENTER, p5.CENTER);
      pg.textSize(250);
      pg.fill(255);
      pg.text(cat.emoji, 250, 280);
      pg.textSize(40);
      pg.text(cat.name, 250, 420);
      newTextures.push(pg);
    });
    texturesRef.current = newTextures;

    // Initialize flow field for text particles
    const particles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: p5.random(-p5.width, p5.width),
        y: p5.random(-p5.height, p5.height),
        txt: p5.random(["夢", "光", "電子", "少女", "記憶", "VOID", "CYBER"]),
        size: p5.random(20, 80),
        speed: p5.random(1, 3),
      });
    }
    flowField.current = particles;
  };

  const draw = (p5: any) => {
    const scrollY = scrollRef.current;
    const maxScroll = document.body.scrollHeight - p5.windowHeight;
    const scrollFactor = p5.constrain(scrollY / maxScroll, 0, 1);

    // Dynamic Background
    p5.background(253, 246, 227); // Pastel Cream

    // Artistic Text Animation in Background
    p5.push();
    p5.translate(0, 0, -500);
    drawKineticTypography(p5, scrollFactor);
    p5.pop();

    // Lighting
    p5.ambientLight(200);
    p5.pointLight(255, 255, 255, 200, -200, 300);

    if (scrollFactor < 0.7) {
      // PHASE 1: 3D ROTATING CUBE
      drawRotatingCube(p5, scrollFactor);
    } else if (scrollFactor < 0.85) {
      // PHASE 2: UNFOLDING TO FILMSTRIP
      const unfoldFactor = p5.map(scrollFactor, 0.7, 0.85, 0, 1);
      drawUnfoldingCube(p5, unfoldFactor);
    } else {
      // PHASE 3: VHS FILMSTRIP PLAYBACK
      const playFactor = p5.map(scrollFactor, 0.85, 1, 0, 1);
      drawVHSPlayback(p5, playFactor);
    }
  };

  const drawKineticTypography = (p5: any, f: number) => {
    p5.noStroke();
    // Use a standard font if custom font not loaded, or just sans-serif
    p5.textFont("sans-serif");

    flowField.current.forEach(p => {
      p5.fill(255, 77, 109, 40); // Pink with low opacity
      p5.textSize(p.size);
      p5.text(p.txt, p.x, p.y + f * 500);
      p.y -= p.speed;
      if (p.y < -p5.height) p.y = p5.height;
    });
  };

  const drawRotatingCube = (p5: any, f: number) => {
    p5.push();
    p5.rotateX(f * p5.TWO_PI * 2);
    p5.rotateY(f * p5.TWO_PI * 1.5);
    p5.rotateZ(f * p5.PI);

    // Scale based on scroll
    const s = p5.map(f, 0, 0.7, 1, 1.2);
    p5.scale(s);

    drawBoxFaces(p5, cubeSize);
    p5.pop();
  };

  const drawUnfoldingCube = (p5: any, f: number) => {
    p5.push();
    p5.rotateX(p5.PI * 0.1); // Slight tilt

    // Transition cube faces into a horizontal line
    for (let i = 0; i < 6; i++) {
      p5.push();
      const xPos = (i - 2.5) * (cubeSize + 20) * f;
      // const zPos = p5.lerp(0, 0, f); // Unused but in reference
      p5.translate(xPos, 0, 0);
      p5.rotateY(p5.lerp((i * p5.PI) / 2, 0, f));

      if (texturesRef.current[i % texturesRef.current.length]) {
        p5.texture(texturesRef.current[i % texturesRef.current.length]);
        p5.rect(0, 0, cubeSize, cubeSize);
      } else {
        p5.fill(200);
        p5.rect(0, 0, cubeSize, cubeSize);
      }
      p5.pop();
    }
    p5.pop();
  };

  const drawVHSPlayback = (p5: any, f: number) => {
    p5.push();
    const stripWidth = p5.width * 1.5;
    const xOffset = -f * stripWidth * 0.5;

    p5.translate(xOffset, 0, 0);

    for (let i = -10; i < 10; i++) {
      p5.push();
      p5.translate(i * (cubeSize + 10), 0, 0);

      // Add "Analog" jitter
      const jitterX = p5.random(-1, 1) * f;
      const jitterY = p5.random(-1, 1) * f;
      p5.translate(jitterX, jitterY);

      // Film Frame border
      p5.noFill();
      p5.stroke(43, 45, 66, 100);
      p5.strokeWeight(10);
      p5.rect(0, 0, cubeSize + 10, cubeSize + 40);

      // Image
      if (texturesRef.current[Math.abs(i) % texturesRef.current.length]) {
        p5.texture(texturesRef.current[Math.abs(i) % texturesRef.current.length]);
        p5.rect(0, 0, cubeSize, cubeSize);
      }

      // Film Perforations
      p5.fill(43, 45, 66);
      p5.noStroke();
      p5.rect(-cubeSize / 2 - 5, -cubeSize / 2 - 10, 10, 15);
      p5.rect(cubeSize / 2 + 5, -cubeSize / 2 - 10, 10, 15);
      p5.rect(-cubeSize / 2 - 5, cubeSize / 2 + 10, 10, 15);
      p5.rect(cubeSize / 2 + 5, cubeSize / 2 + 10, 10, 15);
      p5.pop();
    }

    // Playback Overlay (Chromatic Aberration)
    drawGlitchOverlay(p5, f);
    p5.pop();
  };

  const drawGlitchOverlay = (p5: any, f: number) => {
    if (p5.random(1) > 0.9) {
      p5.push();
      p5.fill(255, 0, 0, 50);
      p5.rect(
        p5.random(-p5.width, p5.width),
        p5.random(-p5.height, p5.height),
        p5.width,
        2
      );
      p5.fill(0, 255, 255, 50);
      p5.rect(
        p5.random(-p5.width, p5.width),
        p5.random(-p5.height, p5.height),
        p5.width,
        5
      );
      p5.pop();
    }
  };

  const drawBoxFaces = (p5: any, s: number) => {
    const h = s / 2;
    // Front
    p5.push();
    p5.translate(0, 0, h);
    if (texturesRef.current[0]) p5.texture(texturesRef.current[0]);
    p5.rect(0, 0, s, s);
    p5.pop();
    // Back
    p5.push();
    p5.translate(0, 0, -h);
    p5.rotateY(p5.PI);
    if (texturesRef.current[1]) p5.texture(texturesRef.current[1]);
    p5.rect(0, 0, s, s);
    p5.pop();
    // Right
    p5.push();
    p5.translate(h, 0, 0);
    p5.rotateY(p5.HALF_PI);
    if (texturesRef.current[2]) p5.texture(texturesRef.current[2]);
    p5.rect(0, 0, s, s);
    p5.pop();
    // Left
    p5.push();
    p5.translate(-h, 0, 0);
    p5.rotateY(-p5.HALF_PI);
    if (texturesRef.current[3]) p5.texture(texturesRef.current[3]);
    p5.rect(0, 0, s, s);
    p5.pop();
    // Top
    p5.push();
    p5.translate(0, -h, 0);
    p5.rotateX(p5.HALF_PI);
    if (texturesRef.current[4]) p5.texture(texturesRef.current[4]);
    p5.rect(0, 0, s, s);
    p5.pop();
    // Bottom
    p5.push();
    p5.translate(0, h, 0);
    p5.rotateX(-p5.HALF_PI);
    if (texturesRef.current[5]) p5.texture(texturesRef.current[5]);
    p5.rect(0, 0, s, s);
    p5.pop();
  };

  const windowResized = (p5: any) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  const mouseClicked = (p5: any) => {
    const scrollY = scrollRef.current;
    const maxScroll = document.body.scrollHeight - p5.windowHeight;
    const scrollFactor = p5.constrain(scrollY / maxScroll, 0, 1);

    // Convert mouse to centered coordinates (WEBGL mode)
    const mx = p5.mouseX - p5.width / 2;
    const my = p5.mouseY - p5.height / 2;

    if (scrollFactor >= 0.7 && scrollFactor < 0.85) {
      // PHASE 2: UNFOLDING
      const unfoldFactor = p5.map(scrollFactor, 0.7, 0.85, 0, 1);

      // Correct for global X rotation (approximate)
      // p5.rotateX(p5.PI * 0.1);
      const myCorrected = my / Math.cos(p5.PI * 0.1);

      for (let i = 0; i < 6; i++) {
        const xPos = (i - 2.5) * (cubeSize + 20) * unfoldFactor;
        const angleY = p5.lerp((i * p5.PI) / 2, 0, unfoldFactor);

        // Calculate projected width of the rotated face
        const projectedWidth = cubeSize * Math.abs(Math.cos(angleY));

        // Check if click is within bounds
        if (
          Math.abs(mx - xPos) < projectedWidth / 2 &&
          Math.abs(myCorrected) < cubeSize / 2
        ) {
          const cat = CATS[i];
          if (cat) {
            setLocation(`/cat/${cat.id}`);
            return;
          }
        }
      }
    } else if (scrollFactor >= 0.85) {
      // PHASE 3: VHS PLAYBACK
      const playFactor = p5.map(scrollFactor, 0.85, 1, 0, 1);
      const stripWidth = p5.width * 1.5;
      const xOffset = -playFactor * stripWidth * 0.5;

      for (let i = -10; i < 10; i++) {
        const centerX = xOffset + i * (cubeSize + 10);

        // Simple 2D box check (no rotation in this phase)
        if (
          Math.abs(mx - centerX) < cubeSize / 2 &&
          Math.abs(my) < cubeSize / 2
        ) {
          // Map loop index to CATS array (first 6)
          const catIndex = Math.abs(i) % 6;
          const cat = CATS[catIndex];
          if (cat) {
            setLocation(`/cat/${cat.id}`);
            return;
          }
        }
      }
    }
  };


  return (
    <div
      style={{
        height: "500vh",
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: FONTS.body,
        overflowX: "hidden",
      }}
    >
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Space+Grotesk:wght@300;700&family=Zilla+Slab+Highlight:wght@700&display=swap');
        
        :root {
          --bg-color: #fdf6e3;
          --accent-pink: #ff4d6d;
          --accent-blue: #00b4d8;
          --accent-yellow: #fee440;
          --text-primary: #2b2d42;
        }

        .hero-text {
          font-family: 'Syne', sans-serif;
          font-size: 12vw;
          line-height: 0.8;
          text-transform: uppercase;
          color: var(--accent-pink);
          mix-blend-mode: difference;
        }

        .data-label {
          font-family: 'Space Grotesk', monospace;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.2em;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }

        .data-label::before {
          content: "";
          width: 40px;
          height: 2px;
          background: var(--text-primary);
          margin-right: 15px;
        }

        .section {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 10%;
          position: relative;
          z-index: 2;
          pointer-events: none; /* Let clicks pass through to canvas if needed, but mostly for scroll */
        }
      `}</style>

      {/* VHS Lines Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.05) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
          backgroundSize: "100% 4px, 3px 100%",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Grain Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
          backgroundImage:
            "url('https://grainy-gradients.vercel.app/noise.svg')",
          opacity: 0.15,
          mixBlendMode: "multiply",
        }}
      />

      {/* Side Nav */}
      <div
        style={{
          position: "fixed",
          right: "40px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
          mixBlendMode: "overlay",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              width: "12px",
              height: "12px",
              border: "2px solid var(--text-primary)",
              borderRadius: "50%",
              background: i === 0 ? "var(--text-primary)" : "transparent",
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <Link
        href="/"
        style={{
          position: "fixed",
          top: "24px",
          left: "24px",
          zIndex: 100,
          fontFamily: "'Space Grotesk', monospace",
          fontWeight: 700,
          fontSize: "14px",
          textDecoration: "none",
          color: "var(--text-primary)",
          border: "2px solid var(--text-primary)",
          padding: "8px 16px",
          borderRadius: "20px",
          background: "rgba(253, 246, 227, 0.8)",
        }}
      >
        ← BACK
      </Link>

      {/* P5 Canvas Container */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
        }}
      >
        <Sketch
          setup={setup}
          draw={draw}
          windowResized={windowResized}
          mouseClicked={mouseClicked}
        />
      </div>

      {/* Content Overlay */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Section 1: Hero */}
        <section className="section">
          <span className="data-label">CHRONICLE 001 / FAMILY_CORE</span>
          <h1 className="hero-text">
            CAMPUS
            <br />
            CATS
          </h1>
        </section>

        {/* Section 2: Timeline / Data */}
        <section
          className="section"
          style={{ alignItems: "flex-end", textAlign: "right" }}
        >
          <span className="data-label" style={{ flexDirection: "row-reverse" }}>
            DATA STREAM / 006
            <span
              style={{
                width: "40px",
                height: "2px",
                background: "var(--text-primary)",
                marginLeft: "15px",
                marginRight: 0,
              }}
            />
          </span>
          <h1 className="hero-text" style={{ color: "var(--accent-blue)" }}>
            SIX
            <br />
            SOULS
          </h1>

          {/* Mini List of Cats */}
          <div
            style={{
              marginTop: "20px",
              fontFamily: "'Space Grotesk', monospace",
              fontSize: "1.2rem",
              color: "var(--text-primary)",
            }}
          >
            {CATS.map(cat => (
              <div key={cat.id}>
                {cat.number} . {cat.name} . {cat.role}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Home */}
        <section className="section">
          <span className="data-label">MEME_ARCHIVE / UNRAVEL</span>
          <h1 className="hero-text" style={{ color: "var(--accent-yellow)" }}>
            ONE
            <br />
            HOME
          </h1>
          <p
            style={{
              maxWidth: "400px",
              fontSize: "1.5rem",
              marginTop: "20px",
              fontWeight: "bold",
            }}
          >
            From the library to the rooftop, these are the guardians of our
            campus memories.
          </p>
        </section>

        {/* Buffer for final animation */}
        <section className="section" style={{ height: "200vh" }}>
          {/* Final content can go here if needed */}
        </section>
      </div>
    </div>
  );
}
