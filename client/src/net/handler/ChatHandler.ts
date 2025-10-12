import {
  WebSocketMessageType,
  type ChatMessage,
} from "../../../../core/src/types";
import { InGameScreen } from "../../graphics/screen/InGameScreen";
import { clientManager } from "../../Main";
import type { SocketMessageData } from "../WebSocketClient";
import { WsMessageHandler } from "./Handler";

export class WsChatMessageHandler extends WsMessageHandler<ChatMessage> {
  handledType: WebSocketMessageType = WebSocketMessageType.Chat;
  public handleMessage(data: SocketMessageData<ChatMessage>): void {
    console.log(
      `Received chat message from ${data.message.sender === undefined ? "<server>" : data.message.sender}: ${data.message.message}`,
    );
    if (!(clientManager.currentScreen instanceof InGameScreen)) {
      console.warn(
        "Received chat message was not processed. The current screen is not an instance of InGameScreen.",
      );
      return;
    }
    clientManager.currentScreen.addChatMessage(
      data.message.message,
      data.message.sender,
    );
  }
}
