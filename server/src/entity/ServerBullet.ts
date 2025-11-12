import { Bullet } from "../../../core/src/entity/Bullet";
import { serverMgr } from "../Main";
import { ServerAsteroid } from "./ServerAsteroid";

export class ServerBullet extends Bullet {
  public override tick(): void {
    serverMgr.game.modifyEntityData(
      (entity) => entity.entityID === this.entityID,
      {
        x: parseFloat((this.x + this.velX).toFixed(4)),
        y: parseFloat((this.y + this.velY).toFixed(4)),
      },
    );

    for (const asteroid of serverMgr.game.findEntities(
      (entity) => entity instanceof ServerAsteroid,
    ) as ServerAsteroid[]) {
      if (!asteroid.isInHitbox(this.x, this.y)) continue;
      asteroid.damage(1);
      serverMgr.game.killEntity((entity) => entity.entityID === this.entityID);
      return;
    }
  }
}
