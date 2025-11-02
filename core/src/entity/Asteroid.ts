import { PacketBuffer } from "../net/PacketBuffer";
import { isInArea } from "../util/Util";
import { Entity, EntityType } from "./Entity";

export enum AsteroidType {
  Average,
}

export abstract class Asteroid extends Entity {
  public static override get entityType(): EntityType {
    return EntityType.Asteroid;
  }

  type: AsteroidType = AsteroidType.Average;
  velX: number = 0;
  velY: number = 0;
  rotation: number;
  size: number;
  health: number;

  constructor(
    x: number,
    y: number,
    rotation: number,
    size: number,
    entityID?: string,
  ) {
    super(x, y, entityID);
    this.rotation = rotation;
    this.size = size;
    this.health = 10;
  }

  public override isInHitbox(x: number, y: number): boolean {
    return isInArea(
      {
        x: this.x - 8 * this.size,
        y: this.y - 8 * this.size,
        width: 16 * this.size,
        height: 16 * this.size,
      },
      { x: x, y: y },
    );
  }

  public override netWrite(buf: PacketBuffer): void {
    buf.writeFloat(this.x);
    buf.writeFloat(this.y);
    buf.writeFloat(this.rotation);
    buf.writeInt(this.size);
    buf.writeString(this.entityID);
  }

  public static override netRead(buf: PacketBuffer): Asteroid {
    throw new Error("Method was not implemented.");
  }
}
