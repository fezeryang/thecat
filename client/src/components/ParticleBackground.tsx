import React, { useRef } from "react";
import Sketch from "react-p5";
import p5Types from "p5";

interface ParticleBackgroundProps {
  color?: string | { r: number; g: number; b: number };
  isRainbow?: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  alpha: number;
  hue?: number;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ color, isRainbow }) => {
  const particlesRef = useRef<Particle[]>([]);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    particlesRef.current = [];
    for (let i = 0; i < 40; i++) {
      particlesRef.current.push({
        x: p5.random(p5.width),
        y: p5.random(p5.height),
        size: p5.random(3, 7),
        speedY: p5.random(0.3, 0.8),
        speedX: p5.random(-0.2, 0.2),
        alpha: p5.random(30, 100),
        hue: isRainbow ? p5.random(360) : undefined,
      });
    }
  };

  const draw = (p5: p5Types) => {
    p5.clear();
    p5.noStroke();

    if (isRainbow) {
      p5.colorMode(p5.HSB, 360, 100, 100, 100);
    }

    particlesRef.current.forEach((p) => {
      p.y -= p.speedY;
      p.x += p.speedX;

      if (isRainbow && p.hue !== undefined) {
        p.hue = (p.hue + 0.5) % 360;
      }

      if (p.y < 0) {
        p.y = p5.height;
        p.x = p5.random(p5.width);
      }
      if (p.x < 0) p.x = p5.width;
      if (p.x > p5.width) p.x = 0;

      if (isRainbow && p.hue !== undefined) {
        p5.fill(p.hue, 60, 90, p.alpha);
      } else if (color) {
        if (typeof color === 'string') {
          // Parse hex
          const hex = color.replace('#', '');
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          p5.fill(r, g, b, p.alpha);
        } else {
          p5.fill(color.r, color.g, color.b, p.alpha);
        }
      } else {
        p5.fill(255, 255, 255, p.alpha);
      }
      
      p5.circle(p.x, p.y, p.size);
    });

    if (isRainbow) {
      p5.colorMode(p5.RGB, 255);
    }
  };

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      <Sketch setup={setup} draw={draw} windowResized={windowResized} />
    </div>
  );
};

export default ParticleBackground;
