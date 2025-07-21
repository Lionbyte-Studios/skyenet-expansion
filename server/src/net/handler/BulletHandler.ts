import * as schemas from "../../../../core/src/Schemas";
import {
  BulletMessage,
  WebSocketMessageType,
} from "../../../../core/src/types";
import { assert } from "../../../../core/src/util/Util";
import { ServerBullet } from "../../entity/ServerBullet";
import { serverMgr } from "../../Main";
import { SocketMessageData } from "../WebSocketServer";
import { WsMessageHandler } from "./Handler";

export class WsBulletMessageHandler implements WsMessageHandler {
  handledTypes: WebSocketMessageType[];

  constructor() {
    this.handledTypes = [WebSocketMessageType.BulletMessage];
  }

  public async handleMessage(
    type: WebSocketMessageType,
    data: SocketMessageData,
  ) {
    assert(type === WebSocketMessageType.BulletMessage);
    const json = JSON.parse(data.message.toString()) as
      | BulletMessage
      | undefined;
    assert(typeof json !== "undefined" && json !== undefined);
    serverMgr.game.entities.push(
      new ServerBullet(
        json!.bullet.x,
        json!.bullet.y,
        json!.bullet.velX,
        json!.bullet.velY,
        json!.playerID,
      ),
    );
    serverMgr.wsMgr.wss.clients.forEach((client) => {
      client.send(JSON.stringify(schemas.BulletMessage.parse(json)));
    });
  }
}
