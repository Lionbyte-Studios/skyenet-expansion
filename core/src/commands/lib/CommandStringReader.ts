export class StringReader {
  public cursor: number;
  private _currentString: string;

  constructor(str: string, startAt?: number) {
    this._currentString = str;
    this.cursor = startAt === undefined ? 0 : startAt;
  }

  get currentString(): string {
    return this._currentString;
  }
}
