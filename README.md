# wjson\_

> Typescript
> setup the dev environnement for testing (ts-node-dev)

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

!! items.json is a very large file, i want items to be sliced by lvl in multiple files in the output.
grouped 0>19 20>34 35>49 50>64 65>79 80>94 95>109 110>124 125>139 140>154 155>169 170>184 etc

4. Create a folder named : {version}
5. Transform the data for better manipulation /WIP
   for items:
   ```json
   {
   "definition": {
     "item": {
       "id": 2021,
       "level": 6,
       "baseParameters": {
         "itemTypeId": 120,
         "itemSetId": 41,
         "rarity": 1,
         "bindType": 0,
         "minimumShardSlotNumber": 1,
         "maximumShardSlotNumber": 4
       },
       "useParameters": {
         "useCostAp": 0,
         "useCostMp": 0,
         "useCostWp": 0,
         "useRangeMin": 0,
         "useRangeMax": 0,
         "useTestFreeCell": false,
         "useTestLos": false,
         "useTestOnlyLine": false,
         "useTestNoBorderCell": false,
         "useWorldTarget": 0
       },
       "graphicParameters": {
         "gfxId": 1202021,
         "femaleGfxId": 1202021
       },
       "properties": []
     },
     "useEffects": [],
     "useCriticalEffects": [],
     "equipEffects": [
       {
         "effect": {
           "definition": {
             "id": 184047,
             "actionId": 20,
             "areaShape": 32767,
             "areaSize": [],
             "params": [
               6,
               0,
               1,
               0,
               0,
               0
             ]
           }
         }
       },
       {
         "effect": {
           "definition": {
             "id": 184048,
             "actionId": 150,
             "areaShape": 32767,
             "areaSize": [],
             "params": [
               2,
               0
             ]
           }
         }
       },
       {
         "effect": {
           "definition": {
             "id": 184049,
             "actionId": 120,
             "areaShape": 32767,
             "areaSize": [],
             "params": [
               9,
               0
             ]
           }
         }
       },
       {
         "effect": {
           "definition": {
             "id": 360361,
             "actionId": 31,
             "areaShape": 32767,
             "areaSize": [],
             "params": [
               1,
               0,
               1,
               0,
               0,
               0
             ]
           }
         }
       }
     ]
   },
   "title": {
     "fr": "Amulette du Bouftou",
     "en": "Gobball Amulet",
     "es": "Amuleto de jalató",
     "pt": "Amuleto de Papatudo"
   },
   "description": {
     "fr": "Attention mesdemoiselles, il paraît qu'elle bouffe tout, même les boutons de chemise et les lacets de tunique ! Ou peut-être n'est-ce qu'une légende ?",
     "en": "Watch out ladies, it seems this thing chews everything it comes across! Lacy shawls, woolly sweaters, and even leather clavicle-warmers have all been known to get a nibbling. Or is it all just tall talk?",
     "es": "Cuidado señoritas, al parecer se lo jala todo, ¡incluso los botones de las camisas y los lazos de las túnicas! ¿O quizás sea solo una leyenda?",
     "pt": "Cuidado, meninas, parece que essa coisa mastiga tudo que passa pela frente! Xales rendados, suéteres de lã e até aquecedores de clavícula de couro já foram mordiscados. Ou é tudo conversa fiada?"
   },
   },
   ```
6. Store the reformated json in the folder.
