import { Game } from "../Game";
import { alphabetForID, EntityID } from "../types";

export enum EntityType {
  Bullet,
  Asteroid,
  TextDisplay,
  Player,
}

// Making the function here without importing from Util.ts to prevent circular dependencies breaking everything
function genStringID(length: number) {
  let id = "";
  for (let i = 0; i < length; i++) {
    id += alphabetForID[Math.floor(Math.random() * alphabetForID.length)];
  }
  return id;
}

export abstract class Entity {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any;
  entityID: EntityID;
  x: number;
  y: number;
  abstract entityType: EntityType;
  constructor(x: number, y: number, entityID?: EntityID) {
    if (entityID === undefined) {
      this.entityID = this.generateID();
    } else {
      this.entityID = entityID;
    }
    this.x = x;
    this.y = y;
  }
  public generateID(): EntityID {
    return genStringID(8);
  }
  public tick<T extends Game>(game?: T) {}
}
