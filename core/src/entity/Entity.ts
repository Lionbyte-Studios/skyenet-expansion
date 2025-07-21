import { Game } from "../Game";
import { alphabetForID, EntityID } from "../types.d";

// Making the function here without importing from Util.ts to prevent circular dependencies breaking everything
function genStringID(length: number) {
  let id = "";
  for (let i = 0; i < length; i++) {
    id += alphabetForID[Math.floor(Math.random() * alphabetForID.length)];
  }
  return id;
}

export class Entity {
  entityID: EntityID;
  x: number;
  y: number;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public tick<T extends Game>(game?: T) {}
}
