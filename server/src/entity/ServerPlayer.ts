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

export class ServerPlayer extends Player implements CommandSender {
  admin: boolean;
  lastPonged: number;
  sendPacket: ServerConnection["sendPacket"];
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
    const index = serverMgr.game.players.findIndex(
      (player) => player.playerID === this.playerID,
    );
    if (index !== -1) {
      const entityID = serverMgr.game.players[index].entityID;
      serverMgr.game.players.splice(index, 1);
      serverMgr.wsMgr.broadcastPacket(new KillEntitiesS2CPacket([entityID]));
    }
    if (ws !== undefined) {
      ws.terminate();
    }
  }

  sendMessage(message: string): void {
    this.sendPacket(new ChatMessageS2CPacket(message));
  }
  getName(): string {
    return this.playerID;
  }
  isAdmin(): boolean {
    return true;
  }
}
