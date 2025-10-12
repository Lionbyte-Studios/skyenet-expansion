import { StringReader } from "../CommandStringReader";
import { ArgumentCommandNode } from "./ArgumentCommandNode";
import { CommandExecutorFn } from "./CommandNode";

type Coordinate = { type: "absolute" | "relative"; value: number };

export class CoordinatesArgumentNode extends ArgumentCommandNode<{
  x: Coordinate;
  y: Coordinate;
}> {
  public argument_name: string;
  constructor(executor: CommandExecutorFn, argument_name: string) {
    super(executor);
    this.argument_name = argument_name;
  }

  public parse(reader: StringReader): number | undefined {
    const firstSpaceIndex = reader.currentString.indexOf(" ", reader.cursor);
    const secondSpaceIndex = reader.currentString.indexOf(
      " ",
      firstSpaceIndex + 1,
    );
    if (firstSpaceIndex === -1) return undefined;
    if (firstSpaceIndex + 1 === reader.currentString.length) return undefined;

    const coord1 = reader.currentString.substring(
      reader.cursor,
      firstSpaceIndex,
    );
    const coord2 = reader.currentString.substring(
      firstSpaceIndex + 1,
      secondSpaceIndex === -1 ? reader.currentString.length : secondSpaceIndex,
    );

    this.argument = {
      x: { type: "absolute", value: 0 },
      y: { type: "absolute", value: 0 },
    };

    if (coord1.startsWith("~")) {
      this.argument.x.type = "relative";
      this.argument.x.value = parseInt(coord1.substring(1));
      if (isNaN(this.argument.x.value)) this.argument.x.value = 0;
    } else {
      this.argument.x.type = "absolute";
      this.argument.x.value = parseInt(coord1);
    }

    if (coord2.startsWith("~")) {
      this.argument.y.type = "relative";
      this.argument.y.value = parseInt(coord2.substring(1));
      if (isNaN(this.argument.y.value)) this.argument.y.value = 0;
    } else {
      this.argument.y.type = "absolute";
      this.argument.y.value = parseInt(coord2);
    }

    return secondSpaceIndex === -1
      ? reader.currentString.length - 1
      : secondSpaceIndex;
  }

  public getArgument() {
    if (this.argument === undefined)
      throw new Error("Argument is not defined.");
    return this.argument;
  }
}
