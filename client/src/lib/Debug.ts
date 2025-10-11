import type { ClientGame } from "../ClientGame";
import { clientManager } from "../Main";

export class Debug {
  game: ClientGame;
  info = false;
  terminal = false;
  constructor(game: ClientGame) {
    this.game = game;
  }
  tick() {
    // TODO: This can be uncommented once we actually have a way to toggle it
    // if(!this.game.clientSettings.superKeyEnabled) return;
    if (this.game.keyManager.isKeyPressed(this.game.clientSettings.superKey)) {
      if (this.game.keyManager.wasKeyJustPressed("KeyF")) {
        this.info = !this.info;
      }
      if (this.game.keyManager.wasKeyJustPressed("KeyT")) {
        this.terminal = !this.terminal;
      }
      if (this.game.keyManager.wasKeyJustPressed("KeyC")) {
        const cmd = prompt("Enter command:");
        if (cmd === null) return;
        clientManager.webSocketManager.sendCommand({ command: cmd });
      }
    }
  }
}
