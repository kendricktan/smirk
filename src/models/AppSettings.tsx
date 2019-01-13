import { observable } from "mobx";

export class AppSettings {
  @observable language = "english";
}

export const appSettings = new AppSettings();
