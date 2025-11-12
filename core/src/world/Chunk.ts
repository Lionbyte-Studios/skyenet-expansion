import { Entity } from "../entity/Entity";

export interface ChunkPosition {
  chunk_x: number;
  chunk_y: number;
}

export class Chunk {
  public entities: Entity[] = [];

  constructor(public readonly pos: ChunkPosition) {}
}
