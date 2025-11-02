import { StringReader } from "../CommandStringReader";
import { ArgumentCommandNode } from "./ArgumentCommandNode";
import { CommandExecutorFn, CommandRequiresFn } from "./CommandNode";

export class StringArgumentNode extends ArgumentCommandNode<string> {
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
    const spaceIndex = reader.currentString.indexOf(" ", reader.cursor);
    const str = reader.currentString.substring(
      reader.cursor,
      spaceIndex === -1 ? reader.currentString.length : spaceIndex,
    );
    if (str.length === 0) return undefined;
    this.argument = str;
    return spaceIndex === -1 ? reader.currentString.length - 1 : spaceIndex;
  }

  public getArgument(): string {
    if (this.argument === undefined)
      throw new Error("Argument is not defined.");
    return this.argument;
  }
}
