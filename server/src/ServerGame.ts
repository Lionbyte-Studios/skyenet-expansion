import { Player } from "../../core/src/entity/Player";
import { Game } from "../../core/src/Game";
import { GameID, GameMode, MessageType } from "../../core/src/types.d";
import { calculateNextTickTimeRemaining, genStringID } from "../../core/src/util/Util";

export class ServerGame extends Game {
  constructor(gameID: GameID, gameMode: GameMode) {
    super(gameID, gameMode);
    this.tick();
  }

  public handleMovementMessage(message: MessageType.MovementMessage) {
    console.log(message);
  }
  public handleStatusMessage(message: MessageType.StatusMessage) {
    console.log(message);
  }
  public static generateRandomPlayerID() {
    return genStringID(8);
  }
  public generatePlayer(): Player {
    const id = ServerGame.generateRandomPlayerID();
    const entityID = genStringID(8);
    return new Player(
      id,
      entityID,
      this.config.defaultSpawnCoords.x,
      this.config.defaultSpawnCoords.y,
      0,
      this.config.defaultShipSprite,
      this.config.defaultShipEngineSprite,
    );
  }

  public override tick() {
    this.lastTickTimestamp = Date.now();
    // this.players.forEach(player => player.tick());
    this.entities.forEach(entity => {
      // if(entity instanceof Player) return;
      entity.tick();
    });
    setTimeout(() => this.tick(), calculateNextTickTimeRemaining(this.config.tps, this.lastTickTimestamp));
  }
}
