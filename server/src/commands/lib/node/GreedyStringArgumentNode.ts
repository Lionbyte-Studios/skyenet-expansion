import { StringReader } from "../CommandStringReader";
import { ArgumentCommandNode } from "./ArgumentCommandNode";
import { CommandExecutorFn, CommandRequiresFn } from "./CommandNode";

export class GreedyStringArgumentNode extends ArgumentCommandNode<string> {
  public argument_name: string;
  constructor(
    executor: CommandExecutorFn,
    requires: CommandRequiresFn,
    argument_name: string,
  ) {
    super(executor, requires);
    this.argument_name = argument_name;
  }

  public parse(reader: StringReader): number | undefined {
    const str = reader.currentString.substring(
      reader.cursor,
      reader.currentString.length,
    );
    if (str.length === 0) return undefined;
    this.argument = str;
    return reader.currentString.length - 1;
  }

  public getArgument(): string {
    if (this.argument === undefined)
      throw new Error("Argument is not defined.");
    return this.argument;
  }
}
