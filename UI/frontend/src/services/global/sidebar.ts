import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Sidebar {
  private _isSideBarOpen: WritableSignal<boolean> = signal(true);
  readonly isSideBarOpen = this._isSideBarOpen.asReadonly();

  constructor() {}

  updateState(state: boolean) {
    this._isSideBarOpen.set(state)

  }
}
