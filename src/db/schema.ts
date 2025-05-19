import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("items", {
    id: int().primaryKey({ autoIncrement: true }),
    // name: text().notNull(),
    // age: int().notNull(),
    // email: text().notNull().unique(),
    // definition:
});



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