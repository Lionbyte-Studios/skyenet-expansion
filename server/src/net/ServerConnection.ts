import { ServerPlayListener } from "../../../core/src/net/listener/ServerPlayListener";
import { PacketRegistry } from "../../../core/src/net/PacketRegistry";
import { ServerPlayNetworkHandler } from "./ServerPlayNetworkHandler";
import { PlayListener } from "../../../core/src/net/listener/PlayListener";
import { Packet } from "../../../core/src/net/Packet";
import { PacketBuffer } from "../../../core/src/net/PacketBuffer";
import { WebSocketClientWithData } from "./WebSocketServer";

export class ServerConnection {
  private listener: ServerPlayNetworkHandler;
  private registry: PacketRegistry<ServerPlayListener>;
  private ws: WebSocketClientWithData;

  constructor(
    ws: WebSocketClientWithData,
    registry: PacketRegistry<ServerPlayListener>,
  ) {
    this.ws = ws;
    this.ws.binaryType = "arraybuffer";
    this.registry = registry;
    this.listener = new ServerPlayNetworkHandler(
      this.sendPacket.bind(this),
      this.ws.data.socket_id,
    );
    this.listener._registerPackets(this.registry);

    ws.on("message", (data) => this.handleIncoming(data));
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
    const buf = new PacketBuffer();
    buf.writeInt((packet.constructor as unknown as { id: number }).id);
    packet.write(buf);
    this.ws.send(buf.buffer.slice(0, buf.offset));
  }
}
