import fs from "fs"
import path from "path"

const relativePath = path.join(import.meta.dir, "./input.txt")
const file = fs.readFileSync(relativePath, "utf-8")
const lines = file.split("\n")

let sum = 0

for (const _line of lines) {
  const line = _line.trim()

  const [card, numbers] = line.split(": ")
  const [_winningNumbers, _numbersYouHave] = numbers.split(" | ")

  const winningNumbers = _winningNumbers
    .trim()
    .split(" ")
    .filter((n) => n)
    .map((n) => Number(n))

  const numbersYouHave = _numbersYouHave
    .trim()
    .split(" ")
    .filter((n) => n)
    .map((n) => Number(n))

  let amountOfWinningNumbers = 0

  for (const number of numbersYouHave) {
    if (winningNumbers.includes(number)) {
      amountOfWinningNumbers += 1
    }
  }

  let pointsFromCard = 0

  if (amountOfWinningNumbers >= 1) {
    pointsFromCard = 1

    // We loop through amountOfWinningNumbers - 1 because we assign the first winning number above
    for (let i = 0; i < amountOfWinningNumbers - 1; i++) {
      pointsFromCard *= 2
    }
  }

  sum += pointsFromCard
}

console.log("Sum:", sum)
