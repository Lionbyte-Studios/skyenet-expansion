import { CommandContext } from "../lib/CommandManager";
import { CommandExecutorFn, type CommandNode } from "../lib/node/CommandNode";

export abstract class CommandBuilder {
  public children: CommandBuilder[] = [];
  public executor: CommandExecutorFn = (ctx: CommandContext) => {
    ctx.sendMessage(
      "Command not executable at this node. Specify more arguments.",
    );
    return 0;
  };

  public then(argument: CommandBuilder): CommandBuilder {
    this.children.push(argument);
    return this;
  }

  public executes(executor: CommandExecutorFn): CommandBuilder {
    this.executor = executor;
    return this;
  }

  public abstract build(): CommandNode;
}
