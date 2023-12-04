import fs from "fs"
import path from "path"

const relativePath = path.join(import.meta.dir, "./input.txt")
const file = fs.readFileSync(relativePath, "utf-8")
const lines = file.split("\n")

let sum = 0

function isNumber(char: string) {
  if (char === "") return false
  const num = Number(char)
  return !isNaN(num)
}

function isNumberOrDot(char: string) {
  if (!char) return false
  return char.match(/[0-9]|\./)
}

function symbolConnected(startIndex: number, length: number, line: string) {
  if (!line) return false

  let symbolFound = false

  // -1 start and length + 1 to cover one extra left/right as a "wrapper scan"
  for (let i = -1; i < length + 1; i++) {
    const char = line[startIndex + i]
    if (char && !isNumberOrDot(char)) {
      symbolFound = true
    }
  }

  return symbolFound
}

for (const [_lineNumber, _line] of Object.entries(lines)) {
  const lineNumber = Number(_lineNumber)
  const line = _line.trim()
  const lineAbove = lines[lineNumber - 1]
  const lineBelow = lines[lineNumber + 1]

  let startIndex = 0
  let accumulator = ""
  const partNumbers: string[] = []

  for (const [_charIndex, char] of Object.entries(line)) {
    const charIndex = Number(_charIndex)

    if (isNumber(char)) {
      if (accumulator === "") {
        startIndex = charIndex
      }

      accumulator += char
    }

    const nextChar = line[charIndex + 1]

    if (!nextChar || !isNumber(nextChar)) {
      if (accumulator === "") {
        continue
      }

      const partNoLength = accumulator.length

      const symbolAbove = symbolConnected(startIndex, partNoLength, lineAbove)
      const symbolAdjacent = symbolConnected(startIndex, partNoLength, line)
      const symbolBelow = symbolConnected(startIndex, partNoLength, lineBelow)

      if (symbolAbove || symbolAdjacent || symbolBelow) {
        partNumbers.push(accumulator)
      } else {
        console.log("This number has no symbols around it:", accumulator)
      }

      accumulator = ""
    }
  }

  for (const partNo of partNumbers) {
    if (isNumber(partNo)) {
      sum += Number(partNo)
    }
  }
}

console.log("Sum:", sum)
