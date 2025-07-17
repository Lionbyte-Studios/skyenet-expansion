import { ShipEngineSprite, ShipSprite } from "../types.d";
import { Config } from "./Config";

export class DefaultConfig implements Config {
  defaultShipSprite: ShipSprite = ShipSprite.Gray;
  defaultShipEngineSprite: ShipEngineSprite = ShipEngineSprite.Gray;
  defaultSpawnCoords: { x: number; y: number } = { x: 500, y: 500 };
}
