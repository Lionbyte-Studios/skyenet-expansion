import {
  WebSocketMessageType,
  type UpdatePlayersMessage,
} from "../../../../core/src/types";
import { ClientPlayer } from "../../entity/ClientPlayer";
import { clientManager } from "../../Main";
import type { SocketMessageData } from "../WebSocketClient";
import { WsMessageHandler } from "./Handler";

export class WsUpdatePlayersMessageHandler extends WsMessageHandler<UpdatePlayersMessage> {
  handledType: WebSocketMessageType = WebSocketMessageType.UpdatePlayers;
  public handleMessage(data: SocketMessageData<UpdatePlayersMessage>): void {
    data.message.playersRemoved.forEach((removedPlayerID) => {
      clientManager.game!.players.splice(
        clientManager.game!.players.findIndex(
          (player) => player.playerID === removedPlayerID,
        ),
        1,
      );
    });
    console.log(clientManager.game);
    data.message.playersAdded.forEach((player) => {
      if (player.playerID === clientManager.game.myPlayer.playerID) return;
      if (
        clientManager.game.players.filter((p) => p.playerID === player.playerID)
          .length > 0
      )
        return;
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
      clientManager.game!.players.push(newPlayer);
    });
  }
}
