import { RawData, WebSocket, WebSocketServer } from "ws";
import { ServerError, StatusMessage } from "../../../core/src/Schemas";
import { WebSocketMessageType } from "../../../core/src/types";
import { WsMessageHandler } from "./handler/Handler";
import { WsJoinMessageHandler } from "./handler/JoinHandler";
import { WsStatusMessageHandler } from "./handler/StatusHandler";
import { WsMovementMessageHandler } from "./handler/MovementHandler";
import { WsBulletMessageHandler } from "./handler/BulletHandler";

export interface SocketMessageData {
  socket: WebSocket;
  socketData: {
    playerID?: string;
  };
  message: RawData;
}

export class WebSocketServerManager {
  public wss;
  private handlers: WsMessageHandler[];

  constructor() {
    this.handlers = [
      new WsJoinMessageHandler(),
      new WsStatusMessageHandler(),
      new WsMovementMessageHandler(),
      new WsBulletMessageHandler(),
    ];
    this.wss = new WebSocketServer({ port: 8081 });

    this.wss.on("connection", async (ws) => {
      const socketData: { playerID?: string } = { playerID: undefined };
      ws.on("error", console.error);

      ws.on("message", async (data) => {
        // console.log(`Received websocket message: ${data}`);
        let json;
        try {
          json = JSON.parse(data.toString());
        } catch (e) {
          console.error(e);
          ws.send(
            JSON.stringify(
              ServerError.parse({ message: "Failed to parse JSON" }),
            ),
          );
          return;
        }
        if (typeof json.type === "undefined") {
          ws.send(
            JSON.stringify(
              ServerError.parse({
                message: "json.type is of type 'undefined'",
              }),
            ),
          );
          return;
        }

        // Call all handlers
        this.handlers.forEach(async (handler) => {
          if (!handler.handledTypes.includes(json.type as WebSocketMessageType))
            return;
          const registeredPlayerID = await handler.handleMessage(
            json.type as WebSocketMessageType,
            {
              socket: ws,
              socketData: socketData,
              message: data,
            },
          );
          if (typeof registeredPlayerID === "string") {
            socketData.playerID = registeredPlayerID;
          }
        });
      });
      ws.send(JSON.stringify(StatusMessage.parse({ status: "connected" })));
    });
  }

  public registerHandler(handler: WsMessageHandler) {
    this.handlers.push(handler);
  }
}

// === OLD ACTIONS ===
/*
if (
    typeof json.playerID === "undefined" &&
    json.type !== WebSocketMessageType.Authentication
) {
    ws.send(
        JSON.stringify(
            ServerError.parse({
                message: "json.playerID is of type 'undefined'",
            }),
        ),
    );
} else if (json.type === WebSocketMessageType.Authentication) {
    ws.send(
        JSON.stringify(
            AuthenticationMessageCallback.parse({
                playerID: ServerGame.generateRandomPlayerID(),
                gameID: serverMgr.game.gameID,
            }),
        ),
    );
    return;
}

let result;
switch (json.type) {
    case WebSocketMessageType.Movement:
        result = MoveMessage.safeParse(json);
        if (!result.success) break;
        serverMgr.game.handleMovementMessage(json);
        break;
    case WebSocketMessageType.Status:
        result = StatusMessage.safeParse(json);
        if (!result.success) break;
        serverMgr.game.handleStatusMessage(json);
        break;
    default:
        break;
}*/
