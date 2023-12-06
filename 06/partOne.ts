import fs from "fs"
import path from "path"

const relativePath = path.join(import.meta.dir, "./input.txt")
const file = fs.readFileSync(relativePath, "utf-8")
const lines = file.split("\n")

let sum = 1

const times: number[] = []
const distances: number[] = []

for (const _line of lines) {
  const line = _line.trim()

  const [title, values] = line.split(":")

  switch (title) {
    case "Time": {
      times.push(
        ...values
          .split(" ")
          .filter((t) => t)
          .map(Number)
      )
      break
    }
    case "Distance": {
      distances.push(
        ...values
          .split(" ")
          .filter((t) => t)
          .map(Number)
      )
      break
    }
    default:
      break
  }
}

const waysToBeatRace: number[] = []

for (const [_timeIndex, time] of Object.entries(times)) {
  const timeIndex = Number(_timeIndex)
  const timeToBeat = distances[timeIndex]

  let waysToBeatThisTime = 0

  for (let i = 0; i < time; i++) {
    const secondsLeft = time - i
    const velocity = i
    const distanceCovered = secondsLeft * velocity

    if (distanceCovered > timeToBeat) {
      waysToBeatThisTime += 1
    }
  }

  if (waysToBeatThisTime > 0) {
    waysToBeatRace.push(waysToBeatThisTime)
  }
}

for (const way of waysToBeatRace) {
  sum *= way
}

console.log("Sum:", sum)
