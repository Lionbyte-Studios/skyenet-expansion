import { ItemEntity, ItemState } from "../../../core/src/entity/Item";
import { ModifyEntitiesS2CPacket } from "../../../core/src/net/packets/ModifyEntitiesS2CPacket";
import { PlayerID } from "../../../core/src/types";
import { serverMgr } from "../Main";

export class ServerItemEntity extends ItemEntity {
  public pickUp(player: PlayerID) {
    this.playerPickingUp = player;
    this.state = ItemState.PickingUp;
    serverMgr.wsMgr.broadcastPacket(
      new ModifyEntitiesS2CPacket([
        {
          entityID: this.entityID,
          modifications: {
            state: this.state,
            playerPickingUp: this.playerPickingUp,
          },
        },
      ]),
    );
  }
}
