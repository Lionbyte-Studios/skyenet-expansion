import { Config } from "./config/Config";
import { DefaultConfig } from "./config/DefaultConfig";
import { Entity } from "./entity/Entity";
import { Player } from "./entity/Player";
import { GameID, GameMode } from "./types";

export class Game {
  public players: Player[] = [];
  public gameID: GameID;
  public gameMode: GameMode;
  public entities: Entity[] = [];
  public config: Config;

  constructor(gameID: GameID, gameMode: GameMode) {
    this.gameID = gameID;
    this.gameMode = gameMode;
    this.config = new DefaultConfig();
  }
}
