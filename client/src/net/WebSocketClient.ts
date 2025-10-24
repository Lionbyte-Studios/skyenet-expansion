import { ClientConnection } from "./ClientConnection";
import { PacketRegistry } from "../../../core/src/net/PacketRegistry";
import { ClientPlayListener } from "../../../core/src/net/listener/ClientPlayListener";
import { DebugS2CPacket } from "../../../core/src/net/packets/DebugS2CPacket";
import { JoinCallbackS2CPacket } from "../../../core/src/net/packets/JoinCallbackS2CPacket";
import { JoinGameS2CPacket } from "../../../core/src/net/packets/JoinGameS2CPacket";
import { PlayerMoveS2CPacket } from "../../../core/src/net/packets/PlayerMoveS2CPacket";

export interface SocketMessageData<T> {
  client: WebSocketClient;
  socket: WebSocket;
  message: T;
}

export class WebSocketClient {
  // public joinCallbackData: Promise<JoinCallbackData>;
  // private joinCallbackDataResolve: (data: JoinCallbackData) => void;
  // private readonly socket;
  // private handlers: WsMessageHandler<unknown>[];
  // private queue: [WsMessageHandler<unknown>, message: unknown][];
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
    /*
    this.socket = new WebSocket(addr);
    this.socket.onmessage = (event) => {
      this.onMessage(event);
    };
    this.socket.onclose = (event) => {
      window.location.reload();
    };
    this.socket.onerror = console.error;
    this.queue = [];

    this.handlers = [
      new WsPlayerJoinCallbackMessageHandler(),
      new WsMovementMessageHandler(),
      new WsStatusMessageHandler(),
      new WsUpdatePlayersMessageHandler(),
      new WsSpawnEntitiesMessageHandler(),
      new WsModifyEntitiesMessageHandler(),
      new WsKillEntitiesMessageHandler(),
      new WsChatMessageHandler(),
    ];

    this.joinCallbackDataResolve = () => {
      throw new Error(
        "WebSocketClient#joinCallbackDataResolve has not been assigned",
      );
    };
    this.joinCallbackData = new Promise((resolve) =>
      ((resolve) => {
        this.resolveJoinCallbackData = resolve;
      })(resolve),
    );
  }

  public onMessage(event: MessageEvent) {
    let json;
    try {
      json = JSON.parse(event.data);
    } catch (error) {
      console.error(error);
      return;
    }
    if (typeof json.type === "undefined" || json.type === undefined) {
      console.warn(`No 'type' found in JSON received from server: ${json}`);
      return;
    } else if (typeof json.type !== "number") {
      console.warn(
        `Type of 'type' in JSON received from server is not of type 'number': ${json}`,
      );
      return;
    }

    if (
      typeof clientManager.game === "undefined" ||
      clientManager.game === undefined
    ) {
      if (json.type !== WebSocketMessageType.PlayerJoinCallback) {
        this.handlers
          .filter((handler) => handler.handledType === json.type)
          .forEach((handler) => {
            this.queue.push([handler, json]);
          });
        return;
      }
    } else {
      // UpdatePlayers messages first
      this.queue.sort((a, b) => {
        if (
          a[0].handledType === WebSocketMessageType.UpdatePlayers &&
          b[0].handledType !== WebSocketMessageType.UpdatePlayers
        )
          return 1;
        if (
          a[0].handledType === WebSocketMessageType.UpdatePlayers &&
          b[0].handledType === WebSocketMessageType.UpdatePlayers
        )
          return 0;
        if (
          a[0].handledType !== WebSocketMessageType.UpdatePlayers &&
          b[0].handledType === WebSocketMessageType.UpdatePlayers
        )
          return -1;
        return 0;
      });
      while (this.queue.length > 0) {
        const queuedHandler = this.queue.shift();
        if (queuedHandler === undefined) break;
        queuedHandler[0].handleMessage({
          socket: this.socket,
          message: queuedHandler[1],
          client: this,
        });
      }
    }

    this.handlers
      .filter((handler) => handler.handledType === json.type)
      .forEach((handler) => {
        handler.handleMessage({
          socket: this.socket,
          message: json,
          client: this,
        });
      });*/
  }
  /*
  public resolveJoinCallbackData(data: JoinCallbackData) {
    this.joinCallbackDataResolve(data);
  }

  public joinGame(
    selectedShip: ShipSprite,
    selectedShipEngine: ShipEngineSprite,
  ) {
    this.socket.send(
      JSON.stringify(
        PlayerJoinMessage.parse({
          shipSprite: selectedShip,
          shipEngineSprite: selectedShipEngine,
          discord_auth: clientManager.clientStorage.get("token"),
        }),
      ),
    );
  }

  public sendBullet(msg: Omit<BulletShootMessage, "type">) {
    this.socket.send(JSON.stringify(schemas.BulletShootMessage.parse(msg)));
  }

  public sendMovement(msg: Omit<MovementMessage, "type">) {
    this.socket.send(JSON.stringify(schemas.MovementMessage.parse(msg)));
  }

  public sendCommand(msg: Omit<CommandMessage, "type">) {
    this.socket.send(JSON.stringify(schemas.CommandMessage.parse(msg)));
  }
    */
}
