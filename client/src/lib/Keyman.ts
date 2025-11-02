export class KeyManager {
  keysMap: Map<string, boolean>;
  keysCurrentlyPressed: Map<string, boolean>;
  keysPressedLastFrame: Map<string, boolean>;

  constructor() {
    this.keysMap = new Map();
    this.keysCurrentlyPressed = new Map();
    this.keysPressedLastFrame = new Map();

    document.addEventListener(
      "keydown",
      (event) => {
        const code = event.code;
        this.setKeyPressed(code, true);
      },
      false,
    );

    document.addEventListener(
      "keyup",
      (event) => {
        const code = event.code;
        this.setKeyPressed(code, false);
      },
      false,
    );
  }

  wasKeyJustPressed(code: string): boolean {
    const lastFrame = this.keysPressedLastFrame.get(code);
    const currentFrame = this.keysCurrentlyPressed.get(code);
    if (currentFrame === undefined || currentFrame === false) return false;
    if (lastFrame === true) return false;
    return true;
  }

  isKeyPressed(code: string): boolean {
    if (!this.keysCurrentlyPressed.has(code)) return false;
    return this.keysCurrentlyPressed.get(code)!;
  }

  setKeyPressed(code: string, pressed: boolean) {
    this.keysMap.set(code, pressed);
  }

  update() {
    this.keysPressedLastFrame.clear();
    for (const [key, value] of this.keysCurrentlyPressed.entries()) {
      this.keysPressedLastFrame.set(key, value);
    }
    this.keysCurrentlyPressed.clear();
    for (const [key, value] of this.keysMap.entries()) {
      this.keysCurrentlyPressed.set(key, value);
    }
  }
}
