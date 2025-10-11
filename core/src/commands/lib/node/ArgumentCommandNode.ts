import { CommandNode } from "./CommandNode";

export abstract class ArgumentCommandNode<T> extends CommandNode {
  public abstract argument_name: string;
  public argument: T | undefined = undefined;
  public abstract getArgument(): T;
}
