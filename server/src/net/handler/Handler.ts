import { WebSocketMessageType } from "../../../../core/src/types";
import { SocketMessageData } from "../WebSocketServer";

export interface WsMessageHandler {
  handledTypes: WebSocketMessageType[];
  handleMessage: (
    type: WebSocketMessageType,
    data: SocketMessageData,
  ) => Promise<string | void>;
}
