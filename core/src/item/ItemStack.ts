import { PacketBuffer } from "../net/PacketBuffer";

export enum ItemMaterial {
  AIR,
  GOLD,
}

export class ItemStack {
  private _material: ItemMaterial;
  constructor(material: ItemMaterial) {
    this._material = material;
  }

  public get material(): ItemMaterial {
    return this._material;
  }

  public set material(material: ItemMaterial) {
    /* Future: despawn item when material is set to AIR */
    this._material = material;
  }

  public netWrite(buf: PacketBuffer) {
    buf.writeInt(this._material);
  }

  public static netRead(buf: PacketBuffer): ItemStack {
    return new ItemStack(buf.readInt());
  }
}
