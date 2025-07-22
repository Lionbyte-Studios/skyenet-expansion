export class ChatCommandValidationError {
    private _message: string;
    private _cursor: number;

    constructor(message: string, cursor: number) {
        this._message = message;
        this._cursor = cursor;
    }

    get message(): string {
        return this._message;
    }
    get cursor(): number {
        return this._cursor;
    }
}

export class ChatCommand {
    private readonly name: string;
    private arguments: ChatCommandArgument[];

    constructor(name: string) {
        this.name = name;
        this.arguments = [];
    }
    
    public getName(): string {
        return this.name;
    }

    public addArgument(name: string, argument: ChatCommandArgumentType, required?: boolean) {
        const arg = new ChatCommandArgument(name, required === undefined ? false : required);
        arg.setType(argument);
        this.arguments.push(arg);
        return this;
    }

    public validate(command: string): true | false | ChatCommandValidationError {
        let cursor = 0;
        let commandArgs: string = command;
        if(commandArgs.startsWith("/")) commandArgs = commandArgs.substring(1);
        if(!commandArgs.includes(" ") && this.arguments[0].required === true) return new ChatCommandValidationError(`Argument 0 of "${command}" is required but was not provided.`, cursor);
        const firstSpace = commandArgs.indexOf(" ");
        const commandName = commandArgs.substring(0, firstSpace);
        if(commandName !== this.name) return false;
        commandArgs = commandArgs.substring(firstSpace + 1);
        commandArgs = commandArgs.trim();
        let i;
        for(i = 0; cursor !== command.length - 1; i++) {
            if(!(i < this.arguments.length)) return new ChatCommandValidationError("Encountered trailing data", cursor);
            const type = this.arguments[i].type;
            if(type === undefined) {
                return new ChatCommandValidationError(`Type of argument ${i} is not specified.`, cursor);
            }
            const valid = type.validate(commandArgs, cursor);
            if(valid === true) {
                console.log("Cursor before arg end: " + cursor + " | String before arg end: " + commandArgs);
                cursor = type.getArgumentEnd(commandArgs, cursor);
                console.log("Arg end: " + cursor);
                if(cursor === commandArgs.length) {
                    if(i + 1 < this.arguments.length && this.arguments[i].required === true) return new ChatCommandValidationError(`Argument ${i + 1} is required but was not provided.`, cursor);
                    return true;
                }
                while(commandArgs.charAt(cursor) === " ") cursor++;
                continue;
            }
            else {
                return new ChatCommandValidationError(valid, cursor);
            }
        }
        return true;
    }
}

export class ChatCommandArgument {
    private _name: string;
    private _type: ChatCommandArgumentType | undefined;
    private _required: boolean;
    
    constructor(name: string, required?: boolean) {
        this._name = name;
        if(required !== undefined) this._required = required;
        else this._required = false;
    }

    get name(): string {
        return this._name;
    }
    get required(): boolean {
        return this._required;
    }

    public setType(type: ChatCommandArgumentType) {
        this._type = type;
    }

    get type(): ChatCommandArgumentType | undefined {
        return this._type;
    }
}

export abstract class ChatCommandArgumentType {
    constructor() {}
    /**
     * @param command The entire command string
     * @param cursor Where the first character of the detected argument is
     * @returns True if the validation succeeded (the argument is valid), a string explanaing the error otherwise
     */
    public abstract validate(command: string, cursor: number): true | string;
    /**
     * @param command The entire command string
     * @param cursor Where the first character of the detected argument is
     * @returns Where the argument ends (last char of the argument)
     */
    public abstract getArgumentEnd(command: string, cursor: number): number;

    /**
     * Utility function
     * @param command The entire command string
     * @param cursor First char
     * @returns All characters until a space (`' '`) is detected
     */
    protected allUntilSpace(command: string, cursor: number): string {
        return command.substring(cursor, this.getSpacePos(command, cursor));
    }

    /**
     * Utility function
     * @param command The entire command string
     * @param cursor First char
     * @returns Number of characters until a space (`' '`) is detected
     */
    protected getSpacePos(command: string, cursor: number): number {
        let i: number;
        for(i = cursor; i < command.length; i++) {
            if(command[i] === " ") break;
        }
        return i;
    }
}

export class StringArgumentType extends ChatCommandArgumentType {
    public validate(command: string, cursor: number): true | string {
        const str = this.allUntilSpace(command, cursor);
        if(str.trim().length === 0) return `String "${str}" only consists of whitespace.`;
        return true;
    }
    public getArgumentEnd(command: string, cursor: number): number {
        return this.getSpacePos(command, cursor);
    }
}

export class IntegerArgumentType extends ChatCommandArgumentType {
    public validate(command: string, cursor: number): true | string {
        const str = this.allUntilSpace(command, cursor);
        const int = parseInt(str);
        if(isNaN(int)) {
            return `Expected a valid integer, got "${str}".`;
        }
        return true;
    }
    public getArgumentEnd(command: string, cursor: number): number {
        return this.getSpacePos(command, cursor);
    }
}

export class FloatArgumentType extends ChatCommandArgumentType {
    public validate(command: string, cursor: number): true | string {
        const str = this.allUntilSpace(command, cursor);
        const float = parseFloat(str);
        if(isNaN(float)) {
            return `Expected a valid float, got "${str}".`;
        }
        return true;
    }
    public getArgumentEnd(command: string, cursor: number): number {
        return this.getSpacePos(command, cursor);
    }
}

/**
 * Everything until the end of the command
 */
export class GreedyStringArgumentType extends ChatCommandArgumentType {
    public validate(command: string, cursor: number): true | string {
        const str = command.substring(cursor);
        if(str.trim().length === 0) return `String "${str}" only consists of whitespace.`;
        return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getArgumentEnd(command: string, cursor: number): number {
        return command.length - 1;
    }
}