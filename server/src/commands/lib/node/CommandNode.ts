import {
  CommandContext,
  CommandResult,
  CommandSender,
} from "../CommandManager";
import { StringReader } from "../CommandStringReader";

export type CommandExecutorFn = (
  ctx: CommandContext,
  sender: CommandSender,
) => CommandResult;

export type CommandRequiresFn = (sender: CommandSender) => boolean;

export abstract class CommandNode {
  public children: CommandNode[] = [];
  public executor: CommandExecutorFn;
  public requires: CommandRequiresFn;
  public requiresMsg: string = "You do not have permission to execute this.";

  constructor(executor: CommandExecutorFn, requires: CommandRequiresFn) {
    this.executor = executor;
    this.requires = requires;
  }

  /**
   *
   * @returns `undefined` if the parsing failed, and the new reader cursor position otherwise.
   */
  public abstract parse(reader: StringReader): number | undefined;

  public toString(): string {
    return `<node c=${this.children.length}>`;
  }
}
