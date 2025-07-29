import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Sidebar {
  private _isSideBarOpen: WritableSignal<boolean> = signal(false);
  readonly isSideBarOpen = this._isSideBarOpen.asReadonly();

  constructor() {}

  updateState() {
    this._isSideBarOpen.update((prev) => !prev);
  }
}
