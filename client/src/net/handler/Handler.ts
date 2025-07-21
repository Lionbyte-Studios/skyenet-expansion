import { WebSocketMessageType } from "../../../../core/src/types";
import type { SocketMessageData } from "../WebSocketClient";

export abstract class WsMessageHandler<T> {
  abstract handledType: WebSocketMessageType;
  public abstract handleMessage(data: SocketMessageData<T>): void;
}
