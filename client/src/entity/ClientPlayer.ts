import { Player } from "../../../core/src/entity/Player";
import type { PacketBuffer } from "../../../core/src/net/PacketBuffer";
import { ShipEngineSprite, ShipSprite } from "../../../core/src/types";
import { toStringEnum } from "../../../core/src/util/Util";

export class ClientPlayer extends Player {
  public static override netRead(buf: PacketBuffer): Player {
    return new ClientPlayer(
      buf.readString(),
      buf.readString(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      toStringEnum(ShipSprite, buf.readString()) ?? ShipSprite.White,
      toStringEnum(ShipEngineSprite, buf.readString()) ??
        ShipEngineSprite.White,
    );
  }
}
