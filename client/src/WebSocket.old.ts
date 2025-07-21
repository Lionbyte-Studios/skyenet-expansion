import * as schemas from "../../core/src/Schemas";
import {
  ShipEngineSprite,
  ShipSprite,
  type BulletMessage,
  type MovementMessage,
} from "../../core/src/types";
import { webSocketManager } from "./Main";

// let socket: WebSocket;
/*
export function initWebSocket() {
  let webSocketUrl = "ws://";
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
    webSocketUrl += "localhost:8081";
  } else {
    webSocketUrl += "ws." + location.host;
  }

  // socket = new WebSocket(webSocketUrl);

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
        result = schemas.StatusMessage.safeParse(json);
        if (!result.success) break;
        handleStatusMessage(json);
        break;
      case WebSocketMessageType.PlayerJoinCallback:
        result = schemas.PlayerJoinMessageCallback.safeParse(json);
        if (!result.success) break;
        handleJoinCallbackMessage(json);
        break;
      case WebSocketMessageType.UpdatePlayers:
        result = schemas.UpdatePlayersMessage.safeParse(json);
        if (!result.success) break;
        handleUpdatePlayersMessage(result.data);
        break;
      case WebSocketMessageType.Movement:
        result = schemas.MovementMessage.safeParse(json);
        if (!result.success) break;
        handleMovementMessage(result.data);
        break;
      case WebSocketMessageType.BulletMessage:
        result = schemas.BulletMessage.safeParse(json);
        if (!result.success) break;
        handleBulletMesage(result.data);
        break;
      default:
        break;
    }
  };
}
*/

export function joinGame(
  selectedShip: ShipSprite,
  selectedShipEngine: ShipEngineSprite,
) {
  webSocketManager.socket.send(
    JSON.stringify(
      schemas.PlayerJoinMessage.parse({
        shipSprite: selectedShip,
        shipEngineSprite: selectedShipEngine,
      }),
    ),
  );
}

export function sendMovement(msg: Omit<MovementMessage, "type">) {
  webSocketManager.socket.send(JSON.stringify(schemas.MovementMessage.parse(msg)));
}

export function sendBullet(msg: Omit<BulletMessage, "type">) {
  webSocketManager.socket.send(JSON.stringify(schemas.BulletMessage.parse(msg)));
}

