import { Game } from "../Game";
import { PacketBuffer } from "../net/PacketBuffer";
import { EntityID, PlayerID, ShipEngineSprite, ShipSprite } from "../types";
import { Entity, EntityType } from "./Entity";

export enum FlamesBits {
  None = 0b0000,
  Forward = 0b0001,
  Backward = 0b0010,
  RotateClockwise = 0b0100,
  RotateCounterClockwise = 0b1000,
}

export abstract class Player extends Entity {
  entityType: EntityType = EntityType.Player;
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
  // flames: {
  //   x: number;
  //   y: number;
  //   z?: number;
  //   velX?: number;
  //   velY?: number;
  //   size?: number;
  //   rotation?: number;
  // }[] = [];
  flames: FlamesBits = 0;
  static playerClass: typeof Player;

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

  public static override get entityType(): EntityType {
    return EntityType.Player;
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
  }
  public override tick<T extends Game>(game?: T) {
    if (game === undefined) return;
    this.move(game);
  }

  public override netWrite(buf: PacketBuffer): void {
    buf.writeString(this.playerID);
    buf.writeString(this.entityID);
    buf.writeFloat(this.x);
    buf.writeFloat(this.y);
    buf.writeFloat(this.rotation);
    buf.writeString(this.shipSprite);
    buf.writeString(this.shipEngineSprite);
  }
  public static override netRead(buf: PacketBuffer): Player {
    throw new Error("Method was not implemented.");
  }

  public static registerPlayerClass(playerClass: typeof this.playerClass) {
    Player.playerClass = playerClass;
  }
}
