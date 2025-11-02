import { WebSocket, WebSocketServer } from "ws";
import { PacketRegistry } from "../../../core/src/net/PacketRegistry";
import { ServerPlayListener } from "../../../core/src/net/listener/ServerPlayListener";
import { ServerConnection } from "./ServerConnection";
import { Packet } from "../../../core/src/net/Packet";
import { PlayListener } from "../../../core/src/net/listener/PlayListener";
import { PacketBuffer } from "../../../core/src/net/PacketBuffer";
import { genStringID } from "../../../core/src/util/Util";
import { serverMgr } from "../Main";

export interface SocketMessageData<T> {
  socket: WebSocketClientWithData;
  socketData: WebSocketClientData;
  message: T;
}

export type WebSocketClientData = {
  socket_id: string;
};

export type WebSocketClientWithData = WebSocket & {
  data: WebSocketClientData;
};

export class WebSocketServerManager {
  public wss: WebSocketServer;
  public registry: PacketRegistry<ServerPlayListener>;
  private pingInterval;

  constructor() {
    this.registry = new PacketRegistry<ServerPlayListener>();
    this.wss = new WebSocketServer({ port: 8081 });

    this.pingInterval = setInterval(() => {
      this.wss.clients.forEach((client) => client.ping());
      serverMgr.game.players.forEach((player) => {
        if (player.lastPonged + 7000 < Date.now()) {
          player.leave_game();
        }
      });
    }, 3000);

    this.wss.on("connection", (ws) => {
      (ws as WebSocketClientWithData).data = {
        socket_id: this.generateSocketID(),
      };
      const connection = new ServerConnection(
        ws as WebSocketClientWithData,
        this.registry,
      );

      ws.on("pong", () => {
        connection.pong();
      });
    });
  }

  public broadcastPacket<T extends Packet<PlayListener>>(
    packet: T,
    exclude?: string[],
  ) {
    const buf = new PacketBuffer();
    buf.writeInt((packet.constructor as unknown as { id: number }).id);
    packet.write(buf);
    this.wss.clients.forEach((client) => {
      if (
        exclude !== undefined &&
        exclude.includes((client as WebSocketClientWithData).data.socket_id)
      )
        return;
      client.send(buf.buffer.slice(0, buf.offset));
    });
  }

  private generateSocketID(): string {
    return genStringID(64);
  }
}
