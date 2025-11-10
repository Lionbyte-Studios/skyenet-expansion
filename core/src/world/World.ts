import { Entity } from "../entity/Entity";
import { Player } from "../entity/Player";
import { Chunk } from "./Chunk";

export class World<E extends Entity, P extends Player> {
  public chunks: Chunk<E>[] = [];
  public players: P[] = [];

  constructor(public readonly world_id: string) {}
}
