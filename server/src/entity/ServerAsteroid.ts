import { Asteroid } from "../../../core/src/entity/Asteroid";
import { Game } from "../../../core/src/Game";
import { EntityID } from "../../../core/src/types";
import { serverMgr } from "../Main";

export class ServerAsteroid extends Asteroid {
  public velR: number;
  // Time in ticks
  public despawns_in: number;
  constructor(
    x: number,
    y: number,
    rotation: number,
    size: number,
    velR: number,
    entityID?: EntityID,
  ) {
    super(x, y, rotation, size, entityID);
    this.velR = velR;
    this.despawns_in = 1000;
  }

  public override tick<T extends Game>(game?: T | undefined): void {
    super.tick(game);
    if (this.despawns_in <= 0) {
      serverMgr.game.killEntity((entity) => entity.entityID === this.entityID);
      return;
    }
    serverMgr.game.modifyEntityData(
      (entity) => entity.entityID === this.entityID,
      { rotation: this.rotation + this.velR },
    );
    this.despawns_in--;
  }
}
