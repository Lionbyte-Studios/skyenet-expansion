import { GameMode } from "../../core/src/types";
import { ServerGame } from "./ServerGame";
import { genStringID } from "../../core/src/util/Util";
import { WebSocketServerManager } from "./net/WebSocketServer";
import { TextDisplay } from "../../core/src/entity/TextDisplay";

export class ServerManager {
  public game: ServerGame;
  public wsMgr: WebSocketServerManager;

  constructor() {
    this.game = new ServerGame(genStringID(8), GameMode.FFA);
    this.wsMgr = new WebSocketServerManager();
    this.game.entities.push(new TextDisplay("hi", 300, -300));
    this.game.entities.push(new TextDisplay("hi", 10000, 0));
  }
}

export const serverMgr = new ServerManager();
serverMgr.game.startGameLoop();
