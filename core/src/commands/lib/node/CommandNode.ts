import {
  CommandContext,
  CommandResult,
  CommandSource,
} from "../CommandManager";
import { StringReader } from "../CommandStringReader";

export type CommandExecutorFn = (
  ctx: CommandContext,
  source: CommandSource,
) => CommandResult;

export abstract class CommandNode {
  public children: CommandNode[] = [];
  public executor: CommandExecutorFn;

  constructor(executor: CommandExecutorFn) {
    this.executor = executor;
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
