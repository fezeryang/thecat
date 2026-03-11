import os

files = {
    "CatBuding.tsx": "#ffffff",
    "CatHuahua.tsx": "#3d9a5c",
    "CatMomo.tsx": "rainbow",
    "CatTiaowen.tsx": "#5a8a5e",
    "CatXiaoyu.tsx": "#b0956a",
    "CatXueqiu.tsx": "#ffffff"
}

for filename, color in files.items():
    filepath = f"client/src/pages/cats/{filename}"
    with open(filepath, "r") as f:
        content = f.read()
    
    # Add import
    if "import ParticleBackground" not in content:
        content = content.replace('import { getCatById } from "@/lib/cats";', 'import ParticleBackground from "@/components/ParticleBackground";\nimport { getCatById } from "@/lib/cats";')
    
    # Add component
    if "<ParticleBackground" not in content:
        if color == "rainbow":
            component = '      <ParticleBackground isRainbow />\n'
        else:
            component = f'      <ParticleBackground color="{color}" />\n'
        
        # Find the last </div>
        last_div_index = content.rfind('</div>')
        if last_div_index != -1:
            content = content[:last_div_index] + component + content[last_div_index:]
            
    with open(filepath, "w") as f:
        f.write(content)

print("Done")
