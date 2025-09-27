import { Asteroid } from "../../../core/src/entity/Asteroid";
import type { ClientGame } from "../ClientGame";
import type { RenderableEntity } from "./RenderableEntity";

export class ClientAsteroid extends Asteroid implements RenderableEntity {
  public render(ctx: CanvasRenderingContext2D, game: ClientGame) {}
}
