import { WebSocketMessageType } from "../../../../core/src/types";
import { SocketMessageData } from "../WebSocketServer";

export abstract class WsMessageHandler<T> {
  abstract handledType: WebSocketMessageType;
  public abstract handleMessage(
    data: SocketMessageData<T>,
  ): Promise<void | string>;
}
