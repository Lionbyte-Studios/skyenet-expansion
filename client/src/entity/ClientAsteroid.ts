import { Asteroid } from "../../../core/src/entity/Asteroid";
import type { RenderInfo } from "../ClientManager";
import type { RenderableEntity } from "./RenderableEntity";

export class ClientAsteroid extends Asteroid implements RenderableEntity {
  public render(info: RenderInfo) {}
}
