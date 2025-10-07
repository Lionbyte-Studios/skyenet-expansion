import { EntityID } from "../types";
import { Entity, EntityType } from "./Entity";

export class TextDisplay extends Entity {
  entityType: EntityType = EntityType.TextDisplay;
  public text: string;
  constructor(text: string, x: number, y: number, entityID?: EntityID) {
    super(x, y, entityID);
    this.text = text;
  }
}
