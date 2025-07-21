import * as schemas from "../../../../core/src/Schemas";
import {
  WebSocketMessageType,
  type StatusMessage,
} from "../../../../core/src/types";
import type { SocketMessageData } from "../WebSocketClient";
import { WsMessageHandler } from "./Handler";

export class WsStatusMessageHandler extends WsMessageHandler<StatusMessage> {
  handledType: WebSocketMessageType = WebSocketMessageType.Status;

  public handleMessage(data: SocketMessageData<StatusMessage>): void {
    const status = data.message.status;
    if (status === "ping") {
      data.socket.send(
        JSON.stringify(schemas.StatusMessage.parse({ status: "pong" })),
      );
    } else console.log(`Got WebSocket status: ${status}`);
  }
}
