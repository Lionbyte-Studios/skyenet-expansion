import { CommandNode } from "../lib/node/CommandNode";
import { StringArgumentNode } from "../lib/node/StringArgumentNode";
import { ArgumentCommandBuilder } from "./ArgumentCommandBuilder";

export class StringArgumentBuilder extends ArgumentCommandBuilder {
  protected argument_name: string;

  constructor(argument_name: string) {
    super();
    this.argument_name = argument_name;
  }

  public build(): CommandNode {
    const node = new StringArgumentNode(this.executor, this.argument_name);
    for (const child of this.children) {
      node.children.push(child.build());
    }
    return node;
  }
}
