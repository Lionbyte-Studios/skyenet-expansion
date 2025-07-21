import type { Entity } from "../../../core/src/entity/Entity";
import { PlayerJoinMessage } from "../../../core/src/Schemas";
import type {
  BulletMessage,
  EntityID,
  GameID,
  MovementMessage,
  PlayerID,
  ShipEngineSprite,
  ShipSprite,
} from "../../../core/src/types";
import type { ClientPlayer } from "../entity/ClientPlayer";
import { WsBulletMessageHandler } from "./handler/BulletHandler";
import type { WsMessageHandler } from "./handler/Handler";
import { WsPlayerJoinCallbackMessageHandler } from "./handler/JoinCallbackHandler";
import { WsMovementMessageHandler } from "./handler/MovementHandler";
import { WsStatusMessageHandler } from "./handler/StatusHandler";
import { WsUpdatePlayersMessageHandler } from "./handler/UpdatePlayersHandler";
import * as schemas from "../../../core/src/Schemas";

export interface SocketMessageData<T> {
  client: WebSocketClient;
  socket: WebSocket;
  message: T;
}

export type JoinCallbackData = {
  gameID: GameID;
  playerID: PlayerID;
  entityID: EntityID;
  players: ClientPlayer[];
  entities: Entity[];
};

export class WebSocketClient {
  public joinCallbackData: Promise<JoinCallbackData>;
  private joinCallbackDataResolve: (data: JoinCallbackData) => void;
  public readonly socket;
  private handlers: WsMessageHandler<unknown>[];

  constructor(addr: string) {
    this.socket = new WebSocket(addr);
    this.socket.onmessage = (event) => this.onMessage(event);
    this.socket.onerror = console.error;

    this.handlers = [
      new WsBulletMessageHandler(),
      new WsPlayerJoinCallbackMessageHandler(),
      new WsMovementMessageHandler(),
      new WsStatusMessageHandler(),
      new WsUpdatePlayersMessageHandler(),
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
    this.handlers
      .filter((handler) => handler.handledType === json.type)
      .forEach((handler) => {
        handler.handleMessage({
          socket: this.socket,
          message: json,
          client: this,
        });
      });
  }

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
        }),
      ),
    );
  }

  public sendBullet(msg: Omit<BulletMessage, "type">) {
    this.socket.send(JSON.stringify(schemas.BulletMessage.parse(msg)));
  }

  public sendMovement(msg: Omit<MovementMessage, "type">) {
    this.socket.send(JSON.stringify(schemas.MovementMessage.parse(msg)));
  }
}
