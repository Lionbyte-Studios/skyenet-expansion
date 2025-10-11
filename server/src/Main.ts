import { GameMode } from "../../core/src/types";
import { ServerGame } from "./ServerGame";
import { genStringID } from "../../core/src/util/Util";
import { WebSocketServerManager } from "./net/WebSocketServer";
import { ApiManager } from "./api/ApiManager";
import { TextDisplay } from "../../core/src/entity/TextDisplay";
import {
  CommandContext,
  CommandExecutionEnvironment,
  CommandManager,
} from "../../core/src/commands/lib/CommandManager";
import { LiteralArgumentBuilder } from "../../core/src/commands/builder/LiteralArgumentBuilder";
import { IntegerArgumentBuilder } from "../../core/src/commands/builder/IntegerArgumentBuilder";

class ServerCommandExecutionEnvironment extends CommandExecutionEnvironment {
  public sendMessage(message: string, context: CommandContext): void {
    console.log(message);
  }
}

export class ServerManager {
  public game: ServerGame;
  public wsMgr: WebSocketServerManager;
  public commandManager: CommandManager;

  constructor() {
    this.game = new ServerGame(genStringID(8), GameMode.FFA);
    this.wsMgr = new WebSocketServerManager();
    this.commandManager = new CommandManager();
    this.commandManager.setGlobalContext(
      new CommandContext(new ServerCommandExecutionEnvironment()),
    );
  }
}

export const serverMgr = new ServerManager();
serverMgr.game.startGameLoop();

// Start the API (express.js)
export const apiMgr = new ApiManager();

serverMgr.game.spawnEntity(new TextDisplay("hii", 300, -300));

serverMgr.commandManager.registerCommand(
  new LiteralArgumentBuilder("operation")
    .then(
      new LiteralArgumentBuilder("add").then(
        new IntegerArgumentBuilder("num1").then(
          new IntegerArgumentBuilder("num2").executes((ctx) => {
            const num1 = ctx.getArgument<number>("num1");
            const num2 = ctx.getArgument<number>("num2");
            ctx.sendMessage(`${num1} + ${num2} = ${num1 + num2}`);
            return 1;
          }),
        ),
      ),
    )
    .then(
      new LiteralArgumentBuilder("subtract").then(
        new IntegerArgumentBuilder("num1").then(
          new IntegerArgumentBuilder("num2").executes((ctx) => {
            const num1 = ctx.getArgument<number>("num1");
            const num2 = ctx.getArgument<number>("num2");
            ctx.sendMessage(`${num1} - ${num2} = ${num1 - num2}`);
            return 1;
          }),
        ),
      ),
    )
    .then(
      new LiteralArgumentBuilder("multiply").then(
        new IntegerArgumentBuilder("num1").then(
          new IntegerArgumentBuilder("num2").executes((ctx) => {
            const num1 = ctx.getArgument<number>("num1");
            const num2 = ctx.getArgument<number>("num2");
            ctx.sendMessage(`${num1} * ${num2} = ${num1 * num2}`);
            return 1;
          }),
        ),
      ),
    )
    .then(
      new LiteralArgumentBuilder("divide").then(
        new IntegerArgumentBuilder("num1").then(
          new IntegerArgumentBuilder("num2").executes((ctx) => {
            const num1 = ctx.getArgument<number>("num1");
            const num2 = ctx.getArgument<number>("num2");
            ctx.sendMessage(`${num1} / ${num2} = ${num1 / num2}`);
            return 1;
          }),
        ),
      ),
    ),
);

serverMgr.commandManager.runCommand("operation add 5 3");
serverMgr.commandManager.runCommand("operation subtract 15 3");
serverMgr.commandManager.runCommand("operation multiply 5 3");
serverMgr.commandManager.runCommand("operation divide 1000 10");
