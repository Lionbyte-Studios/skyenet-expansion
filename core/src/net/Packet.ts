import { PlayListener } from "./listener/PlayListener";
import { PacketBuffer } from "./PacketBuffer";

export enum PacketDirection {
  C2S,
  S2C,
}

export enum PacketID {
  PlayerMoveC2S,
  DebugS2C,
  JoinGameC2S,
  JoinCallbackS2C,
}

export abstract class Packet<L extends PlayListener> {
  static get id(): PacketID {
    throw new Error("id must be specified by the packet.");
  }
  static direction: PacketDirection;

  abstract write(buf: PacketBuffer): void;
  abstract apply(listener: L): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static read(buf: PacketBuffer): Packet<any> {
    throw new Error("Not implemented.");
  }
}
