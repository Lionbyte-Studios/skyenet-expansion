import type { ClientGame } from "../ClientGame";

export class Debug {
  game: ClientGame;
  info = false;
  constructor(game: ClientGame) {
    this.game = game;
  }
  tick() {
    if (this.game.keyManager.isKeyPressed("Backslash")) {
      if (this.game.keyManager.wasKeyJustPressed("KeyF")) {
        this.info = !this.info;
      }
    }
  }
}
