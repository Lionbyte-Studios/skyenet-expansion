import {
  WebSocketMessageType,
  type TextDisplayMessage,
} from "../../../../core/src/types";
import { ClientTextDisplay } from "../../entity/ClientTextDisplay";
import { game } from "../../Main";
import type { SocketMessageData } from "../WebSocketClient";
import { WsMessageHandler } from "./Handler";

export class WsTextDisplayMessageHandler extends WsMessageHandler<TextDisplayMessage> {
  handledType: WebSocketMessageType = WebSocketMessageType.BulletMessage;
  public handleMessage(data: SocketMessageData<TextDisplayMessage>): void {
    game.entities.push(
      new ClientTextDisplay(
        data.message.textDisplay.text,
        data.message.textDisplay.x,
        data.message.textDisplay.y,
      ),
    );
  }
}
