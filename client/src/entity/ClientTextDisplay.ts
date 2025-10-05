import type { RenderableEntity } from "./RenderableEntity";
import { TextDisplay } from "../../../core/src/entity/TextDisplay";
import type { RenderInfo } from "../ClientManager";

export class ClientTextDisplay extends TextDisplay implements RenderableEntity {
  public render(info: RenderInfo) {
    if(info.game === undefined) return;
    info.ctx.translate(info.game.camera.x, info.game.camera.y);
    info.ctx.font = "48px serif";
    info.ctx.textAlign = "center";
    info.ctx.fillText(
      this.text,
      this.x - info.game.camera.x,
      this.y - info.game.camera.y,
    );
    info.ctx.translate(-info.game.camera.x, -info.game.camera.y);
  }
}
