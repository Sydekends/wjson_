import axios from "axios";
import fs from "fs/promises";
import path from "path";

interface Config {
  version: string;
}

interface GameItem {
  definition: {
    item: {
      id: number;
      level: number;
      // ... other properties
    };
  };
  title: Record<string, string>;
  description: Record<string, string>;
}

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

type DataType = (typeof TYPES)[number];

// Define level ranges with their starting values
const LEVEL_RANGES = [
  6, 20, 35, 50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230,
];

function getLevelRangeStart(level: number): number {
  // Find the appropriate range start for the given level
  return LEVEL_RANGES.reduce((prev, curr) => (level >= curr ? curr : prev));
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

function groupItemsByLevel(items: GameItem[]): Record<number, GameItem[]> {
  const grouped: Record<number, GameItem[]> = {};

  // Initialize empty arrays for all level ranges
  LEVEL_RANGES.forEach((startLevel) => {
    grouped[startLevel] = [];
  });

  // Group items by their level range
  items.forEach((item) => {
    const level = item.definition.item.level;
    const rangeStart = getLevelRangeStart(level);
    grouped[rangeStart].push(item);
  });

  return grouped;
}

async function processAndSaveData(version: string): Promise<void> {
  const sourceDirPath = path.join(process.cwd(), `${version}-source`);
  const outputDirPath = path.join(process.cwd(), version);

  await ensureDirectoryExists(sourceDirPath);
  await ensureDirectoryExists(outputDirPath);

  for (const type of TYPES) {
    console.log(`Processing ${type}...`);
    const data = await fetchData(version, type);

    // Save raw data
    await fs.writeFile(
      path.join(sourceDirPath, `${type}.json`),
      JSON.stringify(data, null, 2)
    );

    if (type === "items") {
      // Process items specially - group by level
      const groupedItems = groupItemsByLevel(data);

      // Create items subdirectory
      const itemsDir = path.join(outputDirPath, "items");
      await ensureDirectoryExists(itemsDir);

      // Save each level range to a separate file
      for (const [startLevel, items] of Object.entries(groupedItems)) {
        await fs.writeFile(
          path.join(itemsDir, `${startLevel}.json`),
          JSON.stringify(items, null, 2)
        );
      }
    } else {
      // Save processed data (for now, same as raw data)
      await fs.writeFile(
        path.join(outputDirPath, `${type}.json`),
        JSON.stringify(data, null, 2)
      );
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
