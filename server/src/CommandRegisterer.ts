import { GreedyStringArgumentBuilder } from "../../core/src/commands/builder/GreedyStringArgumentBuilder";
import { LiteralArgumentBuilder } from "../../core/src/commands/builder/LiteralArgumentBuilder";
import { StringArgumentBuilder } from "../../core/src/commands/builder/StringArgumentBuilder";
import { CommandManager } from "../../core/src/commands/lib/CommandManager";
import { serverMgr } from "./Main";

export function registerCommands(mgr: CommandManager) {
  mgr.registerCommand(
    new LiteralArgumentBuilder("echo").then(
      new GreedyStringArgumentBuilder("str").executes((ctx) => {
        ctx.sendMessage(ctx.getArgument<string>("str"));
        return 1;
      }),
    ),
  );

  mgr.registerCommand(
    new LiteralArgumentBuilder("kick").then(
      new StringArgumentBuilder("player_id").executes((ctx) => {
        const id = ctx.getArgument<string>("player_id");
        const index = serverMgr.game.players.findIndex(
          (player) => player.playerID === id,
        );
        if (index === -1) return 0;
        serverMgr.game.players[index].leave_game();
        return 1;
      }),
    ),
  );
}
