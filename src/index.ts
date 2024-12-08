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
const LEVEL_RANGES = [
  6, 20, 35, 50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230,
];
const RARYTY_RANGE = [0, 1, 2, 3, 4, 5, 6, 7, 8];
function getLevelRangeEnd(level: number): number {
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

function groupAndFilterItems(
  itemsWithTrash: GameItem[]
): Record<number, Record<number, GameItem[]>> {
  const items = itemsWithTrash.map(
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
  const groupedItems: Record<number, Record<number, GameItem[]>> = {
    110: {
      4: [],
    },
  };

  // Initialize empty arrays
  LEVEL_RANGES.forEach((levelRangeEnd) => {
    // for all level ranges
    groupedItems[levelRangeEnd] = [];
    RARYTY_RANGE.forEach((rarity) => {
      groupedItems[levelRangeEnd][rarity] = [];
    });
  });

  items.forEach((item) => {
    // Group items by their level range
    const level = item.definition.item.level;
    const rangeEnd = getLevelRangeEnd(level);
    const rarity = item.definition.item.baseParameters.rarity;
    groupedItems[rangeEnd][rarity].push(item);
  });

  return groupedItems;
}

async function processAndSaveData(version: string): Promise<void> {
  const sourceDirPath = path.join(process.cwd(), `${version}-source`);
  const outputDirPath = path.join(process.cwd(), version);

  await ensureDirectoryExists(sourceDirPath);
  await ensureDirectoryExists(outputDirPath);

  for (const type of TYPES) {
    console.log(`Processing ${type}...`);
    const data = (await fetchData(version, type)) as GameItem[];

    // Save raw data
    await fs.writeFile(
      path.join(sourceDirPath, `${type}.json`),
      JSON.stringify(data, null, 2)
    );

    if (type === "items") {
      // Process items specially - group by level
      const groupedItems = groupAndFilterItems(data);

      // Create items subdirectory
      const itemsDir = path.join(outputDirPath, "items");
      await ensureDirectoryExists(itemsDir);

      // Save each level range to a separate file
      for (const [startLevel, itemsByRarity] of Object.entries(groupedItems)) {
        const itemsLvlDir = path.join(itemsDir, startLevel);
        await ensureDirectoryExists(itemsLvlDir);
        for (const [rarity, items] of Object.entries(itemsByRarity)) {
          const itemsRarityDir = path.join(itemsLvlDir, rarity);
          // await ensureDirectoryExists(itemsRarityDir);
          console.log(itemsRarityDir);
          await fs.writeFile(
            path.join(itemsLvlDir, `${rarity}.json`),
            JSON.stringify(items, null, 2)
          );
        }
        // await fs.writeFile(
        //   path.join(itemsLvlDir, `${startLevel}.json`),
        //   JSON.stringify(itemsByRarity, null, 2)
        // );
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
