import { Config } from "./config/Config";
import { DefaultConfig } from "./config/DefaultConfig";
import { Entity } from "./entity/Entity";
import { Player } from "./entity/Player";
import { GameID, GameMode } from "./types";
import { IndexSignature, OmitFunctions } from "./util/Util";
import { Chunk, ChunkPosition } from "./world/Chunk";
import { World } from "./world/World";

export abstract class Game {
  // public players: Player[];
  public gameID: GameID;
  public gameMode: GameMode;
  // public entities: Entity[];
  public world: World;
  public config: Config;
  public abstract isServer: boolean;
  public abstract isClient: boolean;

  constructor(gameID: GameID, gameMode: GameMode, world: World) {
    this.gameID = gameID;
    this.gameMode = gameMode;
    this.config = new DefaultConfig();
    this.world = world;
    // this.players = [];
  }

  public spawnEntity(entity: Entity) {
    const chunkCoords = entity.position.toChunkCoords();
    let chunk = this.world.chunks.get(chunkCoords);
    if (chunk === undefined) {
      this.world.createChunk(chunkCoords, new Chunk(chunkCoords));
    }
    chunk = this.world.chunks.get(chunkCoords);
    if (chunk === undefined)
      throw new Error(
        `Failed to create chunk ${chunkCoords.chunk_x} ${chunkCoords.chunk_y}`,
      );
    chunk.entities.push(entity);
  }

  public tick() {}

  public static registerEntities(): void {
    throw new Error("Must be implemented.");
  }

  public modifyEntityData<T extends Entity = Entity>(
    entityPredicate: (entity: Entity, index: number) => boolean,
    data: IndexSignature<Partial<OmitFunctions<T>>>,
  ) {
    const entities = this.findEntities(entityPredicate);
    entities.forEach((entity, index) => {
      if (!entityPredicate(entity, index)) return;
      for (const key in data) {
        entity[key] = data[key];
      }
    });
  }
  /*
  public modifyPlayerData<T extends Player = Player>(
    playerPredicate: (player: Player, index: number) => boolean,
    data: IndexSignature<Partial<OmitFunctions<T>>>,
  ) {
    const players = this.findPlayers(playerPredicate);
    players.forEach((player, index) => {
        if (!playerPredicate(player, index)) return;
        for (const key in data) {
          player[key] = data[key];
        }
      });
  }
*/
  public findEntityChunks(
    entityPredicate: (entity: Entity, index: number) => boolean,
  ): ChunkPosition[] {
    const p: ChunkPosition[] = [];
    this.world.chunks.forEach((chunk, pos) => {
      if (
        chunk.entities.filter((e, index) => entityPredicate(e, index))
          .length !== 0
      )
        p.push(pos);
    });
    return p;
  }

  public findEntities(
    entityPredicate: (entity: Entity, index: number) => boolean,
  ): Entity[] {
    const e: Entity[] = [];
    this.world.chunks.forEach((chunk) => {
      e.push(
        ...chunk.entities.filter((entity, index) =>
          entityPredicate(entity, index),
        ),
      );
    });
    return e;
  }

  public findPlayers(
    playerPredicate: (player: Player, index: number) => boolean,
  ): Player[] {
    const p: Player[] = [];
    this.world.chunks.forEach((chunk) => {
      p.push(
        ...(chunk.entities.filter(
          (entity, index) =>
            entity instanceof Player && playerPredicate(entity, index),
        ) as Player[]),
      );
    });
    return p;
  }

  public spliceEntity(entity: Entity) {
    const chunkPos = entity.position.toChunkCoords();
    const chunk = this.world.chunks.get(chunkPos);
    if (chunk === undefined) return;
    const index = chunk.entities.findIndex(
      (e) => e.entityID === entity.entityID,
    );
    chunk.entities.splice(index, 1);
  }
}
