import { Asteroid } from "../entity/Asteroid";
import { Bullet } from "../entity/Bullet";
import { Entity } from "../entity/Entity";
import { EntitySchema } from "../Schemas";
import { alphabetForID, EntityType } from "../types";

export function genStringID(length: number) {
  let id = "";
  for (let i = 0; i < length; i++) {
    id += alphabetForID[Math.floor(Math.random() * alphabetForID.length)];
  }
  return id;
}

export function assert(condition: boolean) {
  if (!condition) {
    throw new Error(`Assertion failed! Time: ${Date.now()}`);
  }
}

export function entitiyToZodEntitySchema(entity: Entity) {
  let type: EntityType;

  if (entity instanceof Bullet) type = EntityType.Bullet;
  else if (entity instanceof Asteroid) type = EntityType.Asteroid;
  else throw new Error(`Entity instanceof checks failed :(`);

  return EntitySchema.parse({
    entityID: entity.entityID,
    entityType: type,
    entityData: entity,
  });
}

// \033[F
export const goBackChar = "\x1b[F";
