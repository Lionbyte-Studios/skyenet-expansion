import { Bullet } from "../../../core/src/entity/Bullet";
import { serverMgr } from "../Main";
import { ServerAsteroid } from "./ServerAsteroid";

export class ServerBullet extends Bullet {
  public override tick(): void {
    super.tick();

    for (const asteroid of serverMgr.game.entities.filter(
      (entity) => entity instanceof ServerAsteroid,
    )) {
      if (!asteroid.isInHitbox(this.x, this.y)) continue;
      asteroid.damage(1);
      serverMgr.game.killEntity((entity) => entity.entityID === this.entityID);
      return;
    }
  }
}
