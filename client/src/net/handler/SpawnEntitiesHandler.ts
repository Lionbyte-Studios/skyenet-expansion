import { Entity, EntityType } from "../../../../core/src/entity/Entity";
import { WebSocketMessageType, type SpawnEntitiesMessage } from "../../../../core/src/types";
import { ClientAsteroid } from "../../entity/ClientAsteroid";
import { ClientBullet } from "../../entity/ClientBullet";
import { ClientTextDisplay } from "../../entity/ClientTextDisplay";
import { game } from "../../Main";
import type { SocketMessageData } from "../WebSocketClient";
import { WsMessageHandler } from "./Handler";

export class WsSpawnEntitiesMessageHandler extends WsMessageHandler<SpawnEntitiesMessage> {
    handledType = WebSocketMessageType.SpawnEntities;
    public handleMessage(data: SocketMessageData<SpawnEntitiesMessage>) {
        const entities = data.message.entities;
        entities.forEach(entity => {
            let newEntity: Entity;
            switch (entity.type) {
                case EntityType.Asteroid:
                    newEntity = new ClientAsteroid(entity.data.x, entity.data.y, entity.data.rotation, entity.data.size, entity.data.entityID);
                    break;
                case EntityType.Bullet:
                    newEntity = new ClientBullet(entity.data.x, entity.data.y, entity.data.velX, entity.data.velY, entity.data.owner, entity.data.entityID);
                    break;
                case EntityType.TextDisplay:
                    newEntity = new ClientTextDisplay(entity.data.text, entity.data.x, entity.data.y, entity.data.entityID);
                    break;
                default:
                    console.error("Unknown entity type: {}\nData: {}", entity.type, entity.data);
                    return;
            }
            game.entities.push(newEntity);
        });
    }
}