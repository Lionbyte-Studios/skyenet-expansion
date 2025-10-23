import { PacketBuffer } from "../net/PacketBuffer";
import { Entity, EntityType } from "./Entity";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EntityConstructor = new (...args: any[]) => Entity;

export class EntityRegistry {
  private static types = new Map<EntityType, EntityConstructor>();

  static register(type: EntityType, ctor: EntityConstructor) {
    this.types.set(type, ctor);
  }

  static create(type: EntityType, buf: PacketBuffer): Entity {
    // @ts-expect-error Doesn't wanna let me do the static method even though its static
    return this.types.get(type).netRead(buf);
  }
}
