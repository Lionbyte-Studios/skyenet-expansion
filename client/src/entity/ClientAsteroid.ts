import { Asteroid } from "../../../core/src/entity/Asteroid";
import type { RenderableEntity, RenderInfo } from "./RenderableEntity";

export class ClientAsteroid extends Asteroid implements RenderableEntity {
  public render(info: RenderInfo) {}
}
