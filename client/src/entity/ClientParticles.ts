import type { RenderableEntity } from "./RenderableEntity";
import { Particles, ParticleType } from "../../../core/src/entity/Particles";
import type { RenderInfo } from "../ClientManager";
import type { PacketBuffer } from "../../../core/src/net/PacketBuffer";
import type { EntityID } from "../../../core/src/types";
import type { Game } from "../../../core/src/Game";
import { clientManager } from "../Main";

export interface Particle {
  offsetX: number;
  offsetY: number;
  velX: number;
  velY: number;
  velR: number;
  rotation: number;
  opacity: number;
  lifetime: number;
  size: number;
}

export class ClientParticles extends Particles implements RenderableEntity {
  private particles: Particle[] = [];

  constructor(
    x: number,
    y: number,
    color: [number, number, number],
    particleType: ParticleType,
    amount: number,
    delta: number,
    randomNess: number,
    entityID?: EntityID,
  ) {
    super(x, y, color, particleType, amount, delta, randomNess, entityID);
    this.generateParticles();
  }

  render(info: RenderInfo) {
    info.ctx.save();
    this.particles.forEach((particle) => {
      info.ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${particle.opacity})`;
      info.ctx.translate(particle.offsetX + this.x, particle.offsetY + this.y);
      info.ctx.rotate(2 * Math.PI * (particle.rotation / 360));
      const x = this.x;
      const y = this.y;
      info.ctx.fillRect(x, y, x + particle.size, y + particle.size);
      info.ctx.rotate(-(2 * Math.PI * (particle.rotation / 360)));
      info.ctx.translate(
        -(particle.offsetX + this.x),
        -(particle.offsetY + this.y),
      );
    });
    info.ctx.restore();
  }

  public static override netRead(buf: PacketBuffer): ClientParticles {
    return new ClientParticles(
      buf.readFloat(),
      buf.readFloat(),
      [buf.readFloat(), buf.readFloat(), buf.readFloat()],
      buf.readInt(),
      buf.readInt(),
      buf.readFloat(),
      buf.readFloat(),
      buf.readString(),
    );
  }

  private generateParticles() {
    for (let i = 0; i < this.amount; i++) {
      this.particles.push({
        offsetX: 0,
        offsetY: 0,
        velX: (Math.random() - 0.5) * this.delta,
        velY: (Math.random() - 0.5) * this.delta,
        velR: (Math.random() - 0.5) * 5,
        rotation: Math.random() * 360,
        opacity: 1,
        lifetime: Math.random() * this.delta * clientManager.game.config.tps,
        size: 3,
      });
    }
  }

  private tickParticles() {
    this.particles.forEach((particle, index) => {
      if (particle.lifetime <= 0 || particle.opacity <= 0) {
        this.particles.splice(index, 1);
        return;
      }
      if (
        particle.lifetime <
        this.delta * clientManager.game.config.tps * 0.1
      ) {
        particle.opacity -= 0.05;
        particle.size *= 0.99;
      }
      particle.offsetX += particle.velX;
      particle.offsetY += particle.velY;
      particle.rotation += particle.velR;
      particle.lifetime--;
    });
  }

  public override tick<T extends Game>(game?: T | undefined): void {
    this.tickParticles();
  }
}
