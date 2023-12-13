import fs from "fs"
import path from "path"

const relativePath = path.join(import.meta.dir, "./input.txt")
const file = fs.readFileSync(relativePath, "utf-8")
const lines = file.split("\n")

const lineIndexWithS = lines.findIndex((line) => line.match(/S/))
const indexOfS = lines[lineIndexWithS]
  ?.split("")
  .findIndex((tile) => tile === "S")

type Direction = "north" | "west" | "east" | "south"
type Xy = Record<Direction, string | undefined>
type Pipe = "F" | "7" | "L" | "J" | "-" | "|" | "S"

const pipeConnectors: Record<Direction, Pipe[]> = {
  north: ["|", "L", "J", "S"],
  west: ["-", "J", "7", "S"],
  east: ["-", "L", "F", "S"],
  south: ["|", "7", "F", "S"],
}

const compatability: Record<Pipe, Partial<Record<Direction, Pipe[]>>> = {
  "-": {
    west: pipeConnectors.east,
    east: pipeConnectors.west,
  },
  "|": {
    north: pipeConnectors.south,
    south: pipeConnectors.north,
  },
  L: {
    north: pipeConnectors.south,
    east: pipeConnectors.west,
  },
  J: {
    north: pipeConnectors.south,
    west: pipeConnectors.east,
  },
  F: {
    south: pipeConnectors.north,
    east: pipeConnectors.west,
  },
  7: {
    south: pipeConnectors.north,
    west: pipeConnectors.east,
  },
  S: {
    north: pipeConnectors.south,
    south: pipeConnectors.north,
    east: pipeConnectors.west,
    west: pipeConnectors.east,
  },
}

function getSymbolsAround(
  tileIndex: number,
  surroundingLines: Array<string[] | undefined>
): Xy {
  const above = surroundingLines[0]
  const current = surroundingLines[1]
  const below = surroundingLines[2]

  const xy: Xy = {
    north: undefined,
    west: undefined,
    east: undefined,
    south: undefined,
  } as const

  for (let i = -1; i < 2; i++) {
    const index = tileIndex + i

    switch (i) {
      case -1: {
        const westTile = current?.[index]
        xy.west = westTile
      }
      case 0: {
        const northTile = above?.[index]
        const southTile = below?.[index]
        xy.north = northTile
        xy.south = southTile
      }
      case 1: {
        const eastTile = current?.[index]
        xy.east = eastTile
      }
      default:
        break
    }
  }

  return xy
}

const nextIndex: Record<Direction, number[]> = {
  north: [0, -1],
  west: [-1, 0],
  east: [1, 0],
  south: [0, 1],
}

type Navigation = {
  from: Direction
  index: number[]
}

type MapDrawing = Record<string, string[]>

const typeOfS: Record<Direction, Partial<Record<Direction, Pipe>>> = {
  north: {
    north: "|",
    west: "7",
    east: "F",
  },
  south: {
    south: "|",
    west: "J",
    east: "L",
  },
  west: {
    north: "L",
    south: "F",
    west: "-",
  },
  east: {
    north: "J",
    south: "7",
    east: "-",
  },
}

let firstDirection: Direction | undefined = undefined
let lastDirection: Direction | undefined = undefined

function getNextIndex(
  drawing: MapDrawing,
  from: Direction | "start",
  tileIndex: number,
  lineIndex: number
): Navigation {
  const lineAbove = lines[lineIndex - 1]?.split("")
  const line = lines[lineIndex]?.split("")
  const lineBelow = lines[lineIndex + 1]?.split("")

  const symbols = getSymbolsAround(tileIndex, [lineAbove, line, lineBelow])

  const currentSymbol = line[tileIndex]

  for (const [direction, symbol] of Object.entries(symbols)) {
    if (
      symbol &&
      !!compatability[currentSymbol as Pipe]?.[
        direction as Direction
      ]?.includes(symbol as Pipe) &&
      direction !== from
    ) {
      const [td, ld] = nextIndex[direction as Direction]
      const tileDiff = tileIndex + td
      const lineDiff = lineIndex + ld

      if (!drawing[lineDiff]) {
        drawing[lineDiff] = Array.from({ length: lines[0].length }).map(
          () => "."
        )
      }

      drawing[lineDiff][tileDiff] = symbol

      if (from === "start") {
        firstDirection = direction as Direction
      }

      if (symbol === "S") {
        lastDirection = direction as Direction
      }

      return {
        from: direction as Direction,
        index: [tileDiff, lineDiff],
      }
    }
  }

  // This should not happen.
  throw new Error("You have reached a dead end.")
}

const reverseDirection: Record<Direction, Direction> = {
  north: "south",
  west: "east",
  east: "west",
  south: "north",
}

function drawMap(startIndex: number, startLineIndex: number): MapDrawing {
  const drawing: MapDrawing = {}

  let current: Navigation = getNextIndex(
    drawing,
    "start",
    startIndex,
    startLineIndex
  )

  while (true) {
    if (
      current.index[0] === startIndex &&
      current.index[1] === startLineIndex
    ) {
      break
    }

    const next = getNextIndex(
      drawing,
      reverseDirection[current.from],
      current.index[0],
      current.index[1]
    )

    current = next
  }

  return drawing
}

const sketch = drawMap(indexOfS, lineIndexWithS)

let sum = 0

for (const [_lineIndex, lines] of Object.entries(sketch)) {
  const lineIndex = Number(_lineIndex)

  let inside = false
  let reason: Pipe | undefined = undefined

  const indexOfS = lines.findIndex((tile) => tile === "S")

  if (indexOfS > -1) {
    lines[indexOfS] = typeOfS[lastDirection! as Direction][
      firstDirection! as Direction
    ] as Pipe
  }

  for (const [tileIndex, tile] of lines.entries()) {
    switch (tile) {
      case ".":
        if (inside) {
          console.log(
            `${lineIndex}:${tileIndex} [${tile}] - Dot inside the loop found.`
          )
          lines[tileIndex] = "I"
          sum += 1
        }
        break
      case "|":
        inside = !inside
        reason = tile
        break
      case "-":
        if (reason && !["|", "F", "L"].includes(reason)) {
          const error = `${lineIndex}:${tileIndex} [${tile}] - Expected the reason to be |, F, L but got ${reason}.`
          console.error(error)
          throw new Error()
        }
        break
      case "F":
      case "L":
        if (reason && !["|", "7", "J", "F", "L"].includes(reason)) {
          const error = `${lineIndex}:${tileIndex} [${tile}] - Expected the reason to be |, 7, J, F, L but got ${reason}.`
          console.error(error)
          throw new Error()
        }

        if (reason && ["F", "L"].includes(reason)) {
          reason = undefined
          break
        }

        reason = tile
        break
      case "7":
      case "J":
        if (reason && !["F", "L"].includes(reason)) {
          const error = `${lineIndex}:${tileIndex} [${tile}] - Expected the reason to be F, L but got ${reason}.`
          console.error(error)
          throw new Error()
        }

        // Encountering the opposite 90 degree bend counts as crossing the boundary, so it should be counted.
        if (reason === "F" && tile === "J") {
          inside = !inside
          reason = tile
          break
        } else if (reason === "L" && tile === "7") {
          inside = !inside
          reason = tile
          break
        }

        reason = undefined

        break
      default:
        const error = `${lineIndex}:${tileIndex} [${tile}] - Unhandled error.`
        console.error(error)
        throw new Error()
    }
  }
}

console.log(
  "S was inferred as:",
  typeOfS[lastDirection! as Direction][firstDirection! as Direction]
)
console.log("Sum:", sum)
