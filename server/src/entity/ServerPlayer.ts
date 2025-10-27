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

export class ServerPlayer extends Player {
  admin: boolean;
  lastPonged: number;
  constructor(
    playerID: PlayerID,
    entityID: EntityID,
    x: number,
    y: number,
    rotation: number,
    shipSprite: ShipSprite,
    shipEngineSprite: ShipEngineSprite,
    admin?: boolean,
  ) {
    super(playerID, entityID, x, y, rotation, shipSprite, shipEngineSprite);
    this.admin = admin === undefined ? false : admin;
    this.lastPonged = Date.now();
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
}
