import fs from "fs"
import path from "path"

const relativePath = path.join(import.meta.dir, "./input.txt")
const file = fs.readFileSync(relativePath, "utf-8")
const lines = file.split("\n")

let sum = 0

for (const _line of lines) {
  const line = _line.trim()

  const numbers = line.replace(/[a-zA-Z]/g, "")
  const numberLength = numbers.length

  if (numberLength === 1) {
    const addAmount = Number(`${numbers}${numbers}`)
    sum += addAmount
    continue
  }

  const firstDigit = numbers[0]
  const lastDigit = numbers[numberLength - 1]

  const addAmount = Number(`${firstDigit}${lastDigit}`)
  sum += addAmount
}

console.log("Sum:", sum)
