import { WebSocket } from "ws";
import { ServerPlayListener } from "../../../core/src/net/listener/ServerPlayListener";
import { PacketRegistry } from "../../../core/src/net/PacketRegistry";
import { ServerPlayNetworkHandler } from "./ServerPlayNetworkHandler";
import { ServerPlayer } from "../entity/ServerPlayer";
import { PlayListener } from "../../../core/src/net/listener/PlayListener";
import { Packet } from "../../../core/src/net/Packet";
import { PacketBuffer } from "../../../core/src/net/PacketBuffer";
import { DebugS2CPacket } from "../../../core/src/net/packets/DebugS2CPacket";

export class ServerConnection {
  private listener: ServerPlayNetworkHandler;
  private registry: PacketRegistry<ServerPlayListener>;
  private ws: WebSocket;

  constructor(
    ws: WebSocket,
    player: ServerPlayer,
    registry: PacketRegistry<ServerPlayListener>,
  ) {
    this.ws = ws;
    this.ws.binaryType = "arraybuffer";
    this.registry = registry;
    this.listener = new ServerPlayNetworkHandler(player);

    ws.on("message", (data) => this.handleIncoming(data));

    let i = 0;
    setInterval(() => {
      this.sendPacket(new DebugS2CPacket((i++).toString()));
    }, 1000);
  }

  // @ts-expect-error The typescript checker thing won't wanna use the import of 'ws'
  private handleIncoming(data: WebSocket.RawData) {
    try {
      const packet = this.registry.decode(data as ArrayBuffer);
      packet.apply(this.listener);
    } catch (error) {
      console.error("Could not handle packet: ", error);
    }
  }

  public sendPacket<T extends Packet<PlayListener>>(packet: T) {
    const buf = new PacketBuffer(new ArrayBuffer(256));
    buf.writeInt((packet.constructor as unknown as { id: number }).id);
    packet.write(buf);
    this.ws.send(buf.buffer.slice(0, buf.offset));
  }
}
