import { BulletType } from "../../../core/src/entity/Bullet";
import type { Game } from "../../../core/src/Game";
import {
  type ShipEngineSprite,
  type ShipSprite,
} from "../../../core/src/types";
import { ClientGame } from "../ClientGame";
import { webSocketManager } from "../Main";
import { ClientPlayer } from "./ClientPlayer";

export class MyPlayer extends ClientPlayer {
  cameraDist: number = 0; // make this modifyable by player in settings
  public override tick<T extends Game>(game?: T) {
    if (game === undefined) return;
    if (!(game instanceof ClientGame)) return;

    this.velocityChange(game);
    this.move(game);
    this.sendMovement();
  }
  private makeFlame(
    horizontal: number,
    vertical: number,
    XOffset: number = 0,
    YOffset: number = 0,
    speed: number = 1,
  ) {
    const x = horizontal * XOffset + vertical * YOffset;
    const y = -vertical * XOffset + horizontal * YOffset;
    this.flames[this.flames.length] = {
      x: this.x + x,
      y: this.y + y,
      z: Math.random() / 4 + 0.3,
      velX: this.velX + vertical * speed + (Math.random() - 0.5) * 2,
      velY: this.velY + horizontal * speed + (Math.random() - 0.5) * 2,
      size: 10,
      rotation: this.rotation,
    };
  }
  private velocityChange(game: ClientGame) {
    // Reset engine state each frame
    this.engineActive = false;

    const horizontal = Math.cos((this.rotation * Math.PI) / 180) / 3;
    const vertical = Math.sin((this.rotation * Math.PI) / 180) / 3;
    if (game.keyManager.isKeyPressed("KeyW")) {
      // this.engineActive = true; // Set engine active when W is pressed
      for (let i = 0; i < 10; i++) {
        this.makeFlame(horizontal, vertical, 0, 110, 1);
      }
      this.velY -= horizontal;
      this.velX -= vertical;
    }
    if (game.keyManager.isKeyPressed("KeyS")) {
      // S key reduces velocity until it reaches 0
      // const decelerationRate = 0.09; // Adjust this value to control how fast it slows down

      // // Reduce velocity towards 0
      // if (Math.abs(this.velX) > decelerationRate) {
      //   this.velX -= Math.sign(this.velX) * decelerationRate;
      // } else {
      //   this.velX = 0;
      // }

      // if (Math.abs(this.velY) > decelerationRate) {
      //   this.velY -= Math.sign(this.velY) * decelerationRate;
      // } else {
      //   this.velY = 0;
      // }

      // if (Math.abs(this.velR) > decelerationRate) {
      //   this.velR -= Math.sign(this.velR) * decelerationRate;
      // } else {
      //   this.velR = 0;
      // }

      for (let i = 0; i < 2; i++) {
        this.makeFlame(horizontal, vertical, 70, 20, -3);
      }
      for (let i = 0; i < 2; i++) {
        this.makeFlame(horizontal, vertical, -70, 20, -3);
      }
      this.velY += horizontal / 2;
      this.velX += vertical / 2;
    }
    if (game.keyManager.isKeyPressed("KeyA")) {
      this.velR += 0.1;
      // if(this.cameraDist>-10){
      //   this.cameraDist=((this.cameraDist*99)-10)/100
      // }
      for (let i = 0; i < 2; i++) {
        this.makeFlame(horizontal, vertical, 70, 30, 5);
      }
      for (let i = 0; i < 2; i++) {
        this.makeFlame(horizontal, vertical, -70, 20, -5);
      }
    }
    if (game.keyManager.isKeyPressed("KeyD")) {
      this.velR -= 0.1;
      for (let i = 0; i < 2; i++) {
        this.makeFlame(horizontal, vertical, 70, 20, -5);
      }
      for (let i = 0; i < 2; i++) {
        this.makeFlame(horizontal, vertical, -70, 30, 5);
      }
      // if(this.cameraDist>-10){
      //   this.cameraDist=((this.cameraDist*99)-10)/100
      // }
    }
    if (game.keyManager.wasKeyJustPressed("KeyO")) {
      this.HP++;
    }
    if (game.keyManager.wasKeyJustPressed("KeyL")) {
      this.HP--;
    }
    if (game.keyManager.wasKeyJustPressed("Space")) {
      /*this.Bullets.push({
        x: this.x,
        y: this.y,
        velX: this.velX - vertical * 10,
        velY: this.velY - horizontal * 10,
      });*/
      webSocketManager.sendBullet({
        bullet: {
          type: BulletType.Starter,
          x: this.x,
          y: this.y,
          velX: this.velX - vertical * 10,
          velY: this.velY - horizontal * 10,
        },
        playerID: this.playerID,
      });
    }
    // if(this.cameraDist<1){
    //   this.cameraDist=((this.cameraDist*49)+1)/50
    // }
  }

  public sendMovement() {
    webSocketManager.sendMovement({
      playerID: this.playerID,
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      engineActive: this.engineActive,
      flames: this.flames,
      velX: this.velX,
      velY: this.velY,
      velR: this.velR,
    });
  }

  public setShipType(shipSprite: ShipSprite, engineSprite: ShipEngineSprite) {
    this.shipSprite = shipSprite;
    this.shipEngineSprite = engineSprite;
  }
}
