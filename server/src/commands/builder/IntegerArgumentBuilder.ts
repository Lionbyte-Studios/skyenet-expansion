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
    const node = new IntegerArgumentNode(
      this.executor,
      this.requiresFn,
      this.argument_name,
    );
    this.commonBuildLogic(node);
    return node;
  }
}
