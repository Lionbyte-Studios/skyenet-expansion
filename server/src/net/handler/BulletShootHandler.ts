import { EntityType } from "../../../../core/src/entity/Entity";
import * as schemas from "../../../../core/src/Schemas";
import {
  BulletShootMessage,
  WebSocketMessageType,
} from "../../../../core/src/types";
import { ServerBullet } from "../../entity/ServerBullet";
import { serverMgr } from "../../Main";
import { SocketMessageData } from "../WebSocketServer";
import { WsMessageHandler } from "./Handler";

export class WsBulletShootMessageHandler
  implements WsMessageHandler<BulletShootMessage>
{
  handledType: WebSocketMessageType = WebSocketMessageType.BulletShoot;

  public async handleMessage(data: SocketMessageData<BulletShootMessage>) {
    const json = JSON.parse(data.message.toString()) as
      | BulletShootMessage
      | undefined;
    if (typeof json === "undefined" || json === undefined) return;
    const newBullet = new ServerBullet(
      json.bullet.x,
      json.bullet.y,
      json.bullet.velX,
      json.bullet.velY,
      json.playerID,
    );
    serverMgr.game.entities.push(newBullet);
    serverMgr.wsMgr.wss.clients.forEach((client) => {
      client.send(
        JSON.stringify(
          schemas.SpawnEntitiesMessage.parse({
            entities: [
              {
                type: EntityType.Bullet,
                data: {
                  x: json.bullet.x,
                  y: json.bullet.y,
                  velX: json.bullet.velX,
                  velY: json.bullet.velY,
                  owner: json.playerID,
                  entityID: newBullet.entityID,
                },
              },
            ],
          }),
        ),
      );
    });
  }
}
