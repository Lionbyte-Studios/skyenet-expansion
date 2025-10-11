import { StringReader } from "../CommandStringReader";
import { CommandNode } from "./CommandNode";

export class RootCommandNode extends CommandNode {
  public parse(reader: StringReader): number | undefined {
    /* The root command node should not be parsed */
    return undefined;
  }

  public override toString(): string {
    return `<root node c=${this.children.length}>`;
  }
}
