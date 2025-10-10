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
    const bulletData = schemas.BulletShootMessage.safeParse(json);
    if (!bulletData.success) return;
    serverMgr.game.spawnEntity(
      new ServerBullet(
        bulletData.data.bullet.x,
        bulletData.data.bullet.y,
        bulletData.data.bullet.velX,
        bulletData.data.bullet.velY,
        bulletData.data.playerID,
      ),
    );
  }
}
