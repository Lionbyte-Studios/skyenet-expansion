import { ShipEngineSprite, ShipSprite } from "../types";

export interface Config {
  defaultShipSprite: ShipSprite;
  defaultShipEngineSprite: ShipEngineSprite;
  defaultSpawnCoords: { x: number; y: number };
  tps: number;
  velocityCap: { velX: number; velY: number; velR: number };
}
