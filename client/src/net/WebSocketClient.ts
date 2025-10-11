import type { Entity } from "../../../core/src/entity/Entity";
import { PlayerJoinMessage } from "../../../core/src/Schemas";
import {
  WebSocketMessageType,
  type BulletShootMessage,
  type CommandMessage,
  type EntityID,
  type GameID,
  type MovementMessage,
  type PlayerID,
  type ShipEngineSprite,
  type ShipSprite,
} from "../../../core/src/types";
import type { ClientPlayer } from "../entity/ClientPlayer";
import type { WsMessageHandler } from "./handler/Handler";
import { WsPlayerJoinCallbackMessageHandler } from "./handler/JoinCallbackHandler";
import { WsMovementMessageHandler } from "./handler/MovementHandler";
import { WsStatusMessageHandler } from "./handler/StatusHandler";
import { WsUpdatePlayersMessageHandler } from "./handler/UpdatePlayersHandler";
import * as schemas from "../../../core/src/Schemas";
import { WsSpawnEntitiesMessageHandler } from "./handler/SpawnEntitiesHandler";
import { WsModifyEntitiesMessageHandler } from "./handler/ModifyEntitiesHandler";
import { WsKillEntitiesMessageHandler } from "./handler/KillEntitiesHandler";
import { clientManager } from "../Main";

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
  private readonly socket;
  private handlers: WsMessageHandler<unknown>[];
  private queue: [WsMessageHandler<unknown>, message: unknown][];

  constructor(addr: string) {
    this.socket = new WebSocket(addr);
    this.socket.onmessage = (event) => {
      this.onMessage(event);
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
}
