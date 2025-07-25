import { WebSocket, WebSocketServer } from "ws";
import { ServerError, StatusMessage } from "../../../core/src/Schemas";
import { WebSocketMessageType } from "../../../core/src/types";
import { WsMessageHandler } from "./handler/Handler";
import { WsJoinMessageHandler } from "./handler/JoinHandler";
import { WsStatusMessageHandler } from "./handler/StatusHandler";
import { WsMovementMessageHandler } from "./handler/MovementHandler";
import { WsBulletMessageHandler } from "./handler/BulletHandler";

export interface SocketMessageData<T> {
  socket: WebSocket;
  socketData: {
    playerID?: string;
  };
  message: T;
}

export class WebSocketServerManager {
  public wss;
  private handlers: WsMessageHandler<unknown>[];

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
        this.handlers
          .filter(
            (handler) =>
              handler.handledType === (json.type as WebSocketMessageType),
          )
          .forEach(async (handler) => {
            const registeredPlayerID = await handler.handleMessage({
              socket: ws,
              socketData: socketData,
              message: data,
            });
            if (typeof registeredPlayerID === "string") {
              socketData.playerID = registeredPlayerID;
            }
          });
      });
      ws.send(JSON.stringify(StatusMessage.parse({ status: "connected" })));
    });
  }

  public registerHandler<T>(handler: WsMessageHandler<T>) {
    this.handlers.push(handler);
  }
}
