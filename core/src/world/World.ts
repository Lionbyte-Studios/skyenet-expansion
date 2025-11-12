import { Entity } from "../entity/Entity";
import { Player } from "../entity/Player";
import { Constructor, EntityID } from "../types";
import { Chunk, ChunkPosition } from "./Chunk";

export class World {
  public chunks: Map<ChunkPosition, Chunk> = new Map();

  constructor(public readonly world_id: string) {}

  /**
   * Find all players in all chunks
   * @param playerClass If provided, will use this class to compare with `instanceof`. Defaults to `Player`
   * @returns All players in all chunks as a list
   */
  public getAllPlayers<PlayerType extends Player = Player>(
    playerClass?: Constructor<PlayerType>,
  ): PlayerType[] {
    const pClass = playerClass === undefined ? Player : playerClass;
    return this.getAllEntities(pClass) as unknown as PlayerType[]; // sorry
  }

  public getAllEntities<EntityType extends Entity = Entity>(
    entityClass?: Constructor<EntityType>,
  ): EntityType[] {
    const eClass = entityClass === undefined ? Entity : entityClass;
    const entities: EntityType[] = [];
    this.chunks.forEach((chunk) => {
      entities.push(
        ...(chunk.entities.filter(
          (e) => e instanceof eClass,
        ) as unknown as EntityType[]),
      );
    });
    return entities;
  }

  /**
   * @returns False if the entity with the specified entityID was not found. True if the entity was found and killed.
   */
  public killEntity(entityID: EntityID): boolean {
    for (const chunk of this.chunks.values()) {
      for (const [index, entity] of chunk.entities.entries()) {
        if (entity.entityID === entityID) {
          chunk.entities.splice(index, 1);
          return true;
        }
      }
    }
    return false;
  }

  public chunkExists(chunkCoords: ChunkPosition): boolean {
    return this.chunks.has(chunkCoords);
  }

  public createChunk(chunkCoords: ChunkPosition, chunk: Chunk) {
    this.chunks.set(chunkCoords, chunk);
  }
}
