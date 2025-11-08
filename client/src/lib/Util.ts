import type { MouseInfo } from "../ClientManager";

export function isInCircleArea(
  circle: { center: { x: number; y: number }; radiusSquared: number },
  pos: { x: number; y: number },
): boolean {
  return (
    Math.pow(Math.abs(circle.center.x - pos.x), 2) +
      Math.pow(Math.abs(circle.center.y - pos.y), 2) <=
    circle.radiusSquared
  );
}

export function nullMouseInfo(): MouseInfo {
  return { real: { x: 0, y: 0 }, canvas: { x: 0, y: 0 }, base: { x: 0, y: 0 } };
}

export async function fetchBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  return response.blob();
}

// export type OmitRequired<T> = {
//   [K in keyof T as {} extends Pick<T, K> ? K : never]: T[K];
// };

export type DeepRequired<T> = {
  [K in keyof T]-?: T[K] extends object
    ? // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      T[K] extends Function
      ? T[K]
      : DeepRequired<T[K]>
    : T[K];
};

/**
 * @param maxDist Number of pixels out of the canvas that should still be counted as "inside" the canvas.
 */
export function areCoordinatesInCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  maxDist: number = 0,
): boolean {
  const transform = ctx.getTransform();

  const tx = transform.a * x + transform.c * y + transform.e;
  const ty = transform.b * x + transform.d * y + transform.f;

  return (
    tx >= 0 - maxDist &&
    tx < ctx.canvas.width + maxDist &&
    ty >= 0 - maxDist &&
    ty < ctx.canvas.height + maxDist
  );
}
