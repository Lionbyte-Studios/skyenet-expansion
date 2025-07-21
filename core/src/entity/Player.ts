import { Game } from "../Game";
import { EntityID, PlayerID, ShipEngineSprite, ShipSprite } from "../types";
import { Entity } from "./Entity";

export class Player extends Entity {
  playerID: PlayerID;
  velX: number = 0;
  velY: number = 0;
  velR: number = 0;
  HP: number = 10;
  MaxHP: number = 10;
  rotation: number;
  engineActive: boolean = false;
  shipSprite: ShipSprite = ShipSprite.Gray;
  shipEngineSprite: ShipEngineSprite = ShipEngineSprite.Gray;
  flames: {
    x: number;
    y: number;
    z?: number;
    velX?: number;
    velY?: number;
    size?: number;
    rotation?: number;
  }[] = [];
  /*Bullets: {
    x: number;
    y: number;
    velX?: number;
    velY?: number;
  }[] = [];*/

  constructor(
    playerID: PlayerID,
    entityID: EntityID,
    x: number,
    y: number,
    rotation: number,
    shipSprite: ShipSprite,
    shipEngineSprite: ShipEngineSprite,
  ) {
    super(x, y, entityID);
    this.playerID = playerID;
    this.rotation = rotation;
    this.shipSprite = shipSprite;
    this.shipEngineSprite = shipEngineSprite;
  }

  protected move<T extends Game>(game: T) {
    this.y += this.velY;
    this.x += this.velX;
    this.rotation += this.velR;
    this.velY *= 0.997; // Reduced friction to keep player moving longer
    this.velX *= 0.997; // Reduced friction to keep player moving longer
    this.velR *= 0.99; // Keep rotation friction the same

    if (Math.abs(this.velX) < game.config.velocityCap.velX) this.velX = 0;
    if (Math.abs(this.velY) < game.config.velocityCap.velY) this.velY = 0;
    if (Math.abs(this.velR) < game.config.velocityCap.velR) this.velR = 0;

    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation <= 0) {
      this.rotation += 360;
    }
    for (let i = 0; i < this.flames.length; i++) {
      this.flames[i].x += this.flames[i].velX!;
      this.flames[i].y += this.flames[i].velY!;
      this.flames[i].velY! *= 0.99; // Reduced friction to keep player moving longer
      this.flames[i].velX! *= 0.99; // Reduced friction to keep player moving longer
      this.flames[i].size! -= this.flames[i].z!;
      if (this.flames[i].size! <= 0) {
        this.flames.splice(i, 1);
        i--;
      }
    }
    /*
    for (let i = 0; i < this.Bullets.length; i++) {
      this.Bullets[i].x += this.Bullets[i].velX!;
      this.Bullets[i].y += this.Bullets[i].velY!;
      // this.flames[i].velY! *= 0.99; // Reduced friction to keep player moving longer
      // this.flames[i].velX! *= 0.99; // Reduced friction to keep player moving longer
      // this.flames[i].size! -= this.flames[i].z!;
      // if (this.flames[i].size! <= 0) {
      //   this.flames.splice(i, 1);
      //   i--;
      // }
    }
    */
  }
  public override tick<T extends Game>(game?: T) {
    if (game === undefined) return;
    this.move(game);
  }
}
