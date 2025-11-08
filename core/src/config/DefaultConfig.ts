import { ShipEngineSprite, ShipSprite } from "../types";
import { Config } from "./Config";

export class DefaultConfig implements Config {
  defaultShipSprite: ShipSprite = ShipSprite.Gray;
  defaultShipEngineSprite: ShipEngineSprite = ShipEngineSprite.Gray;
  defaultSpawnCoords: { x: number; y: number } = { x: 0, y: 0 };
  tps: number = 60;
  velocityCap: { velX: number; velY: number; velR: number } = {
    velX: 0.01,
    velY: 0.01,
    velR: 0.01,
  };
  itemPickupRange: number = 30;
  itemPickupRangeSquared: number = 30*30;
}
