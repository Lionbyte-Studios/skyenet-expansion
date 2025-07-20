import { Config } from "./config/Config";
import { DefaultConfig } from "./config/DefaultConfig";
import { Entity } from "./entity/Entity";
import { Player } from "./entity/Player";
import { GameID, GameMode } from "./types.d";

export class Game {
  public players: Player[];
  public gameID: GameID;
  public gameMode: GameMode;
  public entities: Entity[];
  public config: Config;
  protected lastTickTimestamp: number;

  constructor(gameID: GameID, gameMode: GameMode) {
    this.gameID = gameID;
    this.gameMode = gameMode;
    this.config = new DefaultConfig();
    this.entities = [];
    this.players = [];
    this.lastTickTimestamp = Date.now();
  }

  public addPlayer(player: Player) {
    this.players.push(player);
  }

  public tick() {}
}
