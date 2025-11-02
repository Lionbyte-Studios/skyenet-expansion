import { PlayListener } from "./listener/PlayListener";
import { Packet } from "./Packet";
import { PacketBuffer } from "./PacketBuffer";

export class PacketRegistry<L extends PlayListener> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private registry = new Map<number, new (...args: any[]) => Packet<L>>();

  register(
    id: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    packetClass: new (...args: any[]) => Packet<L>,
  ) {
    this.registry.set(id, packetClass);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decode(buffer: ArrayBuffer): Packet<any> {
    const buf = new PacketBuffer(buffer);
    const id = buf.readInt();
    const packet = this.registry.get(id);
    if (packet === undefined) throw new Error(`Unknown packet id ${id}`);
    // @ts-expect-error Doesn't wanna let me do the static method even though its static
    return packet.read(buf);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  encode(packet: Packet<any>): ArrayBuffer {
    const buffer = new ArrayBuffer(512);
    const buf = new PacketBuffer(buffer);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const id = (packet.constructor as any).id as number;
    buf.writeInt(id);
    packet.write(buf);
    return buf.data;
  }
}
