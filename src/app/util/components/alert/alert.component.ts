import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  firstValueFrom,
  map,
  tap,
} from 'rxjs';
import { AlertService } from './alert.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, IconComponent],
  providers: [
    { provide: AlertService, useFactory: () => AlertService.getInstance() },
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  private alertService = inject(AlertService);

  private dialog$ = new BehaviorSubject<HTMLDialogElement | null>(null);

  private nonNullDialog$ = this.dialog$.pipe(
    filter(<T>(dialog: T | null): dialog is T => !!dialog)
  );

  @ViewChild('dialog') set dialog(value: ElementRef<HTMLDialogElement>) {
    this.dialog$.next(value.nativeElement);
  }

  protected alert$ = combineLatest([
    this.alertService.getAlerts(),
    this.nonNullDialog$,
  ]).pipe(
    filter(([alerts]) => !!alerts[0]),

    tap(([_, dialog]) => dialog.showModal()),
    map(([alert]) => alert[0])
  );

  async onClose() {
    const dialog = await firstValueFrom(this.nonNullDialog$);
    console.log(dialog.returnValue);
    this.alertService.onClose(dialog.returnValue);
  }
}
