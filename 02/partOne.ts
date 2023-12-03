import fs from "fs"
import path from "path"

const relativePath = path.join(import.meta.dir, "./input.txt")
const file = fs.readFileSync(relativePath, "utf-8")
const lines = file.split("\n")

const redCap = 12
const greenCap = 13
const blueCap = 14

const impossibleGames = []
const possibleGames = []

for (const _line of lines) {
  const line = _line.trim()

  const [game, _sets] = line.split(": ")
  const gameId = Number(game.match(/\d+/g)![0])
  const sets = _sets.split(";")

  let impossible = false

  for (const _set of sets) {
    const set = _set.trim()
    const cubes = set.split(", ")

    for (const cube of cubes) {
      const [_amount, color] = cube.split(" ")
      const amount = Number(_amount)

      switch (color) {
        case "red": {
          if (amount > redCap) {
            impossible = true
          }
          continue
        }
        case "green": {
          if (amount > greenCap) {
            impossible = true
          }
          continue
        }
        case "blue": {
          if (amount > blueCap) {
            impossible = true
          }
          continue
        }
        default:
          console.log("This should not happen.")
          continue
      }
    }
  }

  if (impossible) {
    impossibleGames.push(gameId)
  } else {
    possibleGames.push(gameId)
  }
}

let sum = 0

for (const gameId of possibleGames) {
  sum += gameId
}

console.log("Sum:", sum)
