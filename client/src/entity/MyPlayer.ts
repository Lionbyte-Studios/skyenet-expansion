import { BulletType } from "../../../core/src/entity/Bullet";
import type { Game } from "../../../core/src/Game";
import { BulletShootC2SPacket } from "../../../core/src/net/packets/BulletShootC2SPacket";
import { PlayerMoveC2SPacket } from "../../../core/src/net/packets/PlayerMoveC2SPacket";
import {
  type ShipEngineSprite,
  type ShipSprite,
} from "../../../core/src/types";
import { ClientGame } from "../ClientGame";
import { clientManager } from "../Main";
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
    this.flames.push({
      x: this.x + x,
      y: this.y + y,
      z: Math.random() / 4 + 0.3,
      velX: this.velX + vertical * speed + (Math.random() - 0.5) * 2,
      velY: this.velY + horizontal * speed + (Math.random() - 0.5) * 2,
      size: 10,
      rotation: this.rotation,
    });
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
    }
    if (game.keyManager.wasKeyJustPressed("KeyO")) {
      this.HP++;
    }
    if (game.keyManager.wasKeyJustPressed("KeyL")) {
      this.HP--;
    }
    if (game.keyManager.wasKeyJustPressed("Space")) {
      clientManager.webSocketClient.connection.sendPacket(
        new BulletShootC2SPacket(
          this.playerID,
          BulletType.Starter,
          this.x,
          this.y,
          this.velX - vertical * 10,
          this.velY - horizontal * 10,
        ),
      );
    }
  }

  public sendMovement() {
    /*
    clientManager.webSocketClient.sendMovement({
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
    */
    clientManager.webSocketClient.connection.sendPacket(
      new PlayerMoveC2SPacket(
        this.x,
        this.y,
        this.rotation,
        this.velX,
        this.velY,
        this.velR,
        this.engineActive,
      ),
    );
  }

  public setShipType(shipSprite: ShipSprite, engineSprite: ShipEngineSprite) {
    this.shipSprite = shipSprite;
    this.shipEngineSprite = engineSprite;
  }
}
