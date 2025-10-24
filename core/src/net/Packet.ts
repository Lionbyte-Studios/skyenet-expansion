import { PlayListener } from "./listener/PlayListener";
import { PacketBuffer } from "./PacketBuffer";

export enum PacketID {
  PlayerMoveC2S,
  PlayerMoveS2C,
  DebugS2C,
  JoinGameC2S,
  JoinGameS2C,
  JoinCallbackS2C,
  BulletShootC2S,
  SpawnEntityS2C,
  KillEntitiesS2C,
  ModifyEntitiesS2C,
}

export abstract class Packet<L extends PlayListener> {
  static get id(): PacketID {
    throw new Error("id must be specified by the packet.");
  }

  abstract write(buf: PacketBuffer): void;
  abstract apply(listener: L): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static read(buf: PacketBuffer): Packet<any> {
    throw new Error("Not implemented.");
  }
}
