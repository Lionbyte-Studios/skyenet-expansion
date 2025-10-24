import { Config } from "./config/Config";
import { DefaultConfig } from "./config/DefaultConfig";
import { Entity } from "./entity/Entity";
import { Player } from "./entity/Player";
import { GameID, GameMode } from "./types";
import { IndexSignature, OmitFunctions } from "./util/Util";

export abstract class Game {
  public players: Player[];
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

  public addPlayer(player: Player) {
    this.players.push(player);
  }

  public tick() {}

  public static registerEntities(): void {
    throw new Error("Must be implemented.");
  }

  public modifyEntityData<T extends Entity = Entity>(
    entityPredicate: (entity: Entity, index: number) => boolean,
    data: IndexSignature<Partial<OmitFunctions<T>>>,
  ) {
    this.entities.forEach((entity, index) => {
      if (!entityPredicate(entity, index)) return;
      for (const key in data) {
        this.entities[index][key] = data[key];
      }
    });
  }

  public modifyPlayerData<T extends Player = Player>(
    playerPredicate: (player: Player, index: number) => boolean,
    data: IndexSignature<Partial<OmitFunctions<T>>>,
  ) {
    this.players.forEach((player, index) => {
      if (!playerPredicate(player, index)) return;
      for (const key in data) {
        this.players[index][key] = data[key];
      }
    });
  }
}
