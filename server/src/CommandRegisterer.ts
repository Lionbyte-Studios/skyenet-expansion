import {
  CoordinatesArgumentBuilder,
  CoordinatesType,
} from "./commands/builder/CoordinatesArgumentBuilder";
import { GreedyStringArgumentBuilder } from "./commands/builder/GreedyStringArgumentBuilder";
import { LiteralArgumentBuilder } from "./commands/builder/LiteralArgumentBuilder";
import { StringArgumentBuilder } from "./commands/builder/StringArgumentBuilder";
import { CommandManager, CommandSource } from "./commands/lib/CommandManager";
import { ChatMessage } from "../../core/src/Schemas";
import { ServerAsteroid } from "./entity/ServerAsteroid";
import { ServerPlayer } from "./entity/ServerPlayer";
import { serverMgr } from "./Main";

export function registerCommands(mgr: CommandManager<ServerPlayer>) {
  mgr.registerCommand(
    new LiteralArgumentBuilder("echo").requires(requireAdmin).then(
      new GreedyStringArgumentBuilder("str").executes((ctx, source) => {
        source.sendMessage(ctx.getArgument<string>("str"));
        return 1;
      }),
    ),
  );

  mgr.registerCommand(
    new LiteralArgumentBuilder("kick").requires(requireAdmin).then(
      new StringArgumentBuilder("player_id").executes((ctx) => {
        const id = ctx.getArgument<string>("player_id");
        for (const player of serverMgr.game.players) {
          if (player.playerID !== id) continue;
          player.leave_game();
          return 1;
        }
        return 0;
      }),
    ),
  );

  mgr.registerCommand(
    new LiteralArgumentBuilder("kickall")
      .requires(requireAdmin)
      .executes((ctx) => {
        serverMgr.game.players.forEach((player) => player.leave_game());
        return 1;
      }),
  );

  mgr.registerCommand(
    new LiteralArgumentBuilder("summon").requires(requireAdmin).then(
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

  mgr.registerCommand(
    new LiteralArgumentBuilder("broadcast").requires(requireAdmin).then(
      new GreedyStringArgumentBuilder("message").executes((ctx, source) => {
        const message = ctx.getArgument<string>("message");
        serverMgr.wsMgr.wss.clients.forEach((client) => {
          client.send(
            JSON.stringify(
              ChatMessage.parse({
                sender: source.playerID,
                message: message,
              }),
            ),
          );
        });
        return 1;
      }),
    ),
  );
}

function requireAdmin(source: CommandSource): boolean {
  return true;
  if (!(source.player instanceof ServerPlayer)) return false;
  return source.player.admin;
}
