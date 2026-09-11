export interface Dot {
  x: number
  y: number
}

export interface DotMap {
  columns: number
  rows: number
  dots: Dot[]
}

/** Distance between dot centers, in viewBox units. */
export const DotPitch = 10

export const DotRadius = 4

const LetterGap = 2

function parse(cells: readonly string[]): DotMap {
  const dots: Dot[] = []

  cells.forEach((row, y) => {
    row
      .split("")
      .forEach((cell, x) => {
        if (cell !== " " && cell !== ".") {
          dots.push({
            x,
            y,
          })
        }
      })
  })

  return {
    columns: Math.max(...cells.map((row) => row.length)),
    rows: cells.length,
    dots,
  }
}

export const House = parse([
  "...X...",
  "..XXX..",
  ".XXXXX.",
  "XXXXXXX",
  ".XXXXX.",
  ".XX.XX.",
  ".XX.XX.",
])

const Glyphs: Record<string, DotMap> = {
  A: parse([
    ".XXXXX.",
    "XXXXXXX",
    "XX...XX",
    "XX...XX",
    "XXXXXXX",
    "XXXXXXX",
    "XX...XX",
    "XX...XX",
    "XX...XX",
    "XX...XX",
  ]),
  B: parse([
    "XXXXXX.",
    "XXXXXXX",
    "XX...XX",
    "XX...XX",
    "XXXXXXX",
    "XXXXXXX",
    "XX...XX",
    "XX...XX",
    "XXXXXXX",
    "XXXXXX.",
  ]),
  E: parse([
    "XXXXXXX",
    "XXXXXXX",
    "XX.....",
    "XX.....",
    "XXXXX..",
    "XXXXX..",
    "XX.....",
    "XX.....",
    "XXXXXXX",
    "XXXXXXX",
  ]),
  H: parse([
    "XX...XX",
    "XX...XX",
    "XX...XX",
    "XX...XX",
    "XXXXXXX",
    "XXXXXXX",
    "XX...XX",
    "XX...XX",
    "XX...XX",
    "XX...XX",
  ]),
  M: parse([
    "XX.....XX",
    "XXX...XXX",
    "XXXX.XXXX",
    "XX.XXX.XX",
    "XX..X..XX",
    "XX.....XX",
    "XX.....XX",
    "XX.....XX",
    "XX.....XX",
    "XX.....XX",
  ]),
  O: parse([
    ".XXXXX.",
    "XXXXXXX",
    "XX...XX",
    "XX...XX",
    "XX...XX",
    "XX...XX",
    "XX...XX",
    "XX...XX",
    "XXXXXXX",
    ".XXXXX.",
  ]),
  S: parse([
    ".XXXXX.",
    "XXXXXXX",
    "XX...XX",
    "XX.....",
    "XXXXXX.",
    ".XXXXXX",
    ".....XX",
    "XX...XX",
    "XXXXXXX",
    ".XXXXX.",
  ]),
}

export function word(text: string): DotMap {
  const glyphs = text
    .split("")
    .map((char) => Glyphs[char])
    .filter((glyph) => glyph !== undefined)

  let offset = 0
  const dots: Dot[] = []

  for (const glyph of glyphs) {
    for (const dot of glyph.dots) {
      dots.push({
        x: dot.x + offset,
        y: dot.y,
      })
    }

    offset += glyph.columns + LetterGap
  }

  return {
    columns: Math.max(0, offset - LetterGap),
    rows: Math.max(...glyphs.map((glyph) => glyph.rows)),
    dots,
  }
}

/**
 * Dots bucketed by column so they can be animated as a wave without
 * putting an inline style on every single dot.
 */
export function byColumn(map: DotMap): Dot[][] {
  const columns: Dot[][] = Array
    .from({ length: map.columns })
    .map(() => [])

  for (const dot of map.dots) {
    columns[dot.x].push(dot)
  }

  return columns
}
