# HOMEPAGE OPTIMIZATION PLAN: KINETIC EDITORIAL

**Version:** 1.0
**Date:** 2026-03-03
**Status:** Ready for Implementation
**Context:** Campus Felines Homepage p5.js Physics System

---

## 1. EXECUTIVE SUMMARY

**Problem:** The current homepage features a static physics simulation where cat cards overlap chaotically (ghosting), lack tactile feedback, and behave like dead weights rather than living entities. The "Kinetic Editorial" philosophy demands motion that tells a story.

**Goal:** Transform the physics system into a **living ecosystem**. Cards should respect each other's space (collision), breathe with life (idle animation), and react joyfully to interaction (hover/collision effects).

**Visual Outcome:** A "floating gallery" where each cat card feels like a physical object suspended in a viscous, dream-like fluid. The motion will be heavy but playful, with distinct personalities emerging through physics.

---

## 2. COLOR PALETTE REFERENCE

**Strict Adherence Required.** All new visual effects must utilize these exact values to maintain the "Warm Cream & Soft Pastels" aesthetic.

### Base Colors

- **Background:** `#fdfaf6` (Warm Cream)
- **Text:** `#2d3436` (Dark Gray)
- **Glass Effect:** `rgba(255, 255, 255, 0.45)`

### Cat Identity Colors (RGB for p5.js)

Used for: Strings, Glows, Particles, Sparks.

| Index | Cat Name                 | RGB Array         | Hex       | Usage                    |
| :---: | :----------------------- | :---------------- | :-------- | :----------------------- |
|   0   | **小橘 (Little Orange)** | `[255, 142, 114]` | `#ff8e72` | High energy, warm glow   |
|   1   | **雪球 (Snowball)**      | `[184, 212, 240]` | `#b8d4f0` | Cool, calm, subtle pulse |
|   2   | **墨墨 (Momo)**          | `[189, 178, 255]` | `#bdb2ff` | Mysterious, deep shimmer |
|   3   | **条纹 (Stripe)**        | `[168, 230, 207]` | `#a8e6cf` | Fresh, energetic waves   |
|   4   | **布丁 (Pudding)**       | `[255, 211, 182]` | `#ffd3b6` | Soft, slow breathing     |
|   5   | **花花 (Flower)**        | `[199, 232, 202]` | `#c7e8ca` | Natural, organic sway    |

---

## 3. PHYSICS FIXES (Priority 1 - Critical)

### 3.1 Collision Detection System

**Issue:** Cards currently pass through each other, breaking the illusion of physicality.
**Solution:** Implement a soft circle-circle collision response that gently pushes overlapping cards apart without adding jitter.

**Implementation Strategy:**
Insert `checkCollisions()` inside the main physics loop, after updating positions but before drawing.

**Code Snippet:**

```javascript
// Add to setup() or global variables
const COLLISION_RADIUS = 140; // Approx half card width + padding
const COLLISION_DAMPING = 0.2; // Softness of the push (0.1 - 0.5)

function checkCollisions() {
  for (let i = 0; i < bobs.length; i++) {
    for (let j = i + 1; j < bobs.length; j++) {
      let dx = bobs[i].pos.x - bobs[j].pos.x;
      let dy = bobs[i].pos.y - bobs[j].pos.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let minDist = COLLISION_RADIUS * 2;

      if (distance < minDist) {
        // Calculate repulsion angle
        let angle = Math.atan2(dy, dx);
        let targetX = bobs[j].pos.x + Math.cos(angle) * minDist;
        let targetY = bobs[j].pos.y + Math.sin(angle) * minDist;

        // Soft spring force to separate them
        let ax = (targetX - bobs[i].pos.x) * COLLISION_DAMPING;
        let ay = (targetY - bobs[i].pos.y) * COLLISION_DAMPING;

        // Apply force to both bobs (Newton's 3rd Law)
        // Assuming Verlet: adjust position directly for immediate resolution
        // Or Euler: adjust velocity. Here we use a position nudge for stability.

        let pushFactor = 0.05; // How aggressively to separate

        bobs[i].pos.x -= ax * pushFactor;
        bobs[i].pos.y -= ay * pushFactor;
        bobs[j].pos.x += ax * pushFactor;
        bobs[j].pos.y += ay * pushFactor;

        // Optional: Add slight rotation on collision for juice
        bobs[i].angleVel += (Math.random() - 0.5) * 0.02;
        bobs[j].angleVel += (Math.random() - 0.5) * 0.02;

        // TRIGGER VISUAL EFFECT HERE (see Section 4.4)
        createCollisionSparks(
          (bobs[i].pos.x + bobs[j].pos.x) / 2,
          (bobs[i].pos.y + bobs[j].pos.y) / 2
        );
      }
    }
  }
}
```

### 3.2 Physics Parameter Optimization

**Goal:** Shift from "bouncy rubber band" to "heavy suspended gallery card".

| Parameter       | Current Value | New Value   | Rationale                                        |
| :-------------- | :------------ | :---------- | :----------------------------------------------- |
| **Gravity**     | `0.45`        | **0.65**    | Adds weight/authority to the cards.              |
| **Friction**    | `0.965`       | **0.94**    | Increases drag, reducing endless oscillation.    |
| **Mouse Force** | `2.5`         | **4.0**     | Makes interaction snappier and more responsive.  |
| **Mouse Range** | `180`         | **220**     | Starts reacting sooner, feeling more "aware".    |
| **Rest Length** | `260-340`     | **200-300** | Slightly tighter cluster for better mobile view. |

---

## 4. NEW ANIMATIONS (Priority 2 - Enhancements)

### 4.1 Breathing Glow (Idle State)

**Visual:** The colored glow behind the card gently expands and contracts, like the cat is breathing.
**Storytelling:** Even when still, the cats are alive.
**Code:**

```javascript
// Inside Bob.display() or draw loop
// Use frameCount to drive a sine wave
let breathSpeed = 0.03;
let breathAmp = 10;
let baseRadius = 260;

// Unique offset per cat so they don't breathe in unison
let breathOffset = this.index * 100;

let currentRadius =
  baseRadius + Math.sin(frameCount * breathSpeed + breathOffset) * breathAmp;

// Draw Glow
noStroke();
// Use the cat's specific color with low alpha
fill(this.color[0], this.color[1], this.color[2], 20);
circle(this.pos.x, this.pos.y, currentRadius);
```

### 4.2 String Energy Waves

**Visual:** Small pulses of light travel down the string from the anchor to the card.
**Storytelling:** Connection/Bonding. The "red thread of fate" connecting user to cat.
**Code:**

```javascript
// Inside Bob.displayString()
// Draw the main string first
stroke(this.color[0], this.color[1], this.color[2], 60);
strokeWeight(2);
line(this.anchor.x, this.anchor.y, this.pos.x, this.pos.y);

// Draw Energy Pulse
let pulseSpeed = 0.02;
let pulsePos = (frameCount * pulseSpeed + this.index * 0.5) % 1.0; // 0.0 to 1.0

// Linear interpolation for pulse position
let px = lerp(this.anchor.x, this.pos.x, pulsePos);
let py = lerp(this.anchor.y, this.pos.y, pulsePos);

noStroke();
fill(255, 255, 255, 180); // White hot center
circle(px, py, 4); // Small particle
fill(this.color[0], this.color[1], this.color[2], 100); // Colored glow
circle(px, py, 12);
```

### 4.3 Hover Bloom

**Visual:** When mouse is near, the card scales up slightly and the glow intensifies.
**Storytelling:** The cat perks up when you approach.
**Code:**

```javascript
// Inside Bob.update()
let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
let hoverThreshold = 150;
let targetScale = 1.0;
let targetAlpha = 60;

if (d < hoverThreshold) {
  targetScale = 1.1; // 10% larger
  targetAlpha = 100; // Brighter glow
  document.body.style.cursor = "pointer"; // UX hint
}

// Smoothly interpolate current values
this.currentScale = lerp(this.currentScale || 1.0, targetScale, 0.1);
this.currentAlpha = lerp(this.currentAlpha || 60, targetAlpha, 0.1);

// Apply in display
push();
translate(this.pos.x, this.pos.y);
scale(this.currentScale);
// ... draw card ...
pop();
```

### 4.4 Collision Sparks

**Visual:** Tiny particles burst when two cards bump.
**Storytelling:** Playful friction between cats.
**Code:**

```javascript
let particles = [];

function createCollisionSparks(x, y) {
  for (let i = 0; i < 5; i++) {
    particles.push({
      x: x,
      y: y,
      vx: random(-2, 2),
      vy: random(-2, 2),
      life: 255,
      color: [255, 255, 200], // Spark color
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 10;

    noStroke();
    fill(p.color[0], p.color[1], p.color[2], p.life);
    circle(p.x, p.y, 3);

    if (p.life <= 0) particles.splice(i, 1);
  }
}
```

---

## 5. IMPLEMENTATION ROADMAP

1.  **Backup:** Duplicate `index.html` to `index_backup.html`.
2.  **Phase 1: Physics Core**
    - Update `gravity`, `friction`, and `restLength` variables.
    - Inject `checkCollisions()` function.
    - Call `checkCollisions()` in `draw()` loop.
    - _Verify:_ Cards should bump and settle, not overlap.
3.  **Phase 2: Visuals**
    - Implement `Breathing Glow` in `Bob.display()`.
    - Implement `String Energy` in `Bob.display()`.
    - Implement `Hover Bloom` logic.
    - _Verify:_ Scene should feel "alive" even without mouse interaction.
4.  **Phase 3: Polish**
    - Add `Collision Sparks` system.
    - Final color check against palette.

---

## 6. VISUAL MOCKUPS (Descriptions)

**The Idle State:**
Imagine looking into a calm aquarium. The cards are floating gently, not perfectly still but drifting imperceptibly (Perlin noise). Behind each card, a soft, colored aura (matching the cat's personality color) breathes in and out rhythmically. Occasionally, a small bead of light travels down the string like a droplet of water, connecting the header to the card.

**The Interaction:**
As your mouse approaches "Little Orange" (Cat 0), the card swells slightly (Hover Bloom), as if leaning into a pet. The orange glow intensifies. If you push it into "Snowball" (Cat 1), they don't ghost through each other. Instead, they bump with a satisfying, soft "thud" (visualized by a tiny burst of yellow sparks), and Snowball swings away, preserving the physical space.

**The Aesthetic:**
Clean, modern, editorial. No clutter. The physics are the decoration. The colors are warm and inviting, set against the creamy `#fdfaf6` background. It feels like a high-end interactive museum exhibit.
