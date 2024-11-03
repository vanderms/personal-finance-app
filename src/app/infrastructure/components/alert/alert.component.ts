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
import { UserNotificationGateway } from '../../../application/gateways/user-notification.gateway';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  private alertService = inject(UserNotificationGateway);

  private dialog$ = new BehaviorSubject<HTMLDialogElement | null>(null);

  private nonNullDialog$ = this.dialog$.pipe(
    filter(<T>(dialog: T | null): dialog is T => !!dialog)
  );

  @ViewChild('dialog') set dialog(value: ElementRef<HTMLDialogElement>) {
    this.dialog$.next(value.nativeElement);
  }

  protected alert$ = combineLatest([
    this.alertService.getNotifications(),
    this.nonNullDialog$,
  ]).pipe(
    filter(([alerts]) => !!alerts[0]),

    tap(([_, dialog]) => dialog.showModal()),
    map(([alert]) => alert[0])
  );

  async onClose() {
    const dialog = await firstValueFrom(this.nonNullDialog$);
    console.log(dialog.returnValue);
    this.alertService.resolve(dialog.returnValue);
  }
}
