import { ShipEngineSprite, ShipSprite } from "../types.d";

export interface Config {
  defaultShipSprite: ShipSprite;
  defaultShipEngineSprite: ShipEngineSprite;
  defaultSpawnCoords: { x: number; y: number };
  tps: number;
}
