import { Player } from "../../entity/Player";
import { CommandBuilder } from "../builder/CommandBuilder";
import { StringReader } from "./CommandStringReader";
import { ArgumentCommandNode } from "./node/ArgumentCommandNode";
import type { CommandNode } from "./node/CommandNode";
import { RootCommandNode } from "./node/RootCommandNode";

export type CommandResult = number;

export abstract class CommandSource<T extends Player = Player> {
  playerID: string;
  socket_id: string;
  player: T;
  constructor(playerID: string, socket_id: string, player: T) {
    this.playerID = playerID;
    this.socket_id = socket_id;
    this.player = player;
  }

  public abstract sendMessage(message: string): void;
}

export class CommandManager {
  public rootNode: RootCommandNode;
  private context: CommandContext | undefined;
  constructor() {
    this.rootNode = new RootCommandNode((ctx: CommandContext) => {
      ctx.sendMessage("The root command node cannot be executed.");
      return 0;
    });
  }
  public registerCommand(command: CommandBuilder) {
    this.rootNode.children.push(command.build());
  }
  public executeCommandWithContext(
    command: string,
    context: CommandContext,
    source: CommandSource,
  ): CommandResult {
    return this.execNode(
      new StringReader(command),
      this.rootNode,
      context,
      source,
    );
  }
  public setGlobalContext(context: CommandContext) {
    this.context = context;
  }
  public runCommand(command: string, source: CommandSource): CommandResult {
    if (this.context === undefined)
      throw new Error(
        "context is undefined. use CommandManager#setGlobalContext() first!",
      );
    return this.execNode(
      new StringReader(command),
      this.rootNode,
      this.context,
      source,
    );
  }
  private execNode(
    reader: StringReader,
    node: CommandNode,
    context: CommandContext,
    source: CommandSource,
  ): CommandResult {
    if (node instanceof ArgumentCommandNode) {
      context.arguments.set(node.argument_name, node.getArgument());
    }
    if (!(node instanceof RootCommandNode)) {
      const parse_result = node.parse(reader);
      if (parse_result === undefined) return 0;
      if (parse_result === reader.currentString.length - 1)
        return node.executor(context, source);
      reader.cursor = parse_result + 1;
    }
    for (const child of node.children) {
      const child_parse_result = child.parse(reader);
      if (child_parse_result === undefined) continue;
      return this.execNode(reader, child, context, source);
    }
    return 0;
  }
}

export class CommandContext {
  private executionEnvironment: CommandExecutionEnvironment;
  public arguments: Map<string, unknown>;
  constructor(executionContext: CommandExecutionEnvironment) {
    this.executionEnvironment = executionContext;
    this.arguments = new Map();
  }
  public sendMessage(message: string) {
    this.executionEnvironment.sendMessage(message, this);
  }
  public getArgument<T>(argument_name: string): T {
    return this.arguments.get(argument_name) as T;
  }
}

export abstract class CommandExecutionEnvironment {
  public abstract sendMessage(message: string, context: CommandContext): void;
}
