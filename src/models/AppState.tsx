import { observable } from "mobx";

export class AppState {
  @observable grinFound: boolean = false;
}

export const appState = new AppState();
