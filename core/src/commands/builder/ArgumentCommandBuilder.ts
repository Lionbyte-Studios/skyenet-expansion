import { CommandNode } from "../lib/node/CommandNode";
import { CommandBuilder } from "./CommandBuilder";

export abstract class ArgumentCommandBuilder extends CommandBuilder {
  protected abstract argument_name: string;
  public abstract build(): CommandNode;
}
