import { StringReader } from "../CommandStringReader";
import { ArgumentCommandNode } from "./ArgumentCommandNode";
import { CommandExecutorFn } from "./CommandNode";

export class IntegerArgumentNode extends ArgumentCommandNode<number> {
  public argument_name: string;
  constructor(executor: CommandExecutorFn, argument_name: string) {
    super(executor);
    this.argument_name = argument_name;
  }

  public parse(reader: StringReader): number | undefined {
    const spaceIndex = reader.currentString.indexOf(" ", reader.cursor);
    const str = reader.currentString.substring(
      reader.cursor,
      spaceIndex === -1 ? reader.currentString.length : spaceIndex,
    );
    if (str.length === 0) return undefined;
    this.argument = parseInt(str);
    return spaceIndex === -1 ? reader.currentString.length - 1 : spaceIndex;
  }

  public getArgument(): number {
    if (this.argument === undefined)
      throw new Error("Argument is not defined.");
    return this.argument;
  }
}
