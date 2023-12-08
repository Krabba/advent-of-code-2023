import fs from "fs"
import path from "path"

const relativePath = path.join(import.meta.dir, "./input.txt")
const file = fs.readFileSync(relativePath, "utf-8")
const lines = file.split("\n")

const steps = lines[0].trim().split("")
const desertMap: { [node: string]: { L: string; R: string } } = {}

for (const _line of lines.splice(1)) {
  const line = _line.trim()

  if (line.includes("=")) {
    const [node, values] = line.split(" = ")
    const valuesWithoutSymbols = values.replace(/\(|\)|\,/g, "")
    const [L, R] = valuesWithoutSymbols.split(" ")
    desertMap[node] = { L, R }
  }
}

let node = "AAA"
let stepCount = 0

while (node !== "ZZZ") {
  for (const step of steps) {
    const { L, R } = desertMap[node]

    stepCount += 1

    if (step === "L") {
      node = L
      continue
    }

    node = R
  }
}

console.log("Sum:", stepCount)
