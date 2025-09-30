import { Asteroid } from "../../../core/src/entity/Asteroid";
import type { RenderInfo } from "../ClientManager";
import type { RenderableEntity } from "./RenderableEntity";

export class ClientAsteroid extends Asteroid implements RenderableEntity {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public render(_info: RenderInfo) {}
}
