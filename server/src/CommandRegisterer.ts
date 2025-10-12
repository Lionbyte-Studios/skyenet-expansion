import {
  CoordinatesArgumentBuilder,
  CoordinatesType,
} from "../../core/src/commands/builder/CoordinatesArgumentBuilder";
import { GreedyStringArgumentBuilder } from "../../core/src/commands/builder/GreedyStringArgumentBuilder";
import { LiteralArgumentBuilder } from "../../core/src/commands/builder/LiteralArgumentBuilder";
import { StringArgumentBuilder } from "../../core/src/commands/builder/StringArgumentBuilder";
import { CommandManager } from "../../core/src/commands/lib/CommandManager";
import { ServerAsteroid } from "./entity/ServerAsteroid";
import { serverMgr } from "./Main";

export function registerCommands(mgr: CommandManager) {
  mgr.registerCommand(
    new LiteralArgumentBuilder("echo").then(
      new GreedyStringArgumentBuilder("str").executes((ctx, source) => {
        source.sendMessage(ctx.getArgument<string>("str"));
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

  mgr.registerCommand(
    new LiteralArgumentBuilder("kickall").executes((ctx) => {
      serverMgr.game.players.forEach((player) => player.leave_game());
      return 1;
    }),
  );

  mgr.registerCommand(
    new LiteralArgumentBuilder("summon").then(
      new LiteralArgumentBuilder("asteroid")
        .then(
          new CoordinatesArgumentBuilder("coords").executes((ctx, source) => {
            const coords = ctx.getArgument<CoordinatesType>("coords");
            let x = coords.x.value;
            let y = coords.y.value;
            if (coords.x.type === "relative") {
              x += source.player.x;
            }
            if (coords.y.type === "relative") {
              y += source.player.y;
            }
            serverMgr.game.spawnEntity(new ServerAsteroid(x, y, 0, 5, 0));
            return 1;
          }),
        )
        .executes((ctx, source) => {
          serverMgr.game.spawnEntity(
            new ServerAsteroid(source.player.x, source.player.y, 0, 5, 0),
          );
          return 1;
        }),
    ),
  );
}
