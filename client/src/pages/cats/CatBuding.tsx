/**
 * CatBuding.tsx — 布丁 | 系统调试员
 * Design: Retro Windows 98/XP OS aesthetic with draggable windows
 * Theme: Teal desktop #008080, Windows chrome gray/blue
 * Layout: Desktop metaphor — draggable windows, taskbar, pixel cat
 * Features: 6 draggable windows, pixel art cat, terminal input, pet status system
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "wouter";
import { getCatById } from "@/lib/cats";
import ParticleBackground from "@/components/ParticleBackground";

const cat = getCatById("buding")!;

interface WinState { x: number; y: number; minimized: boolean; zIndex: number; width?: number }

const INITIAL_WINDOWS: Record<string, WinState> = {
  main:     { x: 60,  y: 50,  minimized: false, zIndex: 10, width: 320 },
  monitor:  { x: 420, y: 70,  minimized: false, zIndex: 9,  width: 280 },
  gallery:  { x: 80,  y: 330, minimized: false, zIndex: 8,  width: 360 },
  terminal: { x: 460, y: 340, minimized: false, zIndex: 7,  width: 340 },
  about:    { x: 250, y: 190, minimized: false, zIndex: 6,  width: 280 },
  diary:    { x: 680, y: 180, minimized: false, zIndex: 5,  width: 260 },
};

const DIARY_ENTRIES = [
  { date: "03/02", entry: "今天食堂的阿姨给了我一块鸡腿，人间值得" },
  { date: "03/01", entry: "发现了一个新的暖气片，比之前的更暖" },
  { date: "02/28", entry: "有同学带来了罐头，我装了半小时可怜" },
  { date: "02/27", entry: "下雨天，在食堂门口蹲守了三小时" },
];

export default function CatBuding() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [windows, setWindows] = useState<Record<string, WinState>>(INITIAL_WINDOWS);
  const [topZ, setTopZ] = useState(15);
  const [time, setTime] = useState(new Date());
  const [feeding, setFeeding] = useState(false);
  const [hunger, setHunger] = useState(72);
  const [sleepiness, setSleepiness] = useState(88);
  const [mood, setMood] = useState(95);
  const [petCount, setPetCount] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    "C:\\CampusCats> cat_debug.exe --target=buding",
    "Loading cat profile... [████████████] 100%",
    "",
    "while(awake) {",
    "  eat(food);",
    "  nap(3600);",
    "  demand_pets();",
    "}",
    "",
    "STATUS: PURRING_ACTIVE",
    "C:\\CampusCats> _",
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setHunger((h) => Math.min(100, h + 0.4));
      setSleepiness((s) => Math.max(0, s - 0.15));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLines]);

  const bringToFront = useCallback((id: string) => {
    const newZ = topZ + 1;
    setTopZ(newZ);
    setWindows((w) => ({ ...w, [id]: { ...w[id], zIndex: newZ } }));
  }, [topZ]);

  const handleFeed = () => {
    setFeeding(true);
    setHunger((h) => Math.max(0, h - 35));
    setMood((m) => Math.min(100, m + 15));
    setTerminalLines((l) => [...l.slice(-20), "", "> FEEDING_EVENT detected", `> hunger -= 35 → ${Math.max(0, Math.round(hunger - 35))}%`, "> mood += 15", "> STATUS: HAPPY_PURRING ♥"]);
    setTimeout(() => setFeeding(false), 2500);
  };

  const handleSleep = () => {
    setSleepiness((s) => Math.min(100, s + 45));
    setMood((m) => Math.min(100, m + 8));
    setTerminalLines((l) => [...l.slice(-20), "", "> SLEEP_MODE activated", "> Zzz... Zzz...", "> sleep += 45", "> STATUS: DREAMING"]);
  };

  const handlePet = () => {
    setPetCount((c) => c + 1);
    setMood((m) => Math.min(100, m + 5));
    setTerminalLines((l) => [...l.slice(-20), `> PET_EVENT #${petCount + 1} → purr intensity +5`]);
  };

  const handleTerminalSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && terminalInput.trim()) {
      const cmd = terminalInput.trim().toLowerCase();
      let response = "";
      if (cmd === "help") response = "Commands: feed, sleep, pet, status, clear";
      else if (cmd === "feed") { handleFeed(); response = "Feeding buding..."; }
      else if (cmd === "sleep") { handleSleep(); response = "Activating sleep mode..."; }
      else if (cmd === "pet") { handlePet(); response = "Petting buding... purr~"; }
      else if (cmd === "status") response = `hunger:${Math.round(hunger)}% sleep:${Math.round(sleepiness)}% mood:${Math.round(mood)}%`;
      else if (cmd === "clear") { setTerminalLines(["C:\\CampusCats> _"]); setTerminalInput(""); return; }
      else response = `'${cmd}' is not recognized. Type 'help'.`;
      setTerminalLines((l) => [...l.slice(-20), `C:\\CampusCats> ${terminalInput}`, response, "C:\\CampusCats> _"]);
      setTerminalInput("");
    }
  };

  const makeDraggable = (id: string) => {
    let startX = 0, startY = 0, startWX = 0, startWY = 0;
    const onMouseMove = (e: MouseEvent) => {
      setWindows((w) => ({ ...w, [id]: { ...w[id], x: Math.max(0, startWX + e.clientX - startX), y: Math.max(0, startWY + e.clientY - startY) } }));
    };
    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    return (e: React.MouseEvent) => {
      bringToFront(id);
      startX = e.clientX; startY = e.clientY;
      startWX = windows[id].x; startWY = windows[id].y;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };
  };

  useEffect(() => {
    let p5Instance: any;
    const initP5 = async () => {
      const p5 = (await import("p5")).default;
      const sketch = (p: any) => {
        let frame = 0;
        const catPixels = [
          [0,0,1,1,0,0,1,1,0,0],
          [0,1,1,1,1,1,1,1,1,0],
          [1,1,2,1,1,1,1,2,1,1],
          [1,1,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,1,1],
          [0,1,1,1,1,1,1,1,1,0],
          [0,0,1,1,0,0,1,1,0,0],
          [0,0,1,0,0,0,0,1,0,0],
        ];
        let hearts: Array<{ x: number; y: number; life: number; scale: number }> = [];
        let stars: Array<{ x: number; y: number; vx: number; vy: number; life: number }> = [];

        p.setup = () => {
          const cnv = p.createCanvas(p.windowWidth, p.windowHeight);
          cnv.parent(canvasRef.current!);
          cnv.style("position", "fixed");
          cnv.style("top", "0"); cnv.style("left", "0");
          cnv.style("pointer-events", "none");
          p.noSmooth();
        };

        p.draw = () => {
          p.clear();
          frame++;

          // Desktop icons (decorative)
          const iconPositions = [
            { x: 20, y: 80, emoji: "🐾", label: "paw.ico" },
            { x: 20, y: 150, emoji: "🍮", label: "food.exe" },
            { x: 20, y: 220, emoji: "💤", label: "nap.bat" },
          ];
          iconPositions.forEach((icon) => {
            p.fill(255, 255, 255, 180);
            p.noStroke();
            p.textSize(22);
            p.textAlign(p.CENTER);
            p.text(icon.emoji, icon.x + 16, icon.y + 20);
            p.fill(255, 255, 255, 200);
            p.textSize(7);
            p.textFont("monospace");
            p.text(icon.label, icon.x + 16, icon.y + 36);
          });

          // Floating pixel cat
          const bobY = p.sin(frame * 0.04) * 6;
          const walkX = p.width * 0.85 + p.sin(frame * 0.02) * 20;
          const px = walkX;
          const py = p.height * 0.48 + bobY;
          const ps = 9;

          catPixels.forEach((row, ri) => {
            row.forEach((cell, ci) => {
              if (cell === 0) return;
              if (cell === 2) p.fill(50, 30, 20);
              else p.fill(232, 149, 109);
              p.noStroke();
              p.rect(px + ci * ps - 45, py + ri * ps - 36, ps, ps);
            });
          });

          // Hearts when feeding
          if (p5Ref.current?._feeding) {
            if (frame % 12 === 0) {
              hearts.push({ x: px + p.random(-20, 20), y: py - 20, life: 1, scale: p.random(0.8, 1.5) });
            }
          }
          hearts = hearts.filter((h) => h.life > 0);
          hearts.forEach((h) => {
            h.y -= 1.5;
            h.life -= 0.02;
            p.fill(255, 100, 120, h.life * 220);
            p.noStroke();
            p.textSize(16 * h.scale);
            p.textAlign(p.CENTER);
            p.text("♥", h.x, h.y);
          });

          // Stars when petted
          if (p5Ref.current?._petCount !== undefined && p5Ref.current._petCount > 0) {
            if (frame % 8 === 0) {
              stars.push({ x: px + p.random(-30, 30), y: py + p.random(-30, 30), vx: p.random(-2, 2), vy: p.random(-3, -1), life: 1 });
            }
          }
          stars = stars.filter((s) => s.life > 0);
          stars.forEach((s) => {
            s.x += s.vx; s.y += s.vy;
            s.life -= 0.025;
            p.fill(255, 220, 50, s.life * 200);
            p.noStroke();
            p.textSize(12);
            p.text("★", s.x, s.y);
          });

          // Tail wagging
          const tailWag = p.sin(frame * 0.08) * 15;
          p.stroke(232, 149, 109);
          p.strokeWeight(4);
          p.noFill();
          p.beginShape();
          p.curveVertex(px + 45, py + 30);
          p.curveVertex(px + 55, py + 40 + tailWag);
          p.curveVertex(px + 70, py + 35 + tailWag * 0.5);
          p.endShape();
        };

        const p5Ref2 = { current: null as any };
        p5Ref2.current = p;
        Object.assign(p5Ref.current || {}, p);
      };

      p5Instance = new p5(sketch);
    };
    initP5();
    return () => { if (p5Instance) p5Instance.remove(); };
  }, []);

  const p5Ref = useRef<any>({});
  useEffect(() => {
    p5Ref.current._feeding = feeding;
    p5Ref.current._petCount = petCount;
  }, [feeding, petCount]);

  const winStyle = (id: string): React.CSSProperties => ({
    position: "fixed",
    left: windows[id].x,
    top: windows[id].y,
    zIndex: windows[id].zIndex,
    display: windows[id].minimized ? "none" : "block",
    userSelect: "none",
    width: windows[id].width,
  });

  const titleBar = (id: string, title: string, icon: string) => (
    <div
      onMouseDown={makeDraggable(id)}
      style={{ background: "linear-gradient(to right, #000080, #1084d0)", padding: "3px 4px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "move", userSelect: "none" }}
    >
      <span style={{ color: "white", fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>
        {icon} {title}
      </span>
      <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
        {["_", "×"].map((btn) => (
          <button key={btn} onClick={() => { if (btn === "×" || btn === "_") setWindows((w) => ({ ...w, [id]: { ...w[id], minimized: true } })); }}
            style={{ width: 16, height: 14, background: "#c0c0c0", border: "1px solid", borderColor: "#fff #808080 #808080 #fff", fontFamily: "var(--font-mono)", fontSize: "0.55rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>
            {btn}
          </button>
        ))}
      </div>
    </div>
  );

  const winBody: React.CSSProperties = { background: "#c0c0c0", border: "2px solid", borderColor: "#fff #808080 #808080 #fff", boxShadow: "3px 3px 0 #000" };
  const insetPanel: React.CSSProperties = { background: "#fff", border: "2px solid", borderColor: "#808080 #fff #fff #808080", padding: "8px", margin: "6px", fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "#000" };
  const btn98: React.CSSProperties = { padding: "4px 10px", background: "#c0c0c0", border: "2px solid", borderColor: "#fff #808080 #808080 #fff", fontFamily: "var(--font-mono)", fontSize: "0.66rem", cursor: "pointer", fontWeight: 600 };

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: "linear-gradient(135deg, #008080 0%, #006060 100%)", fontFamily: "var(--font-mono)" }}>
      <div ref={canvasRef} className="absolute inset-0 z-0" style={{ pointerEvents: "none" }} />
      <ParticleBackground color="#ffffff" />

      {/* Main window */}
      <div style={{ ...winStyle("main"), ...winBody }} onClick={() => bringToFront("main")}>
        {titleBar("main", "C:\\Campus\\Cats\\BuDing.exe", "🐱")}
        <div style={{ padding: "8px" }}>
          <div style={insetPanel}>
            <div style={{ textAlign: "center", marginBottom: 8, fontSize: "2.2rem" }}>🐈</div>
            <div style={{ color: "#0000aa" }}>&gt; cat.name = "布丁"</div>
            <div style={{ color: "#0000aa" }}>&gt; cat.breed = "{cat.breed}"</div>
            <div style={{ color: "#0000aa" }}>&gt; cat.location = "{cat.location}"</div>
            <div style={{ color: "#0000aa" }}>&gt; cat.mood = "{feeding ? "超级开心 ♥" : "慵懒模式 💤"}"</div>
            <div style={{ color: "#0000aa" }}>&gt; cat.pets_today = {petCount}</div>
          </div>
          <div style={{ display: "flex", gap: 6, padding: "0 6px 6px" }}>
            <button onClick={handleFeed} style={{ ...btn98, flex: 1 }}>{feeding ? "😋 投喂中..." : "🐟 投喂"}</button>
            <button onClick={handleSleep} style={{ ...btn98, flex: 1 }}>💤 哄睡</button>
            <button onClick={handlePet} style={{ ...btn98, flex: 1 }}>🤚 撸猫</button>
          </div>
        </div>
      </div>

      {/* System monitor */}
      <div style={{ ...winStyle("monitor"), ...winBody }} onClick={() => bringToFront("monitor")}>
        {titleBar("monitor", "系统监视器.exe", "📊")}
        <div style={{ padding: "8px" }}>
          {[
            { label: "饥饿度", value: hunger, color: "#ff8800" },
            { label: "困倦度", value: sleepiness, color: "#8800ff" },
            { label: "撒娇指数", value: mood, color: "#ff0088" },
            { label: "活跃度", value: 100 - sleepiness, color: "#00aa00" },
          ].map((item) => (
            <div key={item.label} style={{ ...insetPanel, marginBottom: 4, padding: "5px 8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: "0.6rem" }}>
                <span>{item.label}</span>
                <span style={{ fontWeight: 700 }}>{Math.round(item.value)}%</span>
              </div>
              <div style={{ height: 12, background: "#808080", border: "1px solid #606060" }}>
                <div style={{ height: "100%", width: `${Math.min(100, item.value)}%`, background: item.color, transition: "width 0.5s" }} />
              </div>
            </div>
          ))}
          <div style={{ ...insetPanel, padding: "5px 8px", fontSize: "0.6rem", color: "#808080" }}>
            撸猫次数: {petCount} 次 ★
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div style={{ ...winStyle("gallery"), ...winBody }} onClick={() => bringToFront("gallery")}>
        {titleBar("gallery", "D:\\Photos\\BuDing_Gallery.rar", "🖼️")}
        <div style={{ padding: "8px" }}>
          <div style={insetPanel}>
            <p style={{ marginBottom: 8, lineHeight: 1.6 }}>{cat.description}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, padding: "0 6px 6px" }}>
            {["🐾", "😺", "🐈", "🌸", "⭐", "🍮", "💕", "🎀"].map((emoji, i) => (
              <div key={i} style={{ ...insetPanel, margin: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", height: 46, cursor: "pointer" }} onClick={handlePet}>
                {emoji}
              </div>
            ))}
          </div>
          <div style={{ ...insetPanel, fontSize: "0.58rem", color: "#808080", padding: "4px 8px" }}>
            {cat.tags.join(" · ")}
          </div>
        </div>
      </div>

      {/* Terminal */}
      <div style={{ ...winStyle("terminal"), ...winBody }} onClick={() => bringToFront("terminal")}>
        {titleBar("terminal", "C:\\WINDOWS\\SYSTEM32\\cat_debug.bat", "💻")}
        <div style={{ padding: "6px" }}>
          <div style={{ ...insetPanel, background: "#000", color: "#00ff00", height: 150, overflowY: "auto", fontSize: "0.6rem", lineHeight: 1.5 }}>
            {terminalLines.map((line, i) => (
              <div key={i} style={{ color: line.startsWith(">") ? "#00ff88" : line.startsWith("C:\\") ? "#00ff00" : "#88ff88" }}>{line}</div>
            ))}
            <div ref={terminalEndRef} />
          </div>
          <div style={{ display: "flex", gap: 4, margin: "4px 6px 2px" }}>
            <span style={{ color: "#000", fontFamily: "var(--font-mono)", fontSize: "0.6rem", alignSelf: "center" }}>C:\&gt;</span>
            <input
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={handleTerminalSubmit}
              style={{ flex: 1, background: "#fff", border: "2px solid", borderColor: "#808080 #fff #fff #808080", fontFamily: "var(--font-mono)", fontSize: "0.6rem", padding: "2px 4px", outline: "none" }}
              placeholder="type 'help'"
            />
          </div>
        </div>
      </div>

      {/* About */}
      <div style={{ ...winStyle("about"), ...winBody }} onClick={() => bringToFront("about")}>
        {titleBar("about", "关于布丁.txt", "💾")}
        <div style={{ padding: "8px" }}>
          <div style={insetPanel}>
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <div style={{ fontSize: "2.5rem" }}>🍮</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.78rem" }}>档案 #{cat.number} — 布丁</div>
                <div style={{ color: "#808080", fontSize: "0.58rem" }}>{cat.breed} · {cat.location}</div>
              </div>
            </div>
            {cat.funFacts.slice(0, 3).map((fact, i) => (
              <div key={i} style={{ fontSize: "0.6rem", color: "#333", marginBottom: 4, lineHeight: 1.5 }}>
                [{i + 1}] {fact}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, padding: "0 6px 6px" }}>
            <button onClick={handleFeed} style={{ ...btn98, flex: 1 }}>投喂布丁</button>
            <button onClick={handlePet} style={{ ...btn98, flex: 1 }}>撸猫</button>
          </div>
        </div>
      </div>

      {/* Diary */}
      <div style={{ ...winStyle("diary"), ...winBody }} onClick={() => bringToFront("diary")}>
        {titleBar("diary", "布丁日记.txt", "📔")}
        <div style={{ padding: "8px" }}>
          <div style={{ ...insetPanel, fontSize: "0.6rem" }}>
            <div style={{ fontWeight: 700, marginBottom: 6, color: "#0000aa" }}>// 布丁的日记本</div>
            {DIARY_ENTRIES.map((entry, i) => (
              <div key={i} style={{ marginBottom: 8, paddingBottom: 6, borderBottom: i < DIARY_ENTRIES.length - 1 ? "1px dashed #ccc" : "none" }}>
                <div style={{ color: "#808080", fontSize: "0.55rem", marginBottom: 2 }}>{entry.date}</div>
                <div style={{ lineHeight: 1.5 }}>{entry.entry}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Taskbar */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000, height: 36, background: "#c0c0c0", borderTop: "2px solid #fff", display: "flex", alignItems: "center", gap: 3, padding: "0 4px" }}>
        <button style={{ ...btn98, padding: "2px 10px", height: 28, display: "flex", alignItems: "center", gap: 4 }}>
          🪟 开始
        </button>
        <div style={{ width: 1, height: 24, background: "#808080", margin: "0 2px" }} />
        {Object.entries(windows).map(([id, state]) => (
          <button key={id} onClick={() => setWindows((w) => ({ ...w, [id]: { ...w[id], minimized: !w[id].minimized } }))}
            style={{ padding: "2px 8px", height: 24, background: state.minimized ? "#c0c0c0" : "#a0a0a0", border: "2px solid", borderColor: state.minimized ? "#fff #808080 #808080 #fff" : "#808080 #fff #fff #808080", fontFamily: "var(--font-mono)", fontSize: "0.58rem", cursor: "pointer", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            🐱 {id === "main" ? "BuDing.exe" : id === "monitor" ? "系统监视器" : id === "gallery" ? "相册" : id === "terminal" ? "终端" : id === "about" ? "关于" : "日记"}
          </button>
        ))}
        <div style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.68rem", padding: "0 8px", borderLeft: "1px solid #808080" }}>
          {time.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {/* Back button */}
      <Link href="/" style={{ position: "fixed", top: 8, right: 8, zIndex: 2000, fontFamily: "var(--font-mono)", fontSize: "0.62rem", fontWeight: 700, padding: "4px 12px", background: "#c0c0c0", border: "2px solid", borderColor: "#fff #808080 #808080 #fff", color: "#000", textDecoration: "none" }}>
        ← 返回主页
      </Link>

      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </div>
  );
}
