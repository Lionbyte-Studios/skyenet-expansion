import type { ClientGame } from "../ClientGame";

export interface RenderableEntity {
  render: (ctx: CanvasRenderingContext2D, game: ClientGame) => void;
}
