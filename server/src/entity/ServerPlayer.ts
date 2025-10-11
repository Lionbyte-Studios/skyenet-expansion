import { WebSocket } from "ws";
import { Player } from "../../../core/src/entity/Player";
import { KillEntitiesMessage, StatusMessage } from "../../../core/src/Schemas";
import {
  EntityID,
  PlayerID,
  ShipEngineSprite,
  ShipSprite,
} from "../../../core/src/types";
import { serverMgr } from "../Main";

export class ServerPlayer extends Player {
  socket_id: string;
  admin: boolean;
  constructor(
    playerID: PlayerID,
    entityID: EntityID,
    x: number,
    y: number,
    rotation: number,
    shipSprite: ShipSprite,
    shipEngineSprite: ShipEngineSprite,
    socket_id: string,
    admin?: boolean,
  ) {
    super(playerID, entityID, x, y, rotation, shipSprite, shipEngineSprite);
    this.socket_id = socket_id;
    this.admin = admin === undefined ? false : admin;
  }

  /**
   * Terminates the WebSocket (sends a last message to the client) and deletes the player from the game.
   * Also sends the appropriate message to all other players telling them to remove the player locally.
   */
  public leave_game(ws?: WebSocket) {
    const index = serverMgr.game.players.findIndex(
      (player) => player.playerID === this.playerID,
    );
    if (index !== -1) {
      const entityID = serverMgr.game.players[index].entityID;
      serverMgr.game.players.splice(index, 1);
      serverMgr.wsMgr.wss.clients.forEach((client) => {
        client.send(
          JSON.stringify(
            KillEntitiesMessage.parse({
              entities: [entityID],
            }),
          ),
        );
      });
    }
    if (ws !== undefined) {
      ws.send(
        JSON.stringify(
          StatusMessage.parse({
            status: "disconnecting",
          }),
        ),
      );
      ws.terminate();
    }
  }
}
