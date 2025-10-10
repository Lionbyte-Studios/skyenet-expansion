import {
  WebSocketMessageType,
  type KillEntitiesMessage,
} from "../../../../core/src/types";
import { clientManager } from "../../Main";
import type { SocketMessageData } from "../WebSocketClient";
import { WsMessageHandler } from "./Handler";

export class WsKillEntitiesMessageHandler extends WsMessageHandler<KillEntitiesMessage> {
  handledType = WebSocketMessageType.KillEntities;
  public handleMessage(data: SocketMessageData<KillEntitiesMessage>): void {
    data.message.entities.forEach((entityID) => {
      const index = clientManager.game.entities.findIndex(
        (entity) => entity.entityID === entityID,
      );
      if (index === -1) {
        const playerIndex = clientManager.game.players.findIndex(
          (player) => player.entityID === entityID,
        );
        if (playerIndex === -1) {
          console.warn(
            `Entity or player with ID ${entityID} that should have been killed was not found.`,
          );
          return;
        }
        clientManager.game.players.splice(playerIndex, 1);
        return;
      }
      if (
        "onKill" in clientManager.game.entities[index] &&
        typeof clientManager.game.entities[index].onKill === "function"
      )
        clientManager.game.entities[index].onKill(
          clientManager.getRenderInfo(),
        );
      clientManager.game.entities.splice(index, 1);
    });
  }
}
