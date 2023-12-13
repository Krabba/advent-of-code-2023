import fs from "fs"
import path from "path"

const relativePath = path.join(import.meta.dir, "./input.txt")
const file = fs.readFileSync(relativePath, "utf-8")
const lines = file.split("\n")

function expandVertically(
  shouldExpand: boolean,
  lineIndex: number,
  charIndex: number
): boolean {
  const char = lines[lineIndex]?.[charIndex]

  if (char) {
    const hasGalaxy = char === "#"

    if (hasGalaxy) {
      shouldExpand = false
    } else {
      return expandVertically(shouldExpand, lineIndex + 1, charIndex)
    }
  }

  return shouldExpand
}

const checkedIndexes: number[] = []
const horizontalBucket: number[] = []
const verticalBucket: number[] = []

let galaxyId = 0
const galaxies: Array<{ id: string; location: number[] }> = []

const expandedLines = lines.map((_line, lineIndex) => {
  const line = _line.trim()
  let chars = line.split("")

  // Check if char index should be expanded vertically
  for (let [charIndex, char] of chars.entries()) {
    if (checkedIndexes.includes(charIndex)) continue

    const expand =
      char !== "#" && expandVertically(char !== "#", lineIndex, charIndex)

    if (expand) {
      verticalBucket.push(charIndex)
    }

    checkedIndexes.push(charIndex)
  }

  // Expand vertically
  for (const [index, charIndex] of Object.entries(verticalBucket)) {
    const modifiedIndex =
      Number(index) === 0 ? charIndex : charIndex + Number(index)

    chars = [
      ...chars.slice(0, modifiedIndex),
      "|",
      ...chars.slice(modifiedIndex),
    ]
  }

  // Check if line index should be expanded horizontally
  if (line.match(/^\.+$/g)) {
    horizontalBucket.push(lineIndex)
  }

  return chars
})

// Expand horizontally
for (const [index, lineIndex] of Object.entries(horizontalBucket)) {
  const modifiedIndex =
    Number(index) === 0 ? lineIndex : lineIndex + Number(index)

  expandedLines.splice(
    modifiedIndex,
    0,
    Array.from({ length: expandedLines[0].length }).fill("-") as string[]
  )
}

for (const [_lineIndex, line] of Object.entries(expandedLines)) {
  const lineIndex = Number(_lineIndex)
  if (line.includes("#")) {
    for (const [charIndex, char] of line.entries()) {
      if (char === "#") {
        galaxyId += 1
        galaxies.push({ id: `${galaxyId}`, location: [lineIndex, charIndex] })
      }
    }
  }
}

const verticalLines = verticalBucket.map((charIndex, index) => {
  return charIndex + index
})

const horizontalLines = horizontalBucket.map((lineIndex, index) => {
  return lineIndex + index
})

const sum = galaxies.reduce((acc, galaxy) => {
  const [lineIndex, charIndex] = galaxy.location

  const steps = galaxies.reduce((acc, target) => {
    if (galaxy.id === target.id) return acc

    const [targetLineIndex, targetCharIndex] = target.location
    const x = Math.abs(charIndex - targetCharIndex)
    const y = Math.abs(lineIndex - targetLineIndex)

    const crossingVerticalLines = verticalLines.filter((line) => {
      if (charIndex > targetCharIndex) {
        return line < charIndex && targetCharIndex < line
      }

      return line > charIndex && targetCharIndex > line
    })

    const crossingHorizontalLines = horizontalLines.filter((line) => {
      if (lineIndex > targetLineIndex) {
        return line < lineIndex && targetLineIndex < line
      }

      return line > lineIndex && targetLineIndex > line
    })

    const result =
      x +
      y +
      crossingVerticalLines.length * 999998 +
      crossingHorizontalLines.length * 999998

    return acc + result
  }, 0)

  return acc + steps
}, 0)

console.log("Sum:", sum / 2)
