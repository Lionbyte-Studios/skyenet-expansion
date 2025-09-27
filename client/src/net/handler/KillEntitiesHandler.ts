import { WebSocketMessageType, type KillEntitiesMessage } from "../../../../core/src/types";
import { game } from "../../Main";
import type { SocketMessageData } from "../WebSocketClient";
import { WsMessageHandler } from "./Handler";

export class WsKillEntitiesMessageHandler extends WsMessageHandler<KillEntitiesMessage> {
    handledType = WebSocketMessageType.KillEntities;
    public handleMessage(data: SocketMessageData<KillEntitiesMessage>): void {
        data.message.entities.forEach(entityID => {
            const index = game.entities.findIndex(entity => entity.entityID = entityID);
            if(index === -1) {
                console.warn(`Entity with ID ${entityID} that should have been killed was not found.`);
                return;
            }
            game.entities.splice(index, 1);
        });
    }
}