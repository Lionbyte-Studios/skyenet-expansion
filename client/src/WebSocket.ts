import type { Entity } from "../../core/src/entity/Entity";
import {
  BulletMessage,
  MovementMessage,
  PlayerJoinMessage,
  PlayerJoinMessageCallback,
  StatusMessage,
  UpdatePlayersMessage,
} from "../../core/src/Schemas";
import {
  EntityType,
  ShipEngineSprite,
  ShipSprite,
  WebSocketMessageType,
  type EntityID,
  type GameID,
  type MessageType,
  type PlayerID,
} from "../../core/src/types.d";
import { ClientAsteroid } from "./entity/ClientAsteroid";
import { ClientBullet } from "./entity/ClientBullet";
import { ClientPlayer } from "./entity/ClientPlayer";
import { game } from "./Main";

export const playersFromJoin: ClientPlayer[] = [];
export const entitiesFromJoin: Entity[] = [];

let resolveGameID: (value: string | PromiseLike<string>) => void;
const gameID: Promise<GameID> = new Promise((resolve) => {
  resolveGameID = resolve;
});
let resolvePlayerID: (value: string | PromiseLike<string>) => void;
const playerID: Promise<PlayerID> = new Promise((resolve) => {
  resolvePlayerID = resolve;
});
let resolveEntityID: (value: string | PromiseLike<string>) => void;
const entityID: Promise<EntityID> = new Promise((resolve) => {
  resolveEntityID = resolve;
});

let socket: WebSocket;

export function initWebSocket() {
  let webSocketUrl = "ws://";
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    webSocketUrl += "localhost:8081";
  } else {
    webSocketUrl += "ws." + location.host;
  }

  socket = new WebSocket(webSocketUrl);

  socket.onmessage = (message) => {
    let json;
    try {
      json = JSON.parse(message.data.toString());
    } catch (e) {
      console.error(e);
      return;
    }
    // console.log(json);
    if (typeof json.type === "undefined") {
      console.error("json.type is of type 'undefined'");
      return;
    }
    let result;
    switch (json.type) {
      case WebSocketMessageType.Status:
        result = StatusMessage.safeParse(json);
        if (!result.success) break;
        handleStatusMessage(json);
        break;
      case WebSocketMessageType.PlayerJoinCallback:
        result = PlayerJoinMessageCallback.safeParse(json);
        if (!result.success) break;
        handleJoinCallbackMessage(json);
        break;
      case WebSocketMessageType.UpdatePlayers:
        result = UpdatePlayersMessage.safeParse(json);
        if (!result.success) break;
        handleUpdatePlayersMessage(result.data);
        break;
      case WebSocketMessageType.Movement:
        result = MovementMessage.safeParse(json);
        if (!result.success) break;
        handleMovementMessage(result.data);
        break;
      case WebSocketMessageType.BulletMessage:
        result = BulletMessage.safeParse(json);
        if (!result.success) break;
        handleBulletMesage(result.data);
        break;
      default:
        break;
    }
  };
}

function handleStatusMessage(
  msg: MessageType.StatusMessage,
) {
  if (msg.status === "connected") {
    console.log("Connected to Server!");
  }
}

function handleJoinCallbackMessage(msg: MessageType.PlayerJoinCallbackMessage) {
  console.log(
    `My playerID: ${msg.playerID}\nGameID: ${msg.gameID}\nEntityID: ${msg.entityID}`,
  );
  resolveGameID(msg.gameID);
  resolveEntityID(msg.entityID);
  resolvePlayerID(msg.playerID);
  msg.players.forEach((player) => {
    const clientPlayer = new ClientPlayer(
      player.playerID,
      player.entityID,
      player.x,
      player.y,
      player.rotation,
      player.shipSprite,
      player.shipEngineSprite,
    );
    clientPlayer.engineActive = player.engineActive;
    clientPlayer.velX = player.velX;
    clientPlayer.velY = player.velY;
    clientPlayer.velR = player.velR;
    if (player.flames !== undefined) {
      clientPlayer.flames = player.flames;
    }
    playersFromJoin.push(clientPlayer);
  });
  msg.entities.forEach((entity) => {
    let newEntity: Entity;
    switch (entity.entityType) {
      case EntityType.Bullet:
        newEntity = new ClientBullet(
          entity.entityData.x,
          entity.entityData.y,
          entity.entityData.velX,
          entity.entityData.velY,
          entity.entityData.owner,
        );
        break;
      case EntityType.Asteroid:
        newEntity = new ClientAsteroid(
          entity.entityData.x,
          entity.entityData.y,
          entity.entityData.rotation,
          entity.entityData.size,
        );
        break;
      default:
        console.warn(`Received unknown entity type: ${entity.entityType}`);
        return;
    }
    newEntity.entityID = entity.entityID;
    entitiesFromJoin.push(newEntity);
  });
}

export async function getGameID(): Promise<GameID> {
  return await gameID;
}

export async function getPlayerID(): Promise<PlayerID> {
  return await playerID;
}

export async function getEntityID(): Promise<EntityID> {
  return await entityID;
}

export function joinGame(
  selectedShip: ShipSprite,
  selectedShipEngine: ShipEngineSprite,
) {
  socket.send(
    JSON.stringify(
      PlayerJoinMessage.parse({
        shipSprite: selectedShip,
        shipEngineSprite: selectedShipEngine,
      }),
    ),
  );
}

function handleUpdatePlayersMessage(msg: MessageType.UpdatePlayersMessage) {
  msg.playersRemoved.forEach((removedPlayerID) => {
    game.players.splice(
      game.players.findIndex((player) => player.playerID === removedPlayerID),
      1,
    );
  });
  msg.playersAdded.forEach((addedPlayer) => {
    if (addedPlayer.playerID === game.myPlayer.playerID) return;
    const _addedPlayer = new ClientPlayer(
      addedPlayer.playerID,
      addedPlayer.entityID,
      addedPlayer.x,
      addedPlayer.y,
      addedPlayer.rotation,
      addedPlayer.shipSprite,
      addedPlayer.shipEngineSprite,
    );
    _addedPlayer.velX = addedPlayer.velX;
    _addedPlayer.velY = addedPlayer.velY;
    _addedPlayer.velR = addedPlayer.velR;
    _addedPlayer.engineActive = addedPlayer.engineActive;
    if (addedPlayer.flames !== undefined) {
      _addedPlayer.flames = addedPlayer.flames;
    }
    game.players.push(_addedPlayer);
  });
}

function handleMovementMessage(msg: MessageType.MovementMessage) {
  if (
    (msg.ignoreOwnPlayer === undefined || msg.ignoreOwnPlayer) &&
    msg.playerID === game.myPlayer.playerID
  )
    return;
  const playerIndex = game.players.findIndex(
    (player) => player.playerID === msg.playerID,
  );
  game.players[playerIndex].x = msg.x;
  game.players[playerIndex].y = msg.y;
  game.players[playerIndex].engineActive = msg.engineActive;
  game.players[playerIndex].rotation = msg.rotation;
  if (msg.flames !== undefined) {
    game.players[playerIndex].flames = msg.flames;
  }
}

export function sendMovement(msg: Omit<MessageType.MovementMessage, "type">) {
  socket.send(JSON.stringify(MovementMessage.parse(msg)));
}

export function sendBullet(msg: Omit<MessageType.BulletMessage, "type">) {
  socket.send(JSON.stringify(BulletMessage.parse(msg)));
}

function handleBulletMesage(msg: MessageType.BulletMessage) {
  game.entities.push(
    new ClientBullet(
      msg.bullet.x,
      msg.bullet.y,
      msg.bullet.velX,
      msg.bullet.velY,
      msg.playerID,
    ),
  );
}
