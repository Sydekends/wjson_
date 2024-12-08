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
  LEVEL_RANGES_MAX.forEach((levelRangeEnd) => {
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
    if (rarity > rangeEnd) console.error({ level, rangeEnd });
    groupedItems[rangeEnd][rarity].push(item);
    // groupedItems[rangeEnd][rarity].sort(
    //   (a, b) => a.definition.item.level - b.definition.item.level
    // );
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
      for (const [lvlrangeMax, itemsByRarity] of Object.entries(groupedItems)) {
        const itemsLvlMaxDir = path.join(itemsDir, lvlrangeMax);
        await ensureDirectoryExists(itemsLvlMaxDir);
        const fusedItems = Object.entries(itemsByRarity).reduce(
          (acc, [rarity, items]) =>
            acc
              .concat(items)
              .sort(
                // Sort by level descending
                (a, b) => b.definition.item.level - a.definition.item.level
              )
              .sort(
                (a, b) =>
                  b.definition.item.baseParameters.rarity -
                  a.definition.item.baseParameters.rarity
              ),
          [] as GameItem[]
        );
        await fs.writeFile(
          path.join(itemsLvlMaxDir, `index.json`),
          JSON.stringify(fusedItems, null, 2)
        );
        for (const [rarity, items] of Object.entries(itemsByRarity)) {
          await fs.writeFile(
            path.join(itemsLvlMaxDir, `${rarity}.json`),
            JSON.stringify(items, null, 2)
          );
        }
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

export type jsoned = { [key: string]: GameItem[] };
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
