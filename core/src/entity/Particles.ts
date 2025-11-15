import { PacketBuffer } from "../net/PacketBuffer";
import { EntityID } from "../types";
import { Entity, EntityType } from "./Entity";

export enum ParticleType {
  Square,
}

export abstract class Particles extends Entity {
  static get entityType(): EntityType {
    return EntityType.Particles;
  }

  constructor(
    x: number,
    y: number,
    public color: string,
    public particleType: ParticleType,
    public amount: number,
    public delta: number,
    public randomNess: number,
    entityID?: EntityID,
  ) {
    super(x, y, entityID);
  }

  public netWrite(buf: PacketBuffer): void {
    buf.writeFloat(this.x);
    buf.writeFloat(this.y);
    buf.writeString(this.color);
    buf.writeInt(this.particleType);
    buf.writeInt(this.amount);
    buf.writeFloat(this.delta);
    buf.writeFloat(this.randomNess);
    buf.writeString(this.entityID);
  }

  public static override netRead(buf: PacketBuffer): Particles {
    throw new Error("Method was not implemented.");
  }
}
