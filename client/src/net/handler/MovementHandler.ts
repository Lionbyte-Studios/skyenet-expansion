import {
  WebSocketMessageType,
  type MovementMessage,
} from "../../../../core/src/types";
import { clientManager } from "../../Main";
import type { SocketMessageData } from "../WebSocketClient";
import { WsMessageHandler } from "./Handler";

export class WsMovementMessageHandler extends WsMessageHandler<MovementMessage> {
  handledType: WebSocketMessageType = WebSocketMessageType.Movement;
  public handleMessage(data: SocketMessageData<MovementMessage>): void {
    if (
      (data.message.ignoreOwnPlayer === undefined ||
        data.message.ignoreOwnPlayer) &&
      data.message.playerID === clientManager.game.myPlayer.playerID
    )
      return;

    const playerIndex = clientManager.game.players.findIndex(
      (player) => player.playerID === data.message.playerID,
    );
    if (playerIndex === -1) {
      console.error(
        `Could not find player with ID ${data.message.playerID}, not processing movement`,
      );
      return;
    }

    clientManager.game.players[playerIndex].x = data.message.x;
    clientManager.game.players[playerIndex].y = data.message.y;
    clientManager.game.players[playerIndex].engineActive =
      data.message.engineActive;
    clientManager.game.players[playerIndex].rotation = data.message.rotation;
    if (data.message.flames !== undefined) {
      clientManager.game.players[playerIndex].flames = data.message.flames;
    }
  }
}
