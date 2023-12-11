import fs from "fs"
import path from "path"

const relativePath = path.join(import.meta.dir, "./input.txt")
const file = fs.readFileSync(relativePath, "utf-8")
const lines = file.split("\n")

let sum = 0

function allZeroes(history: number[] | undefined) {
  if (!history) return false
  return history.every((h) => typeof h === "number" && h === 0)
}

function getHistories(accumulator: Array<number[]>, _history: number[]) {
  const history = Object.entries(_history)
  const nextHistory: number[] = []

  for (const [_pointIndex, point] of history) {
    const pointIndex = Number(_pointIndex)
    const nextPoint = history[pointIndex + 1]

    if (nextPoint) {
      const diff = nextPoint[1] - point
      nextHistory.push(diff)
    }
  }

  accumulator.push(nextHistory)

  if (allZeroes(accumulator[accumulator.length - 1])) {
    return accumulator
  } else {
    return getHistories(accumulator, nextHistory)
  }
}

for (const _line of lines) {
  const line = _line.trim()

  const histories = line.split(" ").map(Number)
  const allHistories = [histories, ...getHistories([], histories)].reverse()

  const extrapolatedValue = allHistories.reduce((acc, _, index) => {
    const nextHistory = allHistories[index + 1]

    if (nextHistory) {
      return nextHistory[nextHistory.length - 1] + acc
    } else {
      return acc
    }
  }, 0)

  sum += extrapolatedValue
}

console.log("Sum:", sum)
