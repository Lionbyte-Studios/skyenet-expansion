import { Asteroid } from "../entity/Asteroid";
import { Bullet } from "../entity/Bullet";
import { Entity, EntityType } from "../entity/Entity";
import { TextDisplay } from "../entity/TextDisplay";
import { EntitySchema } from "../Schemas";
import { alphabetForID } from "../types";

export function genStringID(length: number) {
  let id = "";
  for (let i = 0; i < length; i++) {
    id += alphabetForID[Math.floor(Math.random() * alphabetForID.length)];
  }
  return id;
}

export function entitiyToZodEntitySchema(entity: Entity) {
  let type: EntityType;

  if (entity instanceof Bullet) type = EntityType.Bullet;
  else if (entity instanceof Asteroid) type = EntityType.Asteroid;
  else if (entity instanceof TextDisplay) type = EntityType.TextDisplay;
  else throw new Error(`Entity instanceof checks failed :(`);

  return EntitySchema.parse({
    entityID: entity.entityID,
    entityType: type,
    entityData: entity,
  });
}

// \033[F
export const goBackChar = "\x1b[F";

export type OmitFunctions<T> = Omit<T, {[K in keyof T]: T[K] extends Function ? K : never}[keyof T]>;