export interface Config {
  version: string;
}
export type WakfuLanguage = "fr" | "en" | "es" | "pt";
export type GameItem = {
  definition: gameDataTypeItemDefinition;
  title: Record<WakfuLanguage, string>;
  description?: Record<WakfuLanguage, string>;
};
type gameDataTypeItemDefinition = {
  item: {
    id: number;
    level: number;
    baseParameters: {
      itemTypeId: number;
      //   itemSetId: number;
      rarity: number;
      //   bindType: number;
      //   minimumShardSlotNumber: number;
      //   maximumShardSlotNumber: number;
    };
    useParameters: {
      //   useCostAp: number;
      //   useCostMp: number;
      //   useCostWp: number;
      //   useRangeMin: number;
      //   useRangeMax: number;
      //   useTestFreeCell: boolean;
      //   useTestLos: boolean;
      //   useTestOnlyLine: boolean;
      //   useTestNoBorderCell: boolean;
      //   useWorldTarget: number;
    };
    graphicParameters: { gfxId: number; femaleGfxId: number };
    // properties: any[];
  };
  //   useEffects: any[];
  //   useCriticalEffects: any[];
  equipEffects: gameDataTypeItemEquipEffects[];
};
type gameDataTypeItemEquipEffects = {
  effect: {
    definition: {
      id: number;
      actionId: number;
      areaShape: number;
      areaSize: any[];
      params: number[];
    };
  };
};
export type DataType = (typeof TYPES)[number];
