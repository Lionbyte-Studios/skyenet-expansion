import { ClientConnection } from "./ClientConnection";
import { PacketRegistry } from "../../../core/src/net/PacketRegistry";
import { ClientPlayListener } from "../../../core/src/net/listener/ClientPlayListener";

export interface SocketMessageData<T> {
  client: WebSocketClient;
  socket: WebSocket;
  message: T;
}

export class WebSocketClient {
  public connection: ClientConnection;
  private ws: WebSocket;
  private registry: PacketRegistry<ClientPlayListener>;

  constructor(addr: string) {
    this.ws = new WebSocket(addr);
    this.ws.binaryType = "arraybuffer";
    this.registry = new PacketRegistry<ClientPlayListener>();

    this.connection = new ClientConnection(this.ws, this.registry);
    this.connection.listener._registerPackets(this.registry);

    this.ws.addEventListener("open", () => {
      console.log("Connected to websocket server!");
    });
  }
}
