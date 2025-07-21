import z from "zod";
import {
  PlayerJoinMessageCallback,
  UpdatePlayersMessage,
} from "../../../../core/src/Schemas";
import { WebSocketMessageType } from "../../../../core/src/types";
import {
  assert,
  entitiyToZodEntitySchema,
} from "../../../../core/src/util/Util";
import { serverMgr } from "../../Main";
import { SocketMessageData } from "../WebSocketServer";
import { WsMessageHandler } from "./Handler";
import { EntitySchema } from "../../../../core/src/Schemas";

export class WsJoinMessageHandler implements WsMessageHandler {
  handledTypes: WebSocketMessageType[];

  constructor() {
    this.handledTypes = [WebSocketMessageType.PlayerJoin];
  }

  public async handleMessage(
    type: WebSocketMessageType,
    data: SocketMessageData,
  ) {
    assert(type === WebSocketMessageType.PlayerJoin);
    const player = serverMgr.game.generatePlayer();
    serverMgr.game.addPlayer(player);
    const entitiesAsSchema: z.infer<typeof EntitySchema>[] = [];
    serverMgr.game.entities.forEach((entity) => {
      entitiesAsSchema.push(entitiyToZodEntitySchema(entity));
    });
    data.socket.send(
      JSON.stringify(
        PlayerJoinMessageCallback.parse({
          playerID: player.playerID,
          entityID: player.entityID,
          gameID: serverMgr.game.gameID,
          players: serverMgr.game.players,
          entities: entitiesAsSchema,
        }),
      ),
    );
    serverMgr.wsMgr.wss.clients.forEach((client) => {
      client.send(
        JSON.stringify(
          UpdatePlayersMessage.parse({
            playersAdded: [
              {
                playerID: player.playerID,
                entityID: player.entityID,
                x: player.x,
                y: player.y,
                velX: player.velX,
                velY: player.velY,
                velR: player.velR,
                rotation: player.rotation,
                engineActive: player.engineActive,
                shipSprite: player.shipSprite,
                shipEngineSprite: player.shipEngineSprite,
                flames: player.flames,
              },
            ],
            playersRemoved: [],
          }),
        ),
      );
    });
    console.log(`Player with id ${player.playerID} joined the game`);
    return player.playerID;
  }
}
