import fs from "fs"
import path from "path"

const relativePath = path.join(import.meta.dir, "./input.txt")
const file = fs.readFileSync(relativePath, "utf-8")
const lines = file.split("\n")

let sum = 0

const returnNumber = (phrase: string) => {
  switch (phrase) {
    case "one":
      return 1
    case "two":
      return 2
    case "three":
      return 3
    case "four":
      return 4
    case "five":
      return 5
    case "six":
      return 6
    case "seven":
      return 7
    case "eight":
      return 8
    case "nine":
      return 9
    default:
      return Number(phrase)
  }
}

for (const _line of lines) {
  const line = _line.trim()

  const phrase: string[] = []

  for (const [_charIndex, char] of Object.entries(line)) {
    const charIndex = Number(_charIndex)
    const scramble = line.slice(charIndex, charIndex + 5)
    const match = scramble.match(
      /one|two|three|four|five|six|seven|eight|nine|1|2|3|4|5|6|7|8|9/
    )

    if (match) {
      phrase.push(match[0])
    }
  }

  if (phrase.length === 0) {
    console.log("This should not happen...")
  }

  if (phrase.length === 1) {
    const firstDigit = returnNumber(phrase[0])
    const addAmount = Number(`${firstDigit}${firstDigit}`)
    sum += addAmount
    continue
  }

  const firstDigit = returnNumber(phrase[0])
  const lastDigit = returnNumber(phrase[phrase.length - 1])

  const addAmount = Number(`${firstDigit}${lastDigit}`)
  sum += addAmount
}

console.log("Sum:", sum)
