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
type Xy = Record<Direction, boolean>
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

function getWalkableSteps(
  tileIndex: number,
  surroundingLines: Array<string[] | undefined>
): Xy {
  const above = surroundingLines[0]
  const current = surroundingLines[1]
  const below = surroundingLines[2]

  const currentTile = current?.[tileIndex] as Pipe

  const xy: Xy = {
    north: false,
    west: false,
    east: false,
    south: false,
  } as const

  for (let i = -1; i < 2; i++) {
    const index = tileIndex + i

    switch (i) {
      case -1: {
        const westTile = current?.[index] as Pipe
        xy.west = !!compatability[currentTile]?.west?.includes(westTile)
      }
      case 0: {
        const northTile = above?.[index] as Pipe
        const southTile = below?.[index] as Pipe
        xy.north = !!compatability[currentTile]?.north?.includes(northTile)
        xy.south = !!compatability[currentTile]?.south?.includes(southTile)
      }
      case 1: {
        const eastTile = current?.[index] as Pipe
        xy.east = !!compatability[currentTile]?.east?.includes(eastTile)
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

function getNextIndex(
  from: Direction | "center",
  tileIndex: number,
  lineIndex: number
): Navigation {
  const lineAbove = lines[lineIndex - 1]?.split("")
  const line = lines[lineIndex]?.split("")
  const lineBelow = lines[lineIndex + 1]?.split("")

  const walkableSteps = getWalkableSteps(tileIndex, [
    lineAbove,
    line,
    lineBelow,
  ])

  for (const [direction, walkable] of Object.entries(walkableSteps)) {
    if (walkable && direction !== from) {
      const [tileDiff, lineDiff] = nextIndex[direction as Direction]

      return {
        from: direction as Direction,
        index: [tileIndex + tileDiff, lineIndex + lineDiff],
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

function getSteps(startIndex: number, startLineIndex: number): number {
  let current: Navigation = getNextIndex("center", startIndex, startLineIndex)

  let steps = 1

  while (true) {
    if (
      current.index[0] === startIndex &&
      current.index[1] === startLineIndex
    ) {
      break
    }

    const next = getNextIndex(
      reverseDirection[current.from],
      current.index[0],
      current.index[1]
    )

    current = next
    steps += 1
  }

  return steps
}

const steps = getSteps(indexOfS, lineIndexWithS)
console.log("Sum:", steps / 2)
