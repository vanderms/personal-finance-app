import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { HttpAdapter } from '../../../application/adapters/http.adapter';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  protected dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected loadingStatus = inject(HttpAdapter)
    .getLoadingStatus()
    .pipe(
      tap((status) => this.controlSpinner(status)),
      takeUntilDestroyed(),
    )
    .subscribe();

  private controlSpinner(status: 'loading' | 'idle') {
    console.log(`[LoadingComponent.controlSpinner] setting spinner. Loading: ${status}.`);

    if (status === 'loading') {
      this.dialog().nativeElement.showModal();
    } //
    else {
      this.dialog().nativeElement.close();
    }
  }
}
