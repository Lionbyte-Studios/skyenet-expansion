import { ServerPlayer } from "../../server/src/entity/ServerPlayer";
import { Config } from "./config/Config";
import { DefaultConfig } from "./config/DefaultConfig";
import { Entity } from "./entity/Entity";
import { GameID, GameMode } from "./types";

export class Game {
  public players: ServerPlayer[];
  public gameID: GameID;
  public gameMode: GameMode;
  public entities: Entity[];
  public config: Config;

  constructor(gameID: GameID, gameMode: GameMode) {
    this.gameID = gameID;
    this.gameMode = gameMode;
    this.config = new DefaultConfig();
    this.entities = [];
    this.players = [];
  }

  public addPlayer(player: ServerPlayer) {
    this.players.push(player);
  }

  public tick() {}
}
