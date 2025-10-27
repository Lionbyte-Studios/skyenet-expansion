import { BulletType } from "../../../core/src/entity/Bullet";
import { FlamesBits } from "../../../core/src/entity/Player";
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

    this.flamesToFlamesState();
    this.tickFlames();

    this.velocityChange(game);
    this.move(game);
    this.sendMovement();
  }

  private velocityChange(game: ClientGame) {
    // Reset engine state each frame
    this.engineActive = false;
    this.flames = 0;

    const horizontal = Math.cos((this.rotation * Math.PI) / 180) / 3;
    const vertical = Math.sin((this.rotation * Math.PI) / 180) / 3;
    if (game.keyManager.isKeyPressed("KeyW")) {
      this.velY -= horizontal;
      this.velX -= vertical;
      this.flames = this.flames | FlamesBits.Forward;
    }
    if (game.keyManager.isKeyPressed("KeyS")) {
      this.velY += horizontal / 2;
      this.velX += vertical / 2;
      this.flames = this.flames | FlamesBits.Backward;
    }
    if (game.keyManager.isKeyPressed("KeyA")) {
      this.velR += 0.1;
      this.flames = this.flames | FlamesBits.RotateCounterClockwise;
    }
    if (game.keyManager.isKeyPressed("KeyD")) {
      this.velR -= 0.1;
      this.flames = this.flames | FlamesBits.RotateClockwise;
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
    clientManager.webSocketClient.connection.sendPacket(
      new PlayerMoveC2SPacket(
        this.x,
        this.y,
        this.rotation,
        this.velX,
        this.velY,
        this.velR,
        this.engineActive,
        this.flames,
      ),
    );
  }

  public setShipType(shipSprite: ShipSprite, engineSprite: ShipEngineSprite) {
    this.shipSprite = shipSprite;
    this.shipEngineSprite = engineSprite;
  }
}
