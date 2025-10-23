import { PlayListener } from "./listener/PlayListener";
import { PacketBuffer } from "./PacketBuffer";

export enum PacketDirection {
  C2S,
  S2C,
}

export enum PacketID {
  PlayerMoveC2SPacket,
  DebugS2CPacket,
}

export abstract class Packet<L extends PlayListener> {
  static id: number;
  static direction: PacketDirection;

  abstract write(buf: PacketBuffer): void;
  abstract apply(listener: L): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static read(buf: PacketBuffer): Packet<any> {
    throw new Error("Not implemented.");
  }
}
