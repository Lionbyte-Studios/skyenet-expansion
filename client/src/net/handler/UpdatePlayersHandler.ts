import {
  WebSocketMessageType,
  type UpdatePlayersMessage,
} from "../../../../core/src/types";
import { ClientPlayer } from "../../entity/ClientPlayer";
import { game } from "../../Main";
import type { SocketMessageData } from "../WebSocketClient";
import { WsMessageHandler } from "./Handler";

export class WsUpdatePlayersMessageHandler extends WsMessageHandler<UpdatePlayersMessage> {
  handledType: WebSocketMessageType = WebSocketMessageType.UpdatePlayers;
  public handleMessage(data: SocketMessageData<UpdatePlayersMessage>): void {
    data.message.playersRemoved.forEach((removedPlayerID) => {
      game.players.splice(
        game.players.findIndex((player) => player.playerID === removedPlayerID),
        1,
      );
    });
    data.message.playersAdded.forEach((player) => {
      if (player.playerID === game.myPlayer.playerID) return;
      const newPlayer = new ClientPlayer(
        player.playerID,
        player.entityID,
        player.x,
        player.y,
        player.rotation,
        player.shipSprite,
        player.shipEngineSprite,
      );
      newPlayer.velX = player.velX;
      newPlayer.velY = player.velY;
      newPlayer.velR = player.velR;
      newPlayer.engineActive = player.engineActive;
      if (player.flames !== undefined) {
        newPlayer.flames = player.flames;
      }
      game.players.push(newPlayer);
    });
  }
}
