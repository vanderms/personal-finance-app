import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { BehaviorSubject, filter, firstValueFrom, fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  @Input({ required: true }) title = '';

  @Input({ required: true }) primaryAction = '';

  @Input() type: 'danger' | 'info' = 'info';

  @Input() secondaryAction?: string = 'TEste';

  private dialog$ = new BehaviorSubject<HTMLDialogElement | null>(null);

  filterDialog<T>(dialog: T | null): dialog is T {
    return !!dialog;
  }

  @ViewChild('dialog') set dialog(value: ElementRef<HTMLDialogElement>) {
    this.dialog$.next(value.nativeElement);
  }

  @Output() closeModal = new EventEmitter<string>();

  onClose(dialog: HTMLDialogElement) {
    console.log(dialog.returnValue);
    this.closeModal.emit(dialog.returnValue);
  }

  async showModal(): Promise<string> {
    const dialog = await firstValueFrom(
      this.dialog$.pipe(filter((dialog) => this.filterDialog(dialog))),
    );

    dialog.showModal();

    const closeEvent = fromEvent(dialog, 'close').pipe(map(() => dialog.returnValue));

    const response = await firstValueFrom(closeEvent);

    dialog.returnValue = '';

    return response;
  }
}
