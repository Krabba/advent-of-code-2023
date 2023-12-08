import fs from "fs"
import path from "path"

const relativePath = path.join(import.meta.dir, "./input.txt")
const file = fs.readFileSync(relativePath, "utf-8")
const lines = file.split("\n")

const steps = lines[0].trim().split("")
const allPathsEndingWithA: {
  [node: string]: { currentNode: string; stepCount: number }
} = {}
const desertMap: { [node: string]: { L: string; R: string } } = {}

for (const _line of lines.splice(1)) {
  const line = _line.trim()

  if (line.includes("=")) {
    const [node, values] = line.split(" = ")
    const lastNodeCharacter = node.split("")[node.length - 1]

    if (lastNodeCharacter === "A") {
      allPathsEndingWithA[node] = {
        currentNode: node,
        stepCount: 0,
      }
    }

    const valuesWithoutSymbols = values.replace(/\(|\)|\,/g, "")
    const [L, R] = valuesWithoutSymbols.split(" ")
    desertMap[node] = { L, R }
  }
}

let stepCount = 0
let everyZ = false

while (!everyZ) {
  const allPaths = Object.entries(allPathsEndingWithA)

  for (const [originalNode, node] of allPaths) {
    while (node.currentNode[node.currentNode.length - 1] !== "Z") {
      const step = steps[node.stepCount % steps.length]
      allPathsEndingWithA[originalNode].stepCount += 1

      const { L, R } = desertMap[node.currentNode]

      if (step === "L") {
        allPathsEndingWithA[originalNode].currentNode = L

        if (L[L.length - 1] === "Z") {
          break
        }

        continue
      }

      allPathsEndingWithA[originalNode].currentNode = R
    }
  }

  const every = allPaths.every((thing) => {
    const node = thing[1].currentNode
    return node[node.length - 1] === "Z"
  })

  if (every) {
    everyZ = true
    break
  }
}

const allNodes = Object.values(allPathsEndingWithA)

function getFactors(n: number): number[] {
  if (n === 2) return [n]

  for (let i = 2; i <= n; i++) {
    if (n % i === 0) {
      return [i, ...getFactors(n / i)]
    }
  }

  return []
}

const commonFactors = allNodes.reduce<number[]>((acc, node) => {
  const factors = getFactors(node.stepCount)

  if (acc.length === 0) {
    return factors
  }

  return Array.from(new Set([...acc, ...factors]))
}, [])

const product = commonFactors.reduce((acc, multiplier) => {
  return acc * multiplier
}, 1)

console.log(commonFactors, "Sum:", product)
