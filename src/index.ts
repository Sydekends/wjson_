import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { DataType, GameItem } from "./types";

const TYPES = [
  "actions",
  "blueprints",
  "collectibleResources",
  "equipmentItemTypes",
  "harvestLoots",
  "itemTypes",
  "itemProperties",
  "items",
  "jobsItems",
  "recipeCategories",
  "recipeIngredients",
  "recipeResults",
  "recipes",
  "resourceTypes",
  "resources",
  "states",
] as const;

// Define level ranges with their starting values
const LEVEL_RANGES_MAX = [
  6, 20, 35, 50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230,
];
const RARYTY_RANGE = [0, 1, 2, 3, 4, 5, 6, 7, 8];
function getLevelRangeEnd(level: number): number {
  return LEVEL_RANGES_MAX.reduce((prev, curr) => {
    return level <= curr && level > prev ? curr : prev;
  });
}

async function getVersion(): Promise<string> {
  const response = await axios.get(
    "https://wakfu.cdn.ankama.com/gamedata/config.json"
  );
  return response.data.version;
}

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function fetchData(version: string, type: DataType): Promise<any> {
  const url = `https://wakfu.cdn.ankama.com/gamedata/${version}/${type}.json`;
  const response = await axios.get(url);
  return response.data;
}

function groupAndFilterItems(itemsWithTrash: GameItem[]): GameItem[] {
  const items = itemsWithTrash.map(
    //take only usefull data
    ({
      title,
      description,
      definition: {
        item: {
          level,
          id,
          graphicParameters,
          baseParameters: { itemTypeId, rarity },
          useParameters,
        },
        equipEffects,
      },
    }) => ({
      title,
      description,
      definition: {
        item: {
          level,
          id,
          graphicParameters,
          baseParameters: { itemTypeId, rarity },
          useParameters,
        },
        equipEffects,
      },
    })
  );

  return items;
}

async function processAndSaveData(version: string): Promise<void> {
  const sourceDirPath = path.join(process.cwd(), `${version}-source`);
  const outputDirPath = path.join(process.cwd(), version);

  await ensureDirectoryExists(sourceDirPath);
  await ensureDirectoryExists(outputDirPath);
  // Convert it all as csv

  for (const type of TYPES) {
    console.log(`Processing ${type}...`);
    const data = (await fetchData(version, type)) as GameItem[];

    // Save raw data as CSV
    if (type === "items") {
    } else {
    }
  }
}

async function main() {
  try {
    const version = await getVersion();
    console.log(`Processing version: ${version}`);
    await processAndSaveData(version);
    console.log("Processing complete!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
