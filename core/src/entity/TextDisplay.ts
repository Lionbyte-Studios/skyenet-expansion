import { EntityID } from "../types";
import { Entity } from "./Entity";

export class TextDisplay extends Entity {
  public text: string;
  constructor(
    text: string,
    x: number,
    y: number,
    entityID?: EntityID,
  ) {
    super(x, y, entityID);
    this.text = text;
  }
}
