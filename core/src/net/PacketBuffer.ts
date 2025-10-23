export class PacketBuffer {
  private view: DataView;
  public offset: number;
  public buffer: ArrayBuffer;

  constructor(buffer: ArrayBuffer) {
    this.view = new DataView(buffer);
    this.offset = 0;
    this.buffer = buffer;
  }

  get data(): ArrayBuffer {
    return this.buffer.slice(0, this.offset);
  }

  writeInt(value: number): void {
    this.ensureWritable(4);
    this.view.setInt32(this.offset, value);
    this.offset += 4;
  }
  readInt(): number {
    this.ensureReadable(4);
    const v = this.view.getInt32(this.offset);
    this.offset += 4;
    return v;
  }

  writeFloat(value: number): void {
    this.ensureWritable(4);
    this.view.setFloat32(this.offset, value);
    this.offset += 4;
  }
  readFloat(): number {
    this.ensureReadable(4);
    const v = this.view.getFloat32(this.offset);
    this.offset += 4;
    return v;
  }

  writeBoolean(value: boolean): void {
    this.ensureWritable(1);
    this.view.setUint8(this.offset++, value ? 1 : 0);
  }
  readBoolean(): boolean {
    this.ensureReadable(1);
    return this.view.getUint8(this.offset++) === 1;
  }

  writeString(value: string): void {
    const bytes = new TextEncoder().encode(value);
    if (bytes.length > 256) throw new Error("String too long");
    this.writeInt(bytes.length);
    new Uint8Array(this.buffer, this.offset, bytes.length).set(bytes);
    this.offset += bytes.length;
  }
  readString(maxLength: number = 256): string {
    const len = this.readInt();
    if (len < 0 || len > maxLength)
      throw new Error(`Invalid string length: ${len}`);
    this.ensureReadable(len);
    const bytes = new Uint8Array(this.buffer, this.offset, len);
    this.offset += len;
    return new TextDecoder().decode(bytes);
  }

  ensureReadable(bytes: number) {
    if (this.offset + bytes > this.buffer.byteLength) {
      throw new Error(
        `Packet underflow: tried to read ${bytes} beyond buffer.`,
      );
    }
  }

  ensureWritable(bytes: number) {
    if (this.offset + bytes > this.buffer.byteLength) {
      throw new Error("Packet overflow: not enough space in buffer.");
    }
  }
}
