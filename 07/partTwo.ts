import fs from "fs"
import path from "path"

const relativePath = path.join(import.meta.dir, "./input.txt")
const file = fs.readFileSync(relativePath, "utf-8")
const lines = file.split("\n")

const hands: [string, number][] = []

for (const _line of lines) {
  const line = _line.trim()
  const [hand, bid] = line.split(" ")
  hands.push([hand, Number(bid)])
}

const cardWorthList: Record<string, number> = {
  A: 14,
  K: 13,
  Q: 12,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  J: 1,
} as const

const comboWorthList: Record<string, number> = {
  fiveOfAKind: 700,
  fourOfAKind: 600,
  fullHouse: 500,
  threeOfAKind: 400,
  twoPair: 300,
  onePair: 200,
  highCard: 100,
  nothing: 0,
} as const

function valueOfHand(hand: string) {
  const cards = hand
    .split("")
    .reduce<{ [key: string]: number }>((acc, current) => {
      if (!acc[current]) {
        acc[current] = 1
      } else {
        acc[current] += 1
      }

      return acc
    }, {})

  const jokers = cards["J"] || 0

  const cardsInHand =
    jokers === 5
      ? [5]
      : Object.entries(cards)
          .filter(([card, amount]) => card !== "J")
          .sort((a, b) => b[1] - a[1])
          .map((hand, index) => {
            const [card, amount] = hand

            if (index === 0) {
              return amount + jokers
            }

            return amount
          })

  const combo = cardsInHand.reduce((acc, amount, index) => {
    switch (amount) {
      case 5: {
        acc = "fiveOfAKind"
        break
      }
      case 4: {
        acc = "fourOfAKind"
        break
      }
      case 3: {
        const nextAmount = cardsInHand[index + 1]
        acc = nextAmount === 2 ? "fullHouse" : "threeOfAKind"
        break
      }
      case 2: {
        if (["fullHouse"].includes(acc)) break
        const amountOfUniqueCards = cardsInHand.length
        acc = amountOfUniqueCards >= 4 ? "onePair" : "twoPair"
        break
      }
      case 1: {
        if (acc === "nothing") {
          acc = "highCard"
        }
        break
      }
      default: {
        acc = "nothing"
      }
    }

    return acc
  }, "nothing")

  return {
    combo: combo,
    value: comboWorthList[combo],
  }
}

function isBetterHand(_hand: string, _compareHand: string) {
  const hand = _hand.split("")
  const compareHand = _compareHand.split("")

  for (const [_cardIndex, card] of Object.entries(hand)) {
    const cardIndex = Number(_cardIndex)
    const handWorth = cardWorthList[card]
    const compareHandWorth = cardWorthList[compareHand[cardIndex]]

    if (handWorth < compareHandWorth) {
      return false
    } else if (handWorth > compareHandWorth) {
      return true
    }
  }

  return true
}

const ranking = hands
  .reduce<Array<{ hand: string; bid: number; value: number; combo: string }>>(
    (acc, [hand, bid]) => {
      const { combo, value } = valueOfHand(hand)
      acc.push({ hand, bid, value, combo })
      return acc
    },
    []
  )
  .sort((a, b) => {
    if (a.value === b.value) {
      const isBetter = isBetterHand(a.hand, b.hand)
      return isBetter ? 1 : -1
    }

    return a.value - b.value
  })

const sum = ranking.reduce((acc, hand, index) => {
  const multiplier = index + 1
  const product = hand.bid * multiplier
  acc += product
  return acc
}, 0)

console.log("Sum:", sum)
