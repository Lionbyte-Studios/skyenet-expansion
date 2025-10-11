import { Entity } from "../../core/src/entity/Entity";
import { Game } from "../../core/src/Game";
import { GameLoopManager } from "../../core/src/GameLoopManager";
import * as schemas from "../../core/src/Schemas";
import {
  EntityID,
  GameID,
  GameMode,
  ModifyEntitiesMessage,
  MovementMessage,
  StatusMessage,
  WebSocketMessageType,
} from "../../core/src/types";
import {
  genStringID,
  IndexSignature,
  OmitFunctions,
  randomNumberInRange,
} from "../../core/src/util/Util";
import { ServerAsteroid } from "./entity/ServerAsteroid";
import { ServerPlayer } from "./entity/ServerPlayer";
import { serverMgr } from "./Main";

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
    this.randomTasks();
  }

  private randomTasks() {
    if (randomNumberInRange(0, 300) === 0) {
      const xy = [
        randomNumberInRange(-1000, 1000),
        randomNumberInRange(-1000, 1000),
      ];
      this.spawnEntity(
        new ServerAsteroid(
          xy[0],
          xy[1],
          randomNumberInRange(0, 360),
          randomNumberInRange(1, 10),
          randomNumberInRange(-3, 3),
        ),
      );
      console.log(`Spawning new asteroid at ${xy[0]} ${xy[1]}`);
    }
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
    const modified: ModifyEntitiesMessage = {
      type: WebSocketMessageType.ModifyEntities,
      modifications: [],
    };
    this.entities.forEach((entity, index) => {
      if (!entityPredicate(entity, index)) return;
      modified.modifications.push({
        entityID: entity.entityID,
        type: entity.entityType,
        modified_data: data,
      });
      for (const key in data) {
        this.entities[index][key] = data[key];
      }
    });
    serverMgr.wsMgr.wss.clients.forEach((client) => {
      client.send(
        JSON.stringify(schemas.ModifyEntitiesMessage.parse(modified)),
      );
    });
  }

  public spawnEntity(entity: Entity) {
    this.entities.push(entity);

    serverMgr.wsMgr.wss.clients.forEach((client) => {
      client.send(
        JSON.stringify(
          schemas.SpawnEntitiesMessage.parse({
            entities: [
              {
                type: entity.entityType,
                data: entity,
              },
            ],
          }),
        ),
      );
    });
  }

  public killEntity(
    entityPredicate: (entity: Entity, index: number) => boolean,
  ) {
    const entitiesKilled: EntityID[] = [];
    this.entities.forEach((entity, index) => {
      if (!entityPredicate(entity, index)) return;
      entitiesKilled.push(entity.entityID);
      this.entities.splice(index, 1);
    });

    console.log(`Killing entities: ${JSON.stringify(entitiesKilled)}`);

    serverMgr.wsMgr.wss.clients.forEach((client) => {
      client.send(
        JSON.stringify(
          schemas.KillEntitiesMessage.parse({
            entities: entitiesKilled,
          }),
        ),
      );
    });
  }
}
