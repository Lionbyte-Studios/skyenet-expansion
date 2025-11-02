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
    const node = new StringArgumentNode(
      this.executor,
      this.requiresFn,
      this.argument_name,
    );
    this.commonBuildLogic(node);
    return node;
  }
}
