import { clientManager } from "../../Main";

export class ClientSettings {
  public superKeyEnabled: boolean = false;
  public superKey: string = "Backslash";
  public save() {
    clientManager.clientStorage.set("settings", JSON.stringify(this));
  }
  public static from(value: string): ClientSettings {
    let json: { superKeyEnabled: boolean; superKey: string };
    try {
      json = JSON.parse(value);
    } catch (e) {
      console.error(e);
      return new ClientSettings();
    }
    const clientSettings = new ClientSettings();
    clientSettings.superKey = json.superKey;
    clientSettings.superKeyEnabled = json.superKeyEnabled;
    return clientSettings;
  }
}
