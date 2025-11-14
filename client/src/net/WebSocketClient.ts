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
  // Resolves to true if WebSocket is connected, false if it failed to connect.
  public webSocketConnectionMade: Promise<boolean>;

  constructor(addr: string) {
    this.ws = new WebSocket(addr);
    this.webSocketConnectionMade = new Promise((resolve) => {
      resolve(
        new Promise((resolveInner) => {
          const interval = setInterval(() => {
            switch (this.ws.readyState) {
              case WebSocket.CONNECTING: {
                break;
              }
              case WebSocket.OPEN: {
                clearInterval(interval);
                resolveInner(true);
                break;
              }
              case WebSocket.CLOSING:
              case WebSocket.CLOSED: {
                clearInterval(interval);
                resolveInner(false);
                break;
              }
              default: {
                break;
              }
            }
          }, 50); // check for readyState every 50 ms
        }),
      );
    });
    this.ws.binaryType = "arraybuffer";
    this.registry = new PacketRegistry<ClientPlayListener>();

    this.connection = new ClientConnection(this.ws, this.registry);
    this.connection.listener._registerPackets(this.registry);

    this.ws.addEventListener("open", () => {
      console.log("Connected to websocket server!");
    });
  }
}
