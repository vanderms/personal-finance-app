import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loadingStack = signal<object[]>([]);

  _loading = computed(() => {
    return this._loadingStack().length > 0;
  });

  get isLoading() {
    return this._loading;
  }

  push() {
    this._loadingStack.update((current) => [...current, {}]);
  }

  pop() {
    this._loadingStack.update((current) => current.slice(0, -1));
  }
}


