import { WebSocket, WebSocketServer } from "ws";
import { ServerError, StatusMessage } from "../../../core/src/Schemas";
import { PlayerID, WebSocketMessageType } from "../../../core/src/types";
import { WsMessageHandler } from "./handler/Handler";
import { WsJoinMessageHandler } from "./handler/JoinHandler";
import { WsStatusMessageHandler } from "./handler/StatusHandler";
import { WsMovementMessageHandler } from "./handler/MovementHandler";
import { WsBulletShootMessageHandler } from "./handler/BulletShootHandler";
import { serverMgr } from "../Main";
import { generateUserID } from "../api/Util";
import { WsCommandMessageHandler } from "./handler/CommandHandler";

export interface SocketMessageData<T> {
  socket: WebSocketClientWithData;
  socketData: WebSocketClientData;
  message: T;
}

export type WebSocketClientData = {
  isAlive: boolean;
  socket_id: string;
  playerID?: PlayerID;
};

export type WebSocketClientWithData = WebSocket & {
  data?: WebSocketClientData;
};

export class WebSocketServerManager {
  public wss: WebSocketServer;
  private handlers: WsMessageHandler<unknown>[];

  constructor() {
    this.handlers = [
      new WsJoinMessageHandler(),
      new WsStatusMessageHandler(),
      new WsMovementMessageHandler(),
      new WsBulletShootMessageHandler(),
      new WsCommandMessageHandler(),
    ];
    this.wss = new WebSocketServer({ port: 8081 });

    this.wss.on("connection", async (ws: WebSocketClientWithData) => {
      ws.data = {
        isAlive: true,
        socket_id: this.generateSocketId(),
        playerID: "",
      };
      ws.on("error", console.error);
      ws.on("pong", () => {
        ws.data!.isAlive = true;
      });
      ws.on("close", () => {
        const index = serverMgr.game.players.findIndex(
          (player) => player.socket_id === ws.data!.socket_id,
        );
        if (index === -1) return;
        console.log(
          `WebSocket closing: (PlayerID) ${serverMgr.game.players[index].playerID}`,
        );
        serverMgr.game.players[index].leave_game();
        /*const id = ws.data.playerId;
          if(id !== undefined) {
            const entityId = serverMgr.game.players.filter(player => player.playerID === id)[0].entityID;
            const index = serverMgr.game.players.findIndex(player => player.playerID === id);
            if(index === -1) return;
            serverMgr.game.players.splice(index, 1);
            this.wss.clients.forEach(client => {
              client.send(
                JSON.stringify(
                  KillEntitiesMessage.parse({
                    entities: [entityId]
                  })
                )
              )
            });
          }*/
      });

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
              socketData: ws.data!,
              message: data,
            });
            if (typeof registeredPlayerID === "string") {
              ws.data!.playerID = registeredPlayerID;
            }
          });
      });
      ws.send(JSON.stringify(StatusMessage.parse({ status: "connected" })));
    });

    const ping_interval = setInterval(() => {
      this.wss.clients.forEach((client: WebSocketClientWithData) => {
        if (!client.data!.isAlive) {
          /*const id = client.data!.playerId;
          if(id !== "") {
            const entityId = serverMgr.game.players.filter(player => player.playerID === id)[0].entityID;
            const index = serverMgr.game.players.findIndex(player => player.playerID === id);
            serverMgr.game.players.splice(index, 1);
            this.wss.clients.forEach(client => {
              client.send(
                JSON.stringify(
                  KillEntitiesMessage.parse({
                    entities: [entityId]
                  })
                )
              )
            });
          }*/
          const index = serverMgr.game.players.findIndex(
            (player) => player.socket_id === client.data!.socket_id,
          );
          if (index === -1) return;
          serverMgr.game.players[index].leave_game(client);
          // return client.terminate();
        }

        client.data!.isAlive = false;
        client.ping();
      });
    }, 5000);

    this.wss.on("close", () => {
      clearInterval(ping_interval);
    });
  }

  public registerHandler<T>(handler: WsMessageHandler<T>) {
    this.handlers.push(handler);
  }

  public generateSocketId(): string {
    return generateUserID();
  }
}
