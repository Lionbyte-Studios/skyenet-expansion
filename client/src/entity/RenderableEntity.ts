import type { RenderInfo } from "../ClientManager";

export interface RenderableEntity {
  render: (info: RenderInfo) => void;
  onKill?: (info: RenderInfo) => void;
}
