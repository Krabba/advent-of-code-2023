import fs from "fs"
import path from "path"

const relativePath = path.join(import.meta.dir, "./input.txt")
const file = fs.readFileSync(relativePath, "utf-8")
const lines = file.split("\n")

let amountOfOriginalCards = 0

interface Reward {
  [cardNumber: string]: number[]
}

const rewardList: Reward = {}

for (const _line of lines) {
  const line = _line.trim()

  const [card, numbers] = line.split(": ")
  const cardNumber = Number(card.replace(/[a-zA-Z]/g, "").trim())
  amountOfOriginalCards += 1

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

  const rewardsFromCard: number[] = []

  if (amountOfWinningNumbers >= 1) {
    // We loop through amountOfWinningNumbers + 1 because we want i to start at 1
    for (let i = 1; i < amountOfWinningNumbers + 1; i++) {
      rewardsFromCard.push(cardNumber + i)
    }
  }

  rewardList[cardNumber] = rewardsFromCard
}

const instances: number[] = []

for (const [cardNumber, rewardFromOriginalCard] of Object.entries(rewardList)) {
  instances.push(...rewardFromOriginalCard)

  let copies: number[] = []

  for (const copy of rewardFromOriginalCard) {
    const rewardsFromCopy = rewardList[copy]

    if (rewardsFromCopy.length >= 1) {
      copies.push(...rewardsFromCopy)
      instances.push(...rewardsFromCopy)
    }
  }

  while (copies.length > 0) {
    const nestedCopies: number[] = []

    for (const copy of copies) {
      const rewardsFromCopy = rewardList[copy]

      if (rewardsFromCopy.length >= 1) {
        nestedCopies.push(...rewardsFromCopy)
        instances.push(...rewardsFromCopy)
      }
    }

    copies = nestedCopies
  }
}

const sum = amountOfOriginalCards + instances.length
console.log("Sum:", sum)
