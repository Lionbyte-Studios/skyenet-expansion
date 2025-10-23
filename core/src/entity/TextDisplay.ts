import { PacketBuffer } from "../net/PacketBuffer";
import { EntityID } from "../types";
import { Entity, EntityType } from "./Entity";

export class TextDisplay extends Entity {
  public static override get entityType(): EntityType {
    return EntityType.TextDisplay;
  }

  public text: string;
  constructor(text: string, x: number, y: number, entityID?: EntityID) {
    super(x, y, entityID);
    this.text = text;
  }

  public override netWrite(buf: PacketBuffer): void {
    buf.writeString(this.text);
    buf.writeFloat(this.x);
    buf.writeFloat(this.y);
    buf.writeString(this.entityID);
  }

  public static override netRead(buf: PacketBuffer): TextDisplay {
    return new TextDisplay(
      buf.readString(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readString(),
    );
  }
}
