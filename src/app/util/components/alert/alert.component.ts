import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Query,
  ViewChild,
} from '@angular/core';
import { AlertService } from './alert.service';
import { map, tap } from 'rxjs';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  providers: [
    { provide: AlertService, useFactory: () => AlertService.getInstance() },
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  private alertService = inject(AlertService);

  @ViewChild('dialog') dialog?: ElementRef<HTMLDialogElement>;

  getDialog() {
    if (!this.dialog) throw Error('Invalid State: element dialog not found.');
    return this.dialog.nativeElement;
  }

  protected alert$ = this.alertService.getAlerts().pipe(
    map((alert) => alert[0]),
    tap((alert) => {
      if (alert) this.getDialog().showModal();
    })
  );

  onClose() {
    console.log('on close component');
    const action = this.getDialog().returnValue;
    this.alertService.onClose(action);
  }
}
