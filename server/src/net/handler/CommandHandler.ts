import * as schemas from "../../../../core/src/Schemas";
import {
  CommandMessage,
  WebSocketMessageType,
} from "../../../../core/src/types";
import { serverMgr } from "../../Main";
import { SocketMessageData } from "../WebSocketServer";
import { WsMessageHandler } from "./Handler";

export class WsCommandMessageHandler
  implements WsMessageHandler<CommandMessage>
{
  handledType: WebSocketMessageType = WebSocketMessageType.Command;
  public async handleMessage(
    data: SocketMessageData<CommandMessage>,
  ): Promise<void | string> {
    const json = JSON.parse(data.message.toString()) as
      | CommandMessage
      | undefined;
    if (typeof json === "undefined" || json === undefined) return;
    const commandData = schemas.CommandMessage.safeParse(json);
    if (!commandData.success) return;
    const index = serverMgr.game.players.findIndex(
      (player) => player.socket_id === data.socket.data!.socket_id,
    );
    if (!serverMgr.game.players[index].admin) {
      console.log(
        `Player ${serverMgr.game.players[index].playerID} attempted to run command '${commandData.data.command}', but does not have permission.`,
      );
      return;
    }
    console.log(`Running command: '${commandData.data.command}'`);
    serverMgr.commandManager.runCommand(commandData.data.command);
  }
}
