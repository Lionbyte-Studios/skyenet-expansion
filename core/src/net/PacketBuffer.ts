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
    this.view.setInt32(this.offset, value);
    this.offset += 4;
  }
  readInt(): number {
    const v = this.view.getInt32(this.offset);
    this.offset += 4;
    return v;
  }
  writeFloat(value: number): void {
    this.view.setFloat32(this.offset, value);
    this.offset += 4;
  }
  readFloat(): number {
    const v = this.view.getFloat32(this.offset);
    this.offset += 4;
    return v;
  }
  writeBoolean(value: boolean): void {
    this.view.setUint8(this.offset++, value ? 1 : 0);
  }
  readBoolean(): boolean {
    return this.view.getUint8(this.offset++) === 1;
  }
  writeString(value: string): void {
    const bytes = new TextEncoder().encode(value);
    this.writeInt(bytes.length);
    new Uint8Array(this.buffer, this.offset, bytes.length).set(bytes);
    this.offset += bytes.length;
  }
  readString(): string {
    const len = this.readInt();
    const bytes = new Uint8Array(this.buffer, this.offset, len);
    this.offset += len;
    return new TextDecoder().decode(bytes);
  }
}
