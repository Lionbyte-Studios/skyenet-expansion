import { CommandNode } from "../lib/node/CommandNode";
import { LiteralCommandNode } from "../lib/node/LiteralCommandNode";
import { CommandBuilder } from "./CommandBuilder";

export class LiteralArgumentBuilder extends CommandBuilder {
  private literal: string;

  constructor(literal: string) {
    super();
    this.literal = literal;
  }

  public build(): CommandNode {
    const node = new LiteralCommandNode(
      this.executor,
      this.requiresFn,
      this.literal,
    );
    this.commonBuildLogic(node);
    return node;
  }
}
