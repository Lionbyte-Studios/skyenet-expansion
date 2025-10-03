export class ClientStorage {
  private storageMap: Map<string, string>;
  constructor() {
    this.storageMap = new Map();
    this.loadFromLocalStorage();
  }

  public loadFromLocalStorage() {
    const items = { ...localStorage };
    for (const item in items) {
      this.storageMap.set(item, items[item]);
    }
  }

  public clearAll() {
    localStorage.clear();
    this.storageMap.clear();
  }

  public get(key: string): string | undefined {
    const item = this.storageMap.get(key);
    if (item === undefined) return undefined;
    return item;
  }

  public set(key: string, value: unknown) {
    let stringValue;
    if (typeof value === "string") stringValue = value;
    else stringValue = JSON.stringify(value);
    this.storageMap.set(key, stringValue);
    localStorage.setItem(key, stringValue);
  }
}
