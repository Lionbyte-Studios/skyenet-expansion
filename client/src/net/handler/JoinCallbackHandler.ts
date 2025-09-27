import { EntityType, type Entity } from "../../../../core/src/entity/Entity";
import {
  WebSocketMessageType,
  type PlayerJoinCallbackMessage,
} from "../../../../core/src/types";
import { ClientAsteroid } from "../../entity/ClientAsteroid";
import { ClientBullet } from "../../entity/ClientBullet";
import { ClientPlayer } from "../../entity/ClientPlayer";
import { ClientTextDisplay } from "../../entity/ClientTextDisplay";
import type { JoinCallbackData, SocketMessageData } from "../WebSocketClient";
import { WsMessageHandler } from "./Handler";

export class WsPlayerJoinCallbackMessageHandler extends WsMessageHandler<PlayerJoinCallbackMessage> {
  handledType: WebSocketMessageType = WebSocketMessageType.PlayerJoinCallback;
  public handleMessage(
    data: SocketMessageData<PlayerJoinCallbackMessage>,
  ): void {
    const playersFromJoin: ClientPlayer[] = [];
    const entitiesFromJoin: Entity[] = [];

    data.message.players.forEach((player) => {
      const clientPlayer = new ClientPlayer(
        player.playerID,
        player.entityID,
        player.x,
        player.y,
        player.rotation,
        player.shipSprite,
        player.shipEngineSprite,
      );
      clientPlayer.engineActive = player.engineActive;
      clientPlayer.velX = player.velX;
      clientPlayer.velY = player.velY;
      clientPlayer.velR = player.velR;
      if (player.flames !== undefined) {
        clientPlayer.flames = player.flames;
      }
      playersFromJoin.push(clientPlayer);
    });

    data.message.entities.forEach((entity) => {
      let newEntity: Entity;
      switch (entity.entityType) {
        case EntityType.Bullet:
          newEntity = new ClientBullet(
            entity.entityData.x,
            entity.entityData.y,
            entity.entityData.velX,
            entity.entityData.velY,
            entity.entityData.owner,
          );
          break;
        case EntityType.Asteroid:
          newEntity = new ClientAsteroid(
            entity.entityData.x,
            entity.entityData.y,
            entity.entityData.rotation,
            entity.entityData.size,
          );
          break;
        case EntityType.TextDisplay:
          newEntity = new ClientTextDisplay(
            entity.entityData.text,
            entity.entityData.x,
            entity.entityData.y
          );
          break;
        default:
          console.warn(`Received unknown entity type: ${entity.entityType}`);
          return;
      }
      newEntity.entityID = entity.entityID;
      entitiesFromJoin.push(newEntity);
    });

    const callbackData: JoinCallbackData = {
      entityID: data.message.entityID,
      playerID: data.message.playerID,
      gameID: data.message.gameID,
      players: playersFromJoin,
      entities: entitiesFromJoin,
    };
    data.client.resolveJoinCallbackData(callbackData);
  }
}
