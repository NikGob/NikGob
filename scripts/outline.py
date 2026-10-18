"""Turns the display lettering into SVG paths, so it looks the same on every machine.

Writes scripts/outlines.json, which generate.mjs reads. Run it again only when a
title or the header text changes (needs the Windows fonts, or FONT_DIR):

    python scripts/outline.py
"""

import json
import os
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

FONT_DIR = Path(os.environ.get("FONT_DIR", r"C:\Windows\Fonts"))
OUT = Path(__file__).with_name("outlines.json")

BLACK = "ariblk.ttf"
BOLD = "arialbd.ttf"

# key: (font file, text, tracking in em)
SPECS = {
    "wordmark": (BLACK, "NIKGOB", -0.02),
    "tagline": (BOLD, "C# DEVELOPER  ·  NIKGOB.COM", 0.14),
    "est": (BOLD, "EST. 2023", 0.14),
    "facts1": (BLACK, "Nikgob", -0.01),
    "facts2": (BLACK, "Facts", -0.01),
    "title:ClockManage": (BLACK, "ClockManage", -0.01),
    "title:Steam-Currency": (BLACK, "Steam-Currency", -0.01),
    "title:share.nikgob": (BLACK, "share.nikgob", -0.01),
    "title:404": (BLACK, "404", -0.01),
}
STRIP = ["C# / .NET", "RUST", "TYPESCRIPT", "TAURI", "MCP", "GO", "KOTLIN", "FLUTTER", "PYTHON"]
for word in STRIP:
    SPECS[f"strip:{word}"] = (BOLD, word, 0.12)

SIZE = 100  # paths are drawn at font-size 100px, baseline at y=0


def kerning(font):
    pairs = {}
    if "kern" in font:
        for table in font["kern"].kernTables:
            if hasattr(table, "kernTable"):
                pairs.update(table.kernTable)
    return pairs


def outline(font, text, tracking):
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    kern = kerning(font)
    upm = font["head"].unitsPerEm
    scale = SIZE / upm
    pen = SVGPathPen(glyphs, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
    x = 0.0
    prev = None
    for ch in text:
        name = cmap[ord(ch)]
        if prev:
            x += kern.get((prev, name), 0) * scale
        glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, x, 0)))
        x += glyphs[name].width * scale + tracking * SIZE
        prev = name
    x -= tracking * SIZE
    os2 = font["OS/2"]
    return {
        "d": pen.getCommands(),
        "width": round(x, 2),
        "cap": round(os2.sCapHeight * scale, 2),
    }


def main():
    fonts = {}
    result = {"size": SIZE, "strip": STRIP}
    for key, (file, text, tracking) in SPECS.items():
        font = fonts.setdefault(file, TTFont(FONT_DIR / file))
        result[key] = outline(font, text, tracking)
    OUT.write_text(json.dumps(result, indent=1), encoding="utf-8")
    print(f"wrote {OUT.name}: {len(SPECS)} outlines")


if __name__ == "__main__":
    main()
