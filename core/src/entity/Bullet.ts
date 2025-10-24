import { PacketBuffer } from "../net/PacketBuffer";
import { PlayerID } from "../types";
import { Entity, EntityType } from "./Entity";

export enum BulletType {
  Starter,
}

export abstract class Bullet extends Entity {
  public static override get entityType(): EntityType {
    return EntityType.Bullet;
  }

  type: BulletType = BulletType.Starter;
  velX: number = 0;
  velY: number = 0;
  owner: PlayerID;

  constructor(
    x: number,
    y: number,
    velX: number,
    velY: number,
    owner: PlayerID,
    entityID?: string,
  ) {
    super(x, y, entityID);
    this.velX = velX;
    this.velY = velY;
    this.owner = owner;
  }

  public tick() {
    // toFixed(4) to prevent random float magic
    this.x = parseFloat((this.x + this.velX).toFixed(4));
    this.y = parseFloat((this.y + this.velY).toFixed(4));
  }

  public override netWrite(buf: PacketBuffer): void {
    buf.writeFloat(this.x);
    buf.writeFloat(this.y);
    buf.writeFloat(this.velX);
    buf.writeFloat(this.velY);
    buf.writeString(this.owner);
    buf.writeString(this.entityID);
  }

  public static override netRead(buf: PacketBuffer): Bullet {
    throw new Error("Method was not implemented.");
  }
}
