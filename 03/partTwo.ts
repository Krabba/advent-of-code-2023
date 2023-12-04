import fs from "fs"
import path from "path"

const relativePath = path.join(import.meta.dir, "./input.txt")
const file = fs.readFileSync(relativePath, "utf-8")
const lines = file.split("\n")

function isNumber(char: string) {
  if (char === "") return false
  const num = Number(char)
  return !isNaN(num)
}

function isMultiplier(char: string) {
  if (!char) return false
  return char.match(/\*/)
}

function isNumberOrDot(char: string) {
  if (!char) return false
  return char.match(/[0-9]|\./)
}

function symbolConnected(startIndex: number, length: number, line: string) {
  if (!line)
    return {
      symbolFound: false,
      symbolIndex: null,
    }

  let symbolFound = false
  let symbolIndex = null

  // -1 start and length + 1 to cover one extra left/right as a "wrapper scan"
  for (let i = -1; i < length + 1; i++) {
    const char = line[startIndex + i]
    if (char && !isNumberOrDot(char) && isMultiplier(char)) {
      symbolFound = true
      symbolIndex = startIndex + i
    }
  }

  return {
    symbolFound: symbolFound,
    symbolIndex: symbolIndex,
  }
}

const partNumbers: Array<{
  id: number
  value: string
  symbolLine: number | null
  symbolIndex: number | null
}> = []

for (const [_lineNumber, _line] of Object.entries(lines)) {
  const lineNumber = Number(_lineNumber)
  const line = _line.trim()
  const lineAbove = lines[lineNumber - 1]
  const lineBelow = lines[lineNumber + 1]

  let startIndex = 0
  let accumulator = ""

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

      const above = symbolConnected(startIndex, partNoLength, lineAbove)
      const adjacent = symbolConnected(startIndex, partNoLength, line)
      const below = symbolConnected(startIndex, partNoLength, lineBelow)

      if (above.symbolFound || adjacent.symbolFound || below.symbolFound) {
        partNumbers.push({
          id: Math.random(),
          value: accumulator,
          symbolLine: above.symbolFound
            ? lineNumber - 1
            : adjacent.symbolFound
            ? lineNumber
            : lineNumber + 1,
          symbolIndex:
            above.symbolIndex ?? adjacent.symbolIndex ?? below.symbolIndex,
        })
      } else {
        console.log("This number has no * around it:", accumulator)
      }

      accumulator = ""
    }
  }
}

let sum = 0
const usedIds: number[] = []

for (const partNo of partNumbers) {
  if (usedIds.includes(partNo.id)) continue

  const pairNumber = partNumbers.find((p) => {
    return (
      p.id !== partNo.id &&
      p.symbolLine === partNo.symbolLine &&
      p.symbolIndex === partNo.symbolIndex
    )
  })

  if (!pairNumber) continue

  const gearRatio = Number(partNo.value) * Number(pairNumber.value)
  sum += gearRatio

  usedIds.push(partNo.id, pairNumber?.id)
}

console.log("Sum:", sum)
