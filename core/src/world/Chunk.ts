import { Entity } from "../entity/Entity";

export interface ChunkPosition {
  chunk_x: string;
  chunk_y: string;
}

export class Chunk<E extends Entity> {
  public entities: E[] = [];

  constructor(public readonly pos: ChunkPosition) {}
}
