import { WebSocketMessageType, type ModifyEntitiesMessage } from "../../../../core/src/types";
import { game } from "../../Main";
import type { SocketMessageData } from "../WebSocketClient";
import { WsMessageHandler } from "./Handler";

export class WsModifyEntitiesMessageHandler extends WsMessageHandler<ModifyEntitiesMessage> {
    handledType = WebSocketMessageType.ModifyEntities;
    public handleMessage(data: SocketMessageData<ModifyEntitiesMessage>): void {
        data.message.modifications.forEach(modification => {
            const index = game.entities.findIndex(entity => entity.entityID = modification.entityID);
            if(index === -1) {
                console.error("No entity with ID {} found!", modification.entityID);
                return;
            }
            for (const key in modification.modified_data) {
                game.entities[index][key] = modification.modified_data[key];
            }
        });
    }
}