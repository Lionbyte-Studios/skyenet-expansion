import type { ClientGame } from "../ClientGame";

export interface RenderInfo {
  ctx: CanvasRenderingContext2D;
  game: ClientGame;
}

export interface RenderableEntity {
  render: (info: RenderInfo) => void;
}
