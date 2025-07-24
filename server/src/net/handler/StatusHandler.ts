import {
  StatusMessage,
  WebSocketMessageType,
} from "../../../../core/src/types";
import { SocketMessageData } from "../WebSocketServer";
import { WsMessageHandler } from "./Handler";
import * as schemas from "../../../../core/src/Schemas";

export class WsStatusMessageHandler implements WsMessageHandler<StatusMessage> {
  handledType: WebSocketMessageType = WebSocketMessageType.Status;

  public async handleMessage(data: SocketMessageData<StatusMessage>) {
    const json = JSON.parse(data.message.toString()) as
      | StatusMessage
      | undefined;
    if (typeof json === "undefined" || json === undefined) return;
    if (json.status === "ping") {
      data.socket.send(
        JSON.stringify(
          schemas.StatusMessage.parse({
            status: "pong",
          }),
        ),
      );
    }
  }
}
