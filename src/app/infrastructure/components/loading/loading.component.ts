import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, filter, tap } from 'rxjs';
import { HttpAdapter } from '../../../application/adapters/http.adapter';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  private dialog$ = new BehaviorSubject<HTMLDialogElement | undefined>(undefined);

  @ViewChild('dialog') set _dialog(value: ElementRef<HTMLDialogElement>) {
    this.dialog$.next(value.nativeElement);
  }

  constructor(http: HttpAdapter) {
    const dialog = this.dialog$.pipe(filter(<T>(x: T | undefined): x is T => !!x));

    combineLatest([dialog, http.getLoadingStatus()])
      .pipe(
        tap((tuple) => this._controlSpinner(tuple)),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  _controlSpinner(tuple: [HTMLDialogElement, 'loading' | 'idle']) {
    const [dialog, status] = tuple;

    switch (status) {
      case 'loading':
        return dialog.showModal();
      case 'idle':
        return dialog.close();
    }
  }
}
