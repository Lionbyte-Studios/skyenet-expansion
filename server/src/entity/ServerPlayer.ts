import { WebSocket } from "ws";
import { Player } from "../../../core/src/entity/Player";
import {
  EntityID,
  PlayerID,
  ShipEngineSprite,
  ShipSprite,
} from "../../../core/src/types";
import { serverMgr } from "../Main";
import { KillEntitiesS2CPacket } from "../../../core/src/net/packets/KillEntitiesS2CPacket";
import { CommandSender } from "../commands/lib/CommandManager";
import { ServerConnection } from "../net/ServerConnection";
import { ChatMessageS2CPacket } from "../../../core/src/net/packets/ChatMessageS2CPacket";
import { Session, User } from "../../../core/src/DatabaseSchemas";
import { ServerItemEntity } from "./ServerItem";
import { ItemMaterial } from "../../../core/src/item/ItemStack";
import { ModifyEntitiesS2CPacket } from "../../../core/src/net/packets/ModifyEntitiesS2CPacket";

export class ServerPlayer extends Player implements CommandSender {
  admin: boolean;
  lastPonged: number;
  sendPacket: ServerConnection["sendPacket"];
  db_user?: User;
  db_session?: Session;
  constructor(
    playerID: PlayerID,
    entityID: EntityID,
    x: number,
    y: number,
    rotation: number,
    shipSprite: ShipSprite,
    shipEngineSprite: ShipEngineSprite,
    sendPacket: ServerConnection["sendPacket"],
    admin?: boolean,
  ) {
    super(playerID, entityID, x, y, rotation, shipSprite, shipEngineSprite);
    this.admin = admin === undefined ? false : admin;
    this.lastPonged = Date.now();
    this.sendPacket = sendPacket;
  }

  /**
   * Terminates the WebSocket and deletes the player from the game.
   * Also sends the appropriate message to all other players telling them to remove the player locally.
   */
  public leave_game(ws?: WebSocket) {
    serverMgr.game.killEntity((entity) => entity.entityID === this.entityID);
    serverMgr.wsMgr.broadcastPacket(new KillEntitiesS2CPacket([this.entityID]));
    if (ws !== undefined) {
      ws.terminate();
    }
  }

  // Performs no checks of whether the player can actually pick this item up or not
  public pickupItem(item: ServerItemEntity) {
    if (item.item.material === ItemMaterial.GOLD) {
      this.inventory.coins++;
      this.sendPacket(
        new ModifyEntitiesS2CPacket([
          {
            entityID: this.entityID,
            modifications: { inventory: this.inventory },
          },
        ]),
      );
    }
    item.pickUp(this.playerID);
    serverMgr.game.killEntity((e) => e.entityID === item.entityID, false);
  }

  sendMessage(message: string): void {
    this.sendPacket(new ChatMessageS2CPacket(message));
  }
  getName(): string {
    return this.playerID;
  }
  isAdmin(): boolean {
    return this.admin;
  }
}
