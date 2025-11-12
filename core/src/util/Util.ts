import { alphabetForID } from "../types";

export function genStringID(length: number) {
  let id = "";
  for (let i = 0; i < length; i++) {
    id += alphabetForID[Math.floor(Math.random() * alphabetForID.length)];
  }
  return id;
}

// \033[F
export const goBackChar = "\x1b[F";

export type OmitFunctions<T> = Omit<
  T,
  { [K in keyof T]: T[K] extends Function ? K : never }[keyof T] // eslint-disable-line @typescript-eslint/no-unsafe-function-type
>;

export type IndexSignature<T, SignatureType = unknown> = T & {
  [key: string]: SignatureType;
};

export function randomNumberInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

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

export function toStringEnum<E extends Record<string, string>>(
  enumType: E,
  value: string,
): E[keyof E] | undefined {
  const values = Object.values(enumType);
  if (!values.includes(value)) return undefined;
  return value as unknown as E[keyof E];
}

export function manhattanDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

export function distanceSq(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
}
