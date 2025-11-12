import { ChunkPosition } from "./Chunk";

export class Position {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public toChunkCoords(): ChunkPosition {
    return {
      chunk_x: Math.floor(this.x / 16),
      chunk_y: Math.floor(this.y / 16),
    };
  }
}
