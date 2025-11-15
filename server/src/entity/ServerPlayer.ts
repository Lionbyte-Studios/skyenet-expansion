import { WebSocket } from "ws";
import { Player } from "../../../core/src/entity/Player";
import {
  EntityID,
  PlayerID,
  ShipEngineSprite,
  ShipSprite,
} from "../../../core/src/types";
import { serverMgr } from "../Main";
import { KillEntitiesS2CPacket } from "../../../core/src/net/packets/KillEntitiesS2CPacket";
import { CommandSender } from "../commands/lib/CommandManager";
import { ServerConnection } from "../net/ServerConnection";
import { ChatMessageS2CPacket } from "../../../core/src/net/packets/ChatMessageS2CPacket";
import { Session, User } from "../../../core/src/DatabaseSchemas";
import { ServerItemEntity } from "./ServerItem";
import { ItemMaterial } from "../../../core/src/item/ItemStack";
import { ModifyEntitiesS2CPacket } from "../../../core/src/net/packets/ModifyEntitiesS2CPacket";
import { Game } from "../../../core/src/Game";
import { ServerAsteroid } from "./ServerAsteroid";
import {
  inverse_sqrt,
  manhattanDistance,
  xyDistance,
} from "../../../core/src/util/Util";

export class ServerPlayer extends Player implements CommandSender {
  admin: boolean;
  lastPonged: number;
  sendPacket: ServerConnection["sendPacket"];
  db_user?: User;
  db_session?: Session;
  constructor(
    playerID: PlayerID,
    entityID: EntityID,
    x: number,
    y: number,
    rotation: number,
    shipSprite: ShipSprite,
    shipEngineSprite: ShipEngineSprite,
    sendPacket: ServerConnection["sendPacket"],
    admin?: boolean,
  ) {
    super(playerID, entityID, x, y, rotation, shipSprite, shipEngineSprite);
    this.admin = admin === undefined ? false : admin;
    this.lastPonged = Date.now();
    this.sendPacket = sendPacket;
  }

  /**
   * Terminates the WebSocket and deletes the player from the game.
   * Also sends the appropriate message to all other players telling them to remove the player locally.
   */
  public leave_game(ws?: WebSocket) {
    const index = serverMgr.game.entities.findIndex(
      (entity) => entity.entityID === this.entityID,
    );
    if (index !== -1) {
      const entityID = serverMgr.game.entities[index].entityID;
      serverMgr.game.entities.splice(index, 1);
      serverMgr.wsMgr.broadcastPacket(new KillEntitiesS2CPacket([entityID]));
    }
    if (ws !== undefined) {
      ws.terminate();
    }
  }

  // Performs no checks of whether the player can actually pick this item up or not
  public pickupItem(item: ServerItemEntity) {
    if (item.item.material === ItemMaterial.GOLD) {
      this.inventory.coins++;
      this.sendPacket(
        new ModifyEntitiesS2CPacket([
          {
            entityID: this.entityID,
            modifications: { inventory: this.inventory },
          },
        ]),
      );
    }
    item.pickUp(this.playerID);
    serverMgr.game.killEntity((e) => e.entityID === item.entityID, false);
  }

  sendMessage(message: string): void {
    this.sendPacket(new ChatMessageS2CPacket(message));
  }
  getName(): string {
    return this.playerID;
  }
  isAdmin(): boolean {
    return this.admin;
  }

  public override tick<T extends Game>(game?: T | undefined): void {
    super.tick(game);

    // I like to imagine that using multiple filters seperately is more efficient, but i really don't know
    const asteroidsInHitbox = serverMgr.game.entities
      .filter((entity) => entity instanceof ServerAsteroid)
      .filter(
        (asteroid) =>
          manhattanDistance(asteroid.x, asteroid.y, this.x, this.y) < 1000,
      )
      .filter((asteroid) => asteroid.isInHitbox(this.x, this.y));
    asteroidsInHitbox.forEach((asteroid) => {
      const distance = xyDistance(this, asteroid);
      this.sendMessage(`${distance.x} ${distance.y}`);
      // this.velX += distance.x * 10;
      // this.velY += distance.y * 10;
      let velXChange;
      if (distance.x === 0) {
        velXChange = 0; // thought: mabye push in a random direction instead?
      } else if (distance.x < 0) {
        velXChange = -inverse_sqrt(-distance.x);
        velXChange *= 5;
        if (velXChange < -10) velXChange = -10;
      } else {
        velXChange = inverse_sqrt(distance.x);
        velXChange *= 5;
        if (velXChange > 10) velXChange = 10;
      }

      let velYChange;
      if (distance.y === 0) {
        velYChange = 0;
      } else if (distance.y < 0) {
        velYChange = -inverse_sqrt(-distance.y);
        velYChange *= asteroid.size / 2;
        if (velYChange < -10) velYChange = -10;
      } else {
        velYChange = inverse_sqrt(distance.y);
        velYChange *= asteroid.size / 2;
        if (velYChange > 10) velYChange = 10;
      }
      serverMgr.game.modifyEntityData<ServerPlayer>(
        (e) => e.entityID === this.entityID,
        {
          velX: this.velX + velXChange,
          velY: this.velY + velYChange,
        },
      );
    });
  }
}
