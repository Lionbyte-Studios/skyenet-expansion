import { BulletType } from "../../../core/src/entity/Bullet";
import { ItemState } from "../../../core/src/entity/Item";
import { FlamesBits } from "../../../core/src/entity/Player";
import type { Game } from "../../../core/src/Game";
import { BulletShootC2SPacket } from "../../../core/src/net/packets/BulletShootC2SPacket";
import { PickupItemsC2SPacket } from "../../../core/src/net/packets/PickupItemC2SPacket";
import { PlayerMoveC2SPacket } from "../../../core/src/net/packets/PlayerMoveC2SPacket";
import {
  type EntityID,
  type ShipEngineSprite,
  type ShipSprite,
} from "../../../core/src/types";
import { distanceSq, manhattanDistance } from "../../../core/src/util/Util";
import { ClientGame } from "../ClientGame";
import type { TextComponent } from "../graphics/component/TextComponent";
import { InGameScreen } from "../graphics/screen/InGameScreen";
import { clientManager } from "../Main";
import { ClientItemEntity } from "./ClientItem";
import { ClientPlayer } from "./ClientPlayer";

export class MyPlayer extends ClientPlayer {
  cameraDist: number = 0; // make this modifyable by player in settings
  public override tick<T extends Game>(game?: T) {
    if (game === undefined) return;
    if (!(game instanceof ClientGame)) return;

    // Please don't change the order of these function calls unless you know what exactly you're doing
    this.velocityChange(game);
    this.move(game);
    this.flamesToFlamesState();
    this.sendMovement();

    const nearbyItems = this.quickFindNearItems();
    if (nearbyItems.length !== 0) {
      const itemIDs: EntityID[] = [];
      nearbyItems.forEach((item) => {
        const distance = distanceSq(this.x, this.y, item.x, item.y);
        if (distance > clientManager.game.config.itemPickupRangeSquared) return;
        itemIDs.push(item.entityID);
      });
      clientManager.webSocketClient.connection.sendPacket(
        new PickupItemsC2SPacket(itemIDs),
      );
    }

    if (clientManager.currentScreen instanceof InGameScreen) {
      // update the component data each tick (stfu this is not actually as inefficient as it seems since it re-renders each frame anyway)
      clientManager.currentScreen.modifyComponentData<TextComponent>(
        (c) => c.args.custom_id === "coin_display",
        { data: { text: "Coins: " + this.inventory.coins } },
      );
    }
  }

  private velocityChange(game: ClientGame) {
    // Reset engine state each frame
    this.engineActive = false;
    this.flames = 0;

    const horizontal = Math.cos((this.rotation * Math.PI) / 180) / 3;
    const vertical = Math.sin((this.rotation * Math.PI) / 180) / 3;
    if (game.keyManager.isKeyPressed("KeyW")) {
      this.engineActive = true;
      this.velY -= horizontal;
      this.velX -= vertical;
      this.flames = this.flames | FlamesBits.Forward;
    }
    if (game.keyManager.isKeyPressed("KeyS")) {
      this.velY += horizontal / 2;
      this.velX += vertical / 2;
      this.flames = this.flames | FlamesBits.Backward;
    }
    if (game.keyManager.isKeyPressed("KeyA")) {
      this.velR += 0.1;
      this.flames = this.flames | FlamesBits.RotateCounterClockwise;
    }
    if (game.keyManager.isKeyPressed("KeyD")) {
      this.velR -= 0.1;
      this.flames = this.flames | FlamesBits.RotateClockwise;
    }
    if (game.keyManager.wasKeyJustPressed("KeyO")) {
      this.HP++;
    }
    if (game.keyManager.wasKeyJustPressed("KeyL")) {
      this.HP--;
    }
    if (game.keyManager.wasKeyJustPressed("Space")) {
      clientManager.webSocketClient.connection.sendPacket(
        new BulletShootC2SPacket(
          this.playerID,
          BulletType.Starter,
          this.x,
          this.y,
          this.velX - vertical * 10,
          this.velY - horizontal * 10,
        ),
      );
    }
  }

  public sendMovement() {
    clientManager.webSocketClient.connection.sendPacket(
      new PlayerMoveC2SPacket(
        this.x,
        this.y,
        this.rotation,
        this.velX,
        this.velY,
        this.velR,
        this.engineActive,
        this.flames,
      ),
    );
  }

  public setShipType(shipSprite: ShipSprite, engineSprite: ShipEngineSprite) {
    this.shipSprite = shipSprite;
    this.shipEngineSprite = engineSprite;
  }

  /**
   * Uses the manhattan distance to efficiently find nearby items. Note that the manhattan distance does not search in a circle range.
   * @param maxDistance Maximum (manhattan-) distance to the item
   * @returns The list of items that are in the specified distance
   */
  public quickFindNearItems(
    maxDistance: number = clientManager.game.config.itemPickupRange * 2,
  ): ClientItemEntity[] {
    const items: ClientItemEntity[] = [];
    clientManager.game.entities
      .filter(
        (entity) =>
          entity instanceof ClientItemEntity && entity.state === ItemState.Idle,
      )
      .forEach((item) => {
        if (manhattanDistance(this.x, this.y, item.x, item.y) <= maxDistance)
          items.push(item as ClientItemEntity /* safe */);
      });
    return items;
  }
}
