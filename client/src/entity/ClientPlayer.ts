import { FlamesBits, Player } from "../../../core/src/entity/Player";
import type { PacketBuffer } from "../../../core/src/net/PacketBuffer";
import { ShipEngineSprite, ShipSprite } from "../../../core/src/types";
import { toStringEnum } from "../../../core/src/util/Util";

export class ClientPlayer extends Player {
  flamesState: {
    x: number;
    y: number;
    z?: number;
    velX?: number;
    velY?: number;
    size?: number;
    rotation?: number;
  }[] = [];

  public static override netRead(buf: PacketBuffer): ClientPlayer {
    return new ClientPlayer(
      buf.readString(),
      buf.readString(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readFloat(),
      toStringEnum(ShipSprite, buf.readString()) ?? ShipSprite.White,
      toStringEnum(ShipEngineSprite, buf.readString()) ??
        ShipEngineSprite.White,
    );
  }

  public tickFlames(): void {
    for (let i = 0; i < this.flamesState.length; i++) {
      this.flamesState[i].x += this.flamesState[i].velX!;
      this.flamesState[i].y += this.flamesState[i].velY!;
      this.flamesState[i].velY! *= 0.99; // Reduced friction to keep player moving longer
      this.flamesState[i].velX! *= 0.99; // Reduced friction to keep player moving longer
      this.flamesState[i].size! -= this.flamesState[i].z!;
      if (this.flamesState[i].size! <= 0) {
        this.flamesState.splice(i, 1);
        i--;
      }
    }
  }

  private hasFlameBit(flameBit: FlamesBits): boolean {
    return (this.flames & flameBit) === flameBit;
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
    this.flamesState.push({
      x: this.x + x,
      y: this.y + y,
      z: Math.random() / 4 + 0.3,
      velX: this.velX + vertical * speed + (Math.random() - 0.5) * 2,
      velY: this.velY + horizontal * speed + (Math.random() - 0.5) * 2,
      size: 10,
      rotation: this.rotation,
    });
  }

  protected flamesToFlamesState(): void {
    const horizontal = Math.cos((this.rotation * Math.PI) / 180) / 3;
    const vertical = Math.sin((this.rotation * Math.PI) / 180) / 3;
    if (this.hasFlameBit(FlamesBits.Forward)) {
      for (let i = 0; i < 10; i++) {
        this.makeFlame(horizontal, vertical, 0, 110, 1);
      }
    }
    if (this.hasFlameBit(FlamesBits.Backward)) {
      for (let i = 0; i < 2; i++) {
        this.makeFlame(horizontal, vertical, 70, 20, -3);
      }
      for (let i = 0; i < 2; i++) {
        this.makeFlame(horizontal, vertical, -70, 20, -3);
      }
    }
    if (this.hasFlameBit(FlamesBits.RotateCounterClockwise)) {
      for (let i = 0; i < 2; i++) {
        this.makeFlame(horizontal, vertical, 70, 30, 5);
      }
      for (let i = 0; i < 2; i++) {
        this.makeFlame(horizontal, vertical, -70, 20, -5);
      }
    }
    if (this.hasFlameBit(FlamesBits.RotateClockwise)) {
      for (let i = 0; i < 2; i++) {
        this.makeFlame(horizontal, vertical, 70, 20, -5);
      }
      for (let i = 0; i < 2; i++) {
        this.makeFlame(horizontal, vertical, -70, 30, 5);
      }
    }
  }

  public onMovementReceived(): void {
    this.flamesToFlamesState();
  }
}
