import { Entity } from "../../core/src/entity/Entity";
import { Game } from "../../core/src/Game";
import { GameLoopManager } from "../../core/src/GameLoopManager";
import {
  GameID,
  GameMode,
  MovementMessage,
  StatusMessage,
} from "../../core/src/types";
import {
  genStringID,
  goBackChar,
  IndexSignature,
  OmitFunctions,
} from "../../core/src/util/Util";
import { ServerPlayer } from "./entity/ServerPlayer";

export interface ServerGameStats {
  tps: number;
  ticksThisSecond: number;
  lastTickSecondTimestamp: number;
}

export class ServerGame extends Game {
  public override players: ServerPlayer[];
  private gameLoopManager: GameLoopManager;
  public stats: ServerGameStats;

  constructor(gameID: GameID, gameMode: GameMode) {
    super(gameID, gameMode);
    this.gameLoopManager = new GameLoopManager(
      () => this.tick(),
      this.config.tps,
    );
    this.stats = {
      tps: 0,
      lastTickSecondTimestamp: Date.now(),
      ticksThisSecond: 0,
    };
    this.players = [];
    setInterval(() => this.logStats(), 1000);
  }

  private logStats() {
    console.log(`TPS: ${this.stats.tps}${goBackChar}`);
  }

  public handleMovementMessage(message: MovementMessage) {
    console.log(message);
  }
  public handleStatusMessage(message: StatusMessage) {
    console.log(message);
  }
  public static generateRandomPlayerID() {
    return genStringID(8);
  }
  public generatePlayer(socket_id: string): ServerPlayer {
    const id = ServerGame.generateRandomPlayerID();
    const entityID = genStringID(8);
    return new ServerPlayer(
      id,
      entityID,
      this.config.defaultSpawnCoords.x,
      this.config.defaultSpawnCoords.y,
      0,
      this.config.defaultShipSprite,
      this.config.defaultShipEngineSprite,
      socket_id,
    );
  }

  public override tick() {
    const lastTickTimestamp = Date.now();
    if (this.stats.lastTickSecondTimestamp + 1000 < lastTickTimestamp) {
      this.stats.lastTickSecondTimestamp = lastTickTimestamp;
      this.stats.tps = this.stats.ticksThisSecond;
      this.stats.ticksThisSecond = 1;
    } else this.stats.ticksThisSecond++;
    this.entities.forEach((entity) => {
      entity.tick();
    });
  }

  public startGameLoop() {
    this.gameLoopManager.start();
  }
  public stopGameLoop() {
    this.gameLoopManager.stop();
  }

  public modifyEntityData<T extends Entity = Entity>(
    entityPredicate: (entity: Entity, index: number) => boolean,
    data: IndexSignature<Partial<OmitFunctions<T>>>,
  ) {
    this.entities.forEach((entity, index, arr) => {
      if (!entityPredicate(entity, index)) return;
      for (const key in data) {
        arr[index][key] = data[key];
      }
    });

    // TODO send websocket data
  }

  public spawnEntity(entity: Entity) {
    this.entities.push(entity);

    // TODO send websocket data
  }

  public killEntity(
    entityPredicate: (entity: Entity, index: number) => boolean,
  ) {
    this.entities.forEach((entity, index, arr) => {
      if (entityPredicate(entity, index)) arr.splice(index, 1);
    });

    // TODO send websocket data
  }
}
