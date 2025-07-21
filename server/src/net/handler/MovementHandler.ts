import * as schemas from "../../../../core/src/Schemas";
import {
  MovementMessage,
  WebSocketMessageType,
} from "../../../../core/src/types";
import { assert } from "../../../../core/src/util/Util";
import { serverMgr } from "../../Main";
import { SocketMessageData } from "../WebSocketServer";
import { WsMessageHandler } from "./Handler";

export class WsMovementMessageHandler implements WsMessageHandler {
  handledTypes: WebSocketMessageType[];

  constructor() {
    this.handledTypes = [WebSocketMessageType.Movement];
  }

  public async handleMessage(
    type: WebSocketMessageType,
    data: SocketMessageData,
  ) {
    assert(type === WebSocketMessageType.Movement);
    const json = JSON.parse(data.message.toString()) as
      | MovementMessage
      | undefined;
    assert(typeof json !== "undefined" && json !== undefined);
    if (json!.playerID !== data.socketData.playerID) {
      console.warn(
        `playerIDs dont match: received ${json!.playerID} but socketData.playerID is ${data.socketData.playerID}`,
      );
      return;
    }
    const playerIndex = serverMgr.game.players.findIndex(
      (player) => player.playerID === json!.playerID,
    );
    if (playerIndex === -1) {
      console.error("Could not find index of player");
      return;
    }
    serverMgr.game.players[playerIndex].x = json!.x;
    serverMgr.game.players[playerIndex].y = json!.y;
    serverMgr.game.players[playerIndex].rotation = json!.rotation;
    serverMgr.game.players[playerIndex].engineActive = json!.engineActive;
    serverMgr.game.players[playerIndex].velX = json!.velX;
    serverMgr.game.players[playerIndex].velY = json!.velY;
    serverMgr.game.players[playerIndex].velR = json!.velR;
    if (json!.flames !== undefined) {
      serverMgr.game.players[playerIndex].flames = json!.flames;
    }

    // Send movement to all clients
    serverMgr.wsMgr.wss.clients.forEach((client) => {
      client.send(JSON.stringify(schemas.MovementMessage.parse(json)));
    });
  }
}
