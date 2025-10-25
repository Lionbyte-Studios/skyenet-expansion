import { Entity, EntityType } from "../../core/src/entity/Entity";
import { EntityRegistry } from "../../core/src/entity/EntityRegistry";
import { Game } from "../../core/src/Game";
import { GameLoopManager } from "../../core/src/GameLoopManager";
import { KillEntitiesS2CPacket } from "../../core/src/net/packets/KillEntitiesS2CPacket";
import { ModifyEntitiesS2CPacket } from "../../core/src/net/packets/ModifyEntitiesS2CPacket";
import { SpawnEntityS2CPacket } from "../../core/src/net/packets/SpawnEntityS2CPacket";
import {
  EntityID,
  GameID,
  GameMode,
  MovementMessage,
  ShipEngineSprite,
  ShipSprite,
  StatusMessage,
} from "../../core/src/types";
import {
  genStringID,
  IndexSignature,
  OmitFunctions,
  randomNumberInRange,
} from "../../core/src/util/Util";
import { ServerAsteroid } from "./entity/ServerAsteroid";
import { ServerBullet } from "./entity/ServerBullet";
import { ServerPlayer } from "./entity/ServerPlayer";
import { ServerTextDisplay } from "./entity/ServerTextDisplay";
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
  public generatePlayer(
    shipSprite: ShipSprite,
    shipEngineSprite: ShipEngineSprite,
  ): ServerPlayer {
    const id = ServerGame.generateRandomPlayerID();
    const entityID = genStringID(8);
    return new ServerPlayer(
      id,
      entityID,
      this.config.defaultSpawnCoords.x,
      this.config.defaultSpawnCoords.y,
      0,
      shipSprite,
      shipEngineSprite,
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

  public override modifyEntityData<T extends Entity = Entity>(
    entityPredicate: (entity: Entity, index: number) => boolean,
    data: IndexSignature<Partial<OmitFunctions<T>>>,
  ) {
    const modified: { entityID: string; modifications: object }[] = [];
    this.entities.forEach((entity, index) => {
      if (!entityPredicate(entity, index)) return;
      modified.push({
        entityID: entity.entityID,
        modifications: data,
      });
      for (const key in data) {
        this.entities[index][key] = data[key];
      }
    });
    serverMgr.wsMgr.broadcastPacket(new ModifyEntitiesS2CPacket(modified));
  }

  public spawnEntity(entity: Entity) {
    this.entities.push(entity);
    serverMgr.wsMgr.broadcastPacket(new SpawnEntityS2CPacket(entity));
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
    serverMgr.wsMgr.broadcastPacket(new KillEntitiesS2CPacket(entitiesKilled));
  }

  public static override registerEntities(): void {
    EntityRegistry.register(EntityType.Asteroid, ServerAsteroid);
    EntityRegistry.register(EntityType.Bullet, ServerBullet);
    EntityRegistry.register(EntityType.Player, ServerPlayer);
    EntityRegistry.register(EntityType.TextDisplay, ServerTextDisplay);
  }
}
