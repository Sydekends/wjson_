# wjson\_

1. Get the {version} : [https://wakfu.cdn.ankama.com/gamedata/config.json](https://wakfu.cdn.ankama.com/gamedata/config.json)
   - the endpoint return :
   ```json
   { "version": "1.85.1.29" }
   ```
   > Actual {version} :`1.85.1.29`
2. Create a folder named: "{version}-source"
3. Get all the files and put them in the folder from : https://wakfu.cdn.ankama.com/gamedata/{version}/{type}.json

for all the types :
`actions` > contains the descriptions of effect types (HP loss, AP boost, etc.)
`blueprints` > contains the blueprints
`collectibleResources` > contains the harvest actions
`equipmentItemTypes` > contains the definitions of types of equipment and their associated positions
`harvestLoots` > contains the items obtained through harvesting
`itemTypes` > contains the definitions of types of items
`itemProperties` > contains the properties that can be applied to items
`items` > contains the data on items, their effects, names, descriptions, etc. To be cross-referenced with the data from actions, equipmentItemTypes and itemProperties.
`jobsItems` > contains the data on items harvested, crafted or used as ingredient
`recipeCategories` > contains the jobs
`recipeIngredients` > contains the ingredients of recipes
`recipeResults` > contains the items produced by recipes
`recipes` > contains the recipes
`resourceTypes` > contains the types of resources
`resources` > contains the resources
`states` > contains the translation of the states used by the equipment

4. Create a folder named : {version}
5. Transform the data for better manipulation /WIP
6. Store the reformated json in the folder.

# Claude :

I'll help you create a TypeScript script to fetch, process, and store the Wakfu game data.

```typescript
import axios from "axios";
import fs from "fs/promises";
import path from "path";

// Types for the data structure
interface Config {
  version: string;
}

type DataType =
  | "actions"
  | "blueprints"
  | "collectibleResources"
  | "equipmentItemTypes"
  | "harvestLoots"
  | "itemTypes"
  | "itemProperties"
  | "items"
  | "jobsItems"
  | "recipeCategories"
  | "recipeIngredients"
  | "recipeResults"
  | "recipes"
  | "resourceTypes"
  | "resources"
  | "states";

// Configuration
const CONFIG_URL = "https://wakfu.cdn.ankama.com/gamedata/config.json";
const DATA_URL = "https://wakfu.cdn.ankama.com/gamedata";

const dataTypes: DataType[] = [
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
];

async function fetchJson<T>(url: string): Promise<T> {
  try {
    const response = await axios.get<T>(url);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function processData(data: any, type: DataType): Promise<any> {
  // TODO: Implement data transformation logic based on type
  // This is where you'll add the logic for step 5
  // For now, we'll return the data as-is
  return data;
}

async function main() {
  try {
    // Step 1: Get the version
    console.log("Fetching version...");
    const config = await fetchJson<Config>(CONFIG_URL);
    const version = config.version;
    console.log(`Current version: ${version}`);

    // Step 2: Create source directory
    const sourceDir = path.join(process.cwd(), `${version}-source`);
    const processedDir = path.join(process.cwd(), version);

    await ensureDirectoryExists(sourceDir);
    await ensureDirectoryExists(processedDir);

    // Step 3: Fetch and store all data files
    for (const type of dataTypes) {
      console.log(`Fetching ${type}...`);

      const url = `${DATA_URL}/${version}/${type}.json`;
      const data = await fetchJson(url);

      // Store raw data
      const sourceFilePath = path.join(sourceDir, `${type}.json`);
      await fs.writeFile(
        sourceFilePath,
        JSON.stringify(data, null, 2),
        "utf-8"
      );

      // Step 5 & 6: Process and store transformed data
      console.log(`Processing ${type}...`);
      const processedData = await processData(data, type);
      const processedFilePath = path.join(processedDir, `${type}.json`);
      await fs.writeFile(
        processedFilePath,
        JSON.stringify(processedData, null, 2),
        "utf-8"
      );
    }

    console.log("Data fetching and processing completed successfully!");
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

// Run the script
main();
```

To use this script, you'll need to:

1. Create a new TypeScript project:

```bash
mkdir wakfu-data
cd wakfu-data
npm init -y
npm install typescript @types/node axios
npx tsc --init
```

2. Create a `src` folder and save the script as `src/index.ts`

3. Update your `package.json` with these scripts:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

4. Create a `.gitignore` file:

```
node_modules/
*-source/
dist/
```

For GitHub storage, you should:

1. Initialize a git repository:

```bash
git init
git add .
git commit -m "Initial commit"
```

2. Create a new repository on GitHub and push your code:

```bash
git remote add origin <your-repo-url>
git push -u origin main
```

The script currently:

- Fetches the current version from the config endpoint
- Creates version-specific directories for both source and processed data
- Downloads all data files and stores them in the source directory
- Has a placeholder for data transformation (Step 5)
- Stores both raw and processed data in separate directories

The `processData` function is currently a placeholder - you'll need to implement the specific transformations you want for Step 5. Would you like me to help you implement specific data transformations for any of the data types?
