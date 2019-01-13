import { observable } from "mobx";

export class AppSettings {
  @observable language: string = "english";
  @observable isTestnet: boolean = false;
}

export const appSettings = new AppSettings();
