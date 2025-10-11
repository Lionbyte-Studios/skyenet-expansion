import { StringReader } from "../CommandStringReader";
import { CommandExecutorFn, CommandNode } from "./CommandNode";

export class LiteralCommandNode extends CommandNode {
  private literal: string;
  constructor(executor: CommandExecutorFn, literal: string) {
    super(executor);
    this.literal = literal;
  }
  public parse(reader: StringReader): number | undefined {
    const spaceIndex = reader.currentString.indexOf(" ", reader.cursor);
    const expectedLiteral = reader.currentString.substring(
      reader.cursor,
      spaceIndex === -1 ? reader.currentString.length : spaceIndex,
    );
    if (this.literal === expectedLiteral) {
      return spaceIndex === -1
        ? reader.currentString.length - 1
        : spaceIndex + 1;
    }
    return undefined;
  }
}
