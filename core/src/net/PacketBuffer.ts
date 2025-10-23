export class PacketBuffer {
  private view: DataView;
  public offset: number;
  public buffer: ArrayBuffer;
  private bytes: Uint8Array;

  constructor(sizeOrBuffer: number | ArrayBuffer = 256) {
    if (typeof sizeOrBuffer === "number") {
      this.buffer = new ArrayBuffer(sizeOrBuffer);
    } else {
      this.buffer = sizeOrBuffer;
    }
    this.view = new DataView(this.buffer);
    this.bytes = new Uint8Array(this.buffer);
    this.offset = 0;
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
    this.writeInt(bytes.length);
    this.ensureWritable(bytes.length);
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

  writeArray<T>(
    arr: T[],
    writeItem: (buf: PacketBuffer, item: T) => void,
  ): void {
    this.writeInt(arr.length);
    for (const item of arr) {
      writeItem(this, item);
    }
  }
  readArray<T>(
    readItem: (buf: PacketBuffer) => T,
    arrayLimit: number = 1_000_000,
  ): T[] {
    const length = this.readInt();
    if (length < 0 || length > arrayLimit)
      throw new Error("Invalid array length: " + length);
    const arr: T[] = [];
    for (let i = 0; i < length; i++) {
      arr.push(readItem(this));
    }
    return arr;
  }

  ensureReadable(bytes: number) {
    if (this.offset + bytes > this.buffer.byteLength) {
      throw new Error(
        `Packet underflow: tried to read ${bytes} beyond buffer.`,
      );
    }
  }

  ensureWritable(bytes: number) {
    const required = this.offset + bytes;
    if (required <= this.buffer.byteLength) return;

    let newSize = this.buffer.byteLength;
    while (newSize < required) newSize *= 2;

    const newBuffer = new ArrayBuffer(newSize);
    const newBytes = new Uint8Array(newBuffer);
    newBytes.set(this.bytes);
    this.buffer = newBuffer;
    this.bytes = newBytes;
    this.view = new DataView(this.buffer);
  }

  toArrayBuffer(): ArrayBuffer {
    return this.buffer.slice(0, this.offset);
  }
}
