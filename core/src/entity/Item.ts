import { ItemStack } from "../item/ItemStack";
import { PacketBuffer } from "../net/PacketBuffer";
import { EntityID } from "../types";
import { Entity, EntityType } from "./Entity";

export abstract class ItemEntity extends Entity {
  public item: ItemStack;

  constructor(x: number, y: number, item: ItemStack, entityID?: EntityID) {
    super(x, y, entityID);
    this.item = item;
  }

  static override get entityType(): EntityType {
    return EntityType.Item;
  }

  public override netWrite(buf: PacketBuffer): void {
    buf.writeFloat(this.x);
    buf.writeFloat(this.y);
    buf.writeString(this.entityID);
    this.item.netWrite(buf);
  }

  public static override netRead(buf: PacketBuffer): ItemEntity {
    throw new Error("Method was not implemented.");
  }
}
