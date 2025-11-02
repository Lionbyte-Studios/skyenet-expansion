import { CommandNode } from "../lib/node/CommandNode";
import { CoordinatesArgumentNode } from "../lib/node/CoordinatesArgumentNode";
import { ArgumentCommandBuilder } from "./ArgumentCommandBuilder";

type Coordinate = { type: "absolute" | "relative"; value: number };
export type CoordinatesType = { x: Coordinate; y: Coordinate };

export class CoordinatesArgumentBuilder extends ArgumentCommandBuilder {
  protected argument_name: string;

  constructor(argument_name: string) {
    super();
    this.argument_name = argument_name;
  }

  public build(): CommandNode {
    const node = new CoordinatesArgumentNode(
      this.executor,
      this.requiresFn,
      this.argument_name,
    );
    this.commonBuildLogic(node);
    return node;
  }
}
