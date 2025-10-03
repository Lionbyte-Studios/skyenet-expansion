import type { MouseInfo } from "../ClientManager";

export function isInArea(
  area: { x: number; y: number; width: number; height: number },
  pos: { x: number; y: number },
): boolean {
  return (
    pos.x >= area.x &&
    pos.x <= area.x + area.width &&
    pos.y >= area.y &&
    pos.y <= area.y + area.height
  );
}

export function nullMouseInfo(): MouseInfo {
  return { real: { x: 0, y: 0 }, canvas: { x: 0, y: 0 }, base: { x: 0, y: 0 } };
}

export async function fetchBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  return response.blob();
}
