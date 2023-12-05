import fs from "fs"
import path from "path"

const relativePath = path.join(import.meta.dir, "./input.txt")
const file = fs.readFileSync(relativePath, "utf-8")
const lines = file.split("\n")

const seedsToPlant: number[] = []

type MapList = Array<number[]>

interface ConvertMap {
  [convertMap: string]: MapList
}

const convertMaps: ConvertMap = {
  seedToSoil: [],
  soilToFertilizer: [],
  fertilizerToWater: [],
  waterToLight: [],
  lightToTemperature: [],
  temperatureToHumidity: [],
  humidityToLocation: [],
}

function convertSource(sourceToConvert: number, mapList: MapList): number {
  const target = sourceToConvert

  for (const map of mapList) {
    const destination = map[0]
    const source = map[1]
    const range = map[2]
    const rangeEnd = source + range
    const diff = source - destination

    if (target >= source && target <= rangeEnd) {
      return target - diff
    }
  }

  return target
}

for (const [_lineNumber, _line] of Object.entries(lines)) {
  const lineNumber = Number(_lineNumber)
  const line = _line.trim()

  if (line.startsWith("seeds:")) {
    const seeds = line.split(": ")[1].trim().split(" ").map(Number)
    seedsToPlant.push(...seeds)
  }

  if (line.includes("map:")) {
    let iterator = 1
    const mapList: MapList = []

    while (lines[lineNumber + iterator] !== "") {
      if (!lines[lineNumber + iterator]) break
      mapList.push(lines[lineNumber + iterator].split(" ").map(Number))
      iterator++
    }

    switch (line) {
      case "seed-to-soil map:": {
        convertMaps.seedToSoil = mapList
        break
      }
      case "soil-to-fertilizer map:": {
        convertMaps.soilToFertilizer = mapList
        break
      }
      case "fertilizer-to-water map:": {
        convertMaps.fertilizerToWater = mapList
        break
      }
      case "water-to-light map:": {
        convertMaps.waterToLight = mapList
        break
      }
      case "light-to-temperature map:": {
        convertMaps.lightToTemperature = mapList
        break
      }
      case "temperature-to-humidity map:": {
        convertMaps.temperatureToHumidity = mapList
        break
      }
      case "humidity-to-location map:": {
        convertMaps.humidityToLocation = mapList
        break
      }
      default:
        break
    }
  }
}

let lowestLocationNumber = Infinity

for (const seed of seedsToPlant) {
  const soil = convertSource(seed, convertMaps.seedToSoil)
  const fertilizer = convertSource(soil, convertMaps.soilToFertilizer)
  const water = convertSource(fertilizer, convertMaps.fertilizerToWater)
  const light = convertSource(water, convertMaps.waterToLight)
  const temperature = convertSource(light, convertMaps.lightToTemperature)
  const humidity = convertSource(temperature, convertMaps.temperatureToHumidity)
  const location = convertSource(humidity, convertMaps.humidityToLocation)

  if (location < lowestLocationNumber) {
    lowestLocationNumber = location
  }
}

console.log("Lowest location number:", lowestLocationNumber)
