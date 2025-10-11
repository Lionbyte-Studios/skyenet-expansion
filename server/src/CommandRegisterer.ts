import { GreedyStringArgumentBuilder } from "../../core/src/commands/builder/GreedyStringArgumentBuilder";
import { IntegerArgumentBuilder } from "../../core/src/commands/builder/IntegerArgumentBuilder";
import { LiteralArgumentBuilder } from "../../core/src/commands/builder/LiteralArgumentBuilder";
import { StringArgumentBuilder } from "../../core/src/commands/builder/StringArgumentBuilder";
import { CommandManager } from "../../core/src/commands/lib/CommandManager";
import { ServerAsteroid } from "./entity/ServerAsteroid";
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
          new IntegerArgumentBuilder("x").then(
            new IntegerArgumentBuilder("y")
              .executes((ctx) => {
                const x = ctx.getArgument<number>("x");
                const y = ctx.getArgument<number>("y");
                serverMgr.game.spawnEntity(new ServerAsteroid(x, y, 0, 1, 0));
                return 1;
              })
              .then(
                new IntegerArgumentBuilder("size").then(
                  new IntegerArgumentBuilder("rotation").then(
                    new IntegerArgumentBuilder("velR").executes((ctx) => {
                      const { x, y, size, rotation, velR } = {
                        x: ctx.getArgument<number>("x"),
                        y: ctx.getArgument<number>("y"),
                        size: ctx.getArgument<number>("size"),
                        rotation: ctx.getArgument<number>("rotation"),
                        velR: ctx.getArgument<number>("velR"),
                      };
                      serverMgr.game.spawnEntity(
                        new ServerAsteroid(x, y, rotation, size, velR),
                      );
                      return 1;
                    }),
                  ),
                ),
              ),
          ),
        )
        .executes((ctx) => {
          ctx.sendMessage(
            "Usage: /summon asteroid <x> <y> [<size> <rotation> <velR>]",
          );
          return 0;
        }),
    ),
  );
}
