import {
  CoordinatesArgumentBuilder,
  CoordinatesType,
} from "./commands/builder/CoordinatesArgumentBuilder";
import { GreedyStringArgumentBuilder } from "./commands/builder/GreedyStringArgumentBuilder";
import { LiteralArgumentBuilder } from "./commands/builder/LiteralArgumentBuilder";
import { StringArgumentBuilder } from "./commands/builder/StringArgumentBuilder";
import { CommandManager, CommandSender } from "./commands/lib/CommandManager";
import { ServerAsteroid } from "./entity/ServerAsteroid";
import { ServerPlayer } from "./entity/ServerPlayer";
import { serverMgr } from "./Main";
import { ChatMessageS2CPacket } from "../../core/src/net/packets/ChatMessageS2CPacket";
import { ParticleType } from "../../core/src/entity/Particles";
import { ServerParticles } from "./entity/ServerParticles";

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
    new LiteralArgumentBuilder("kick").requires(requireAdmin).then(
      new StringArgumentBuilder("player_id").executes((ctx) => {
        const id = ctx.getArgument<string>("player_id");
        for (const player of serverMgr.game.entities.filter(
          (entity) => entity instanceof ServerPlayer,
        )) {
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
        serverMgr.game.entities
          .filter((entity) => entity instanceof ServerPlayer)
          .forEach((player) => player.leave_game());
        return 1;
      }),
  );

  mgr.registerCommand(
    new LiteralArgumentBuilder("summon").requires(requireAdmin).then(
      new LiteralArgumentBuilder("asteroid")
        .then(
          new CoordinatesArgumentBuilder("coords").executes((ctx, sender) => {
            if (!(sender instanceof ServerPlayer)) {
              sender.sendMessage("You must be a player.");
              return 0;
            }
            const coords = ctx.getArgument<CoordinatesType>("coords");
            let x = coords.x.value;
            let y = coords.y.value;
            if (coords.x.type === "relative") {
              x += sender.x;
            }
            if (coords.y.type === "relative") {
              y += sender.y;
            }
            serverMgr.game.spawnEntity(new ServerAsteroid(x, y, 0, 5, 0));
            return 1;
          }),
        )
        .executes((ctx, sender) => {
          if (!(sender instanceof ServerPlayer)) {
            sender.sendMessage("You must be a player.");
            return 0;
          }
          serverMgr.game.spawnEntity(
            new ServerAsteroid(sender.x, sender.y, 0, 5, 0),
          );
          return 1;
        }),
    ),
  );

  mgr.registerCommand(
    new LiteralArgumentBuilder("broadcast").requires(requireAdmin).then(
      new GreedyStringArgumentBuilder("message").executes((ctx, sender) => {
        const message = ctx.getArgument<string>("message");
        serverMgr.wsMgr.broadcastPacket(new ChatMessageS2CPacket(message));
        return 1;
      }),
    ),
  );

  mgr.registerCommand(
    new LiteralArgumentBuilder("say").then(
      new GreedyStringArgumentBuilder("message").executes((ctx, sender) => {
        const message = ctx.getArgument<string>("message");
        serverMgr.wsMgr.broadcastPacket(
          new ChatMessageS2CPacket("<" + sender.getName() + "> " + message),
        );
        return 1;
      }),
    ),
  );

  let interval: NodeJS.Timeout | undefined = undefined;
  mgr.registerCommand(
    new LiteralArgumentBuilder("test").executes((ctx, sender) => {
      if (!(sender instanceof ServerPlayer)) return 0;
      if (interval !== undefined) {
        clearInterval(interval);
        return 1;
      }
      interval = setInterval(
        () =>
          serverMgr.game.spawnEntity(
            new ServerParticles(
              0,
              0,
              [255, 0, 0],
              ParticleType.Square,
              100,
              2,
              1,
            ),
          ),
        2000,
      );
      return 1;
    }),
  );
}

function requireAdmin(sender: CommandSender): boolean {
  return sender.isAdmin();
}
