import { assert } from "../../../../core/src/util/Util";
import {
  StatusMessage,
  WebSocketMessageType,
} from "../../../../core/src/types";
import { SocketMessageData } from "../WebSocketServer";
import { WsMessageHandler } from "./Handler";
import * as schemas from "../../../../core/src/Schemas";

export class WsStatusMessageHandler implements WsMessageHandler {
  handledTypes: WebSocketMessageType[];

  constructor() {
    this.handledTypes = [WebSocketMessageType.Status];
  }

  public async handleMessage(
    type: WebSocketMessageType,
    data: SocketMessageData,
  ) {
    assert(type === WebSocketMessageType.Status);
    const json = JSON.parse(data.message.toString()) as
      | StatusMessage
      | undefined;
    assert(typeof json !== "undefined" && json !== undefined);
    if (json!.status === "ping") {
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
