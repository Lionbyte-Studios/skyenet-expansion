import type { ClientPlayListener } from "../../../core/src/net/listener/ClientPlayListener";
import { ClientPlayNetworkHandler } from "./ClientPlayNetworkHandler";
import { PacketRegistry } from "../../../core/src/net/PacketRegistry";
import { PacketBuffer } from "../../../core/src/net/PacketBuffer";
import type { Packet } from "../../../core/src/net/Packet";

export class ClientConnection {
  private listener: ClientPlayNetworkHandler;
  private registry: PacketRegistry<ClientPlayListener>;
  private ws: WebSocket;

  constructor(ws: WebSocket, registry: PacketRegistry<ClientPlayListener>) {
    this.listener = new ClientPlayNetworkHandler();
    this.registry = registry;

    this.ws = ws;
    this.ws.binaryType = "arraybuffer";
    this.ws.addEventListener("message", (event) =>
      this.handleIncoming(event.data),
    );
  }

  private handleIncoming(data: ArrayBuffer) {
    try {
      const packet = this.registry.decode(data);
      packet.apply(this.listener);
    } catch (error) {
      console.error("Failed to handle packet: ", error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public sendPacket(packet: Packet<any>) {
    const buf = new PacketBuffer(new ArrayBuffer(256));
    buf.writeInt((packet.constructor as unknown as { id: number }).id);
    packet.write(buf);
    this.ws.send(buf.buffer.slice(0, buf.offset));
  }
}
