import { CommandNode } from "../lib/node/CommandNode";
import { IntegerArgumentNode } from "../lib/node/IntegerArgumentNode";
import { ArgumentCommandBuilder } from "./ArgumentCommandBuilder";

export class IntegerArgumentBuilder extends ArgumentCommandBuilder {
  protected argument_name: string;

  constructor(argument_name: string) {
    super();
    this.argument_name = argument_name;
  }

  public build(): CommandNode {
    const node = new IntegerArgumentNode(this.executor, this.argument_name);
    for (const child of this.children) {
      node.children.push(child.build());
    }
    return node;
  }
}
