import * as schemas from "../../../../core/src/Schemas";
import {
  BulletMessage,
  WebSocketMessageType,
} from "../../../../core/src/types";
import { ServerBullet } from "../../entity/ServerBullet";
import { serverMgr } from "../../Main";
import { SocketMessageData } from "../WebSocketServer";
import { WsMessageHandler } from "./Handler";

export class WsBulletMessageHandler implements WsMessageHandler<BulletMessage> {
  handledType: WebSocketMessageType = WebSocketMessageType.BulletMessage;

  public async handleMessage(data: SocketMessageData<BulletMessage>) {
    const json = JSON.parse(data.message.toString()) as
      | BulletMessage
      | undefined;
    if (typeof json === "undefined" || json === undefined) return;
    serverMgr.game.entities.push(
      new ServerBullet(
        json.bullet.x,
        json.bullet.y,
        json.bullet.velX,
        json.bullet.velY,
        json.playerID,
      ),
    );
    serverMgr.wsMgr.wss.clients.forEach((client) => {
      client.send(JSON.stringify(schemas.BulletMessage.parse(json)));
    });
  }
}
