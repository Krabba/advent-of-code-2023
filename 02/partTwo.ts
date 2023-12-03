import fs from "fs"
import path from "path"

const relativePath = path.join(import.meta.dir, "./input.txt")
const file = fs.readFileSync(relativePath, "utf-8")
const lines = file.split("\n")

let sum = 0

for (const _line of lines) {
  const line = _line.trim()

  const [_, _sets] = line.split(": ")
  const sets = _sets.split(";")

  let minRed = 1,
    minGreen = 1,
    minBlue = 1

  for (const _set of sets) {
    const set = _set.trim()
    const cubes = set.split(", ")

    for (const cube of cubes) {
      const [_amount, color] = cube.split(" ")
      const amount = Number(_amount)

      switch (color) {
        case "red": {
          if (amount > minRed) {
            minRed = amount
          }
          continue
        }
        case "green": {
          if (amount > minGreen) {
            minGreen = amount
          }
          continue
        }
        case "blue": {
          if (amount > minBlue) {
            minBlue = amount
          }
          continue
        }
        default:
          console.log("This should not happen.")
          continue
      }
    }
  }

  const power = minRed * minGreen * minBlue
  sum += power
}

console.log("Sum:", sum)
