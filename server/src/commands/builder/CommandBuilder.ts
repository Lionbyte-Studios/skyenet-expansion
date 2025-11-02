import { CommandContext, CommandSource } from "../lib/CommandManager";
import {
  CommandExecutorFn,
  CommandRequiresFn,
  type CommandNode,
} from "../lib/node/CommandNode";

export abstract class CommandBuilder {
  protected children: CommandBuilder[] = [];
  protected executor: CommandExecutorFn = (ctx: CommandContext) => {
    ctx.sendMessage(
      "Command not executable at this node. Specify more arguments.",
    );
    return 0;
  };
  protected requiresFn: CommandRequiresFn = (source: CommandSource) => {
    return true;
  };
  protected requiresMsg: string | undefined;

  public then(argument: CommandBuilder): CommandBuilder {
    this.children.push(argument);
    return this;
  }

  public executes(executor: CommandExecutorFn): CommandBuilder {
    this.executor = executor;
    return this;
  }

  public requires(requires: CommandRequiresFn): CommandBuilder {
    this.requiresFn = requires;
    return this;
  }

  public setRequiresErrorMessage(requiresMsg: string): CommandBuilder {
    this.requiresMsg = requiresMsg;
    return this;
  }

  public abstract build(): CommandNode;
  protected commonBuildLogic(node: CommandNode) {
    for (const child of this.children) {
      node.children.push(child.build());
    }
    if (this.requiresMsg !== undefined) {
      node.requiresMsg = this.requiresMsg;
    }
  }
}
