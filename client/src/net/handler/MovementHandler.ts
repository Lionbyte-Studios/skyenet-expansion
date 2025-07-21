import {
  WebSocketMessageType,
  type MovementMessage,
} from "../../../../core/src/types";
import { game } from "../../Main";
import type { SocketMessageData } from "../WebSocketClient";
import { WsMessageHandler } from "./Handler";

export class WsMovementMessageHandler extends WsMessageHandler<MovementMessage> {
  handledType: WebSocketMessageType = WebSocketMessageType.Movement;
  public handleMessage(data: SocketMessageData<MovementMessage>): void {
    if (
      (data.message.ignoreOwnPlayer === undefined ||
        data.message.ignoreOwnPlayer) &&
      data.message.playerID === game.myPlayer.playerID
    )
      return;

    const playerIndex = game.players.findIndex(
      (player) => player.playerID === data.message.playerID,
    );
    if (playerIndex === -1) {
      console.error(
        `Could not find player with ID ${data.message.playerID}, not processing movement`,
      );
      return;
    }

    game.players[playerIndex].x = data.message.x;
    game.players[playerIndex].y = data.message.y;
    game.players[playerIndex].engineActive = data.message.engineActive;
    game.players[playerIndex].rotation = data.message.rotation;
    if (data.message.flames !== undefined) {
      game.players[playerIndex].flames = data.message.flames;
    }
  }
}
