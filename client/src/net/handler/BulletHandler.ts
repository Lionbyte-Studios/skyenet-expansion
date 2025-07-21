import {
  WebSocketMessageType,
  type BulletMessage,
} from "../../../../core/src/types";
import { ClientBullet } from "../../entity/ClientBullet";
import { game } from "../../Main";
import type { SocketMessageData } from "../WebSocketClient";
import { WsMessageHandler } from "./Handler";

export class WsBulletMessageHandler extends WsMessageHandler<BulletMessage> {
  handledType: WebSocketMessageType = WebSocketMessageType.BulletMessage;
  public handleMessage(data: SocketMessageData<BulletMessage>): void {
    game.entities.push(
      new ClientBullet(
        data.message.bullet.x,
        data.message.bullet.y,
        data.message.bullet.velX,
        data.message.bullet.velY,
        data.message.playerID,
      ),
    );
  }
}
