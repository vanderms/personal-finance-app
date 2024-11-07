import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, combineLatest, filter, firstValueFrom, map, startWith, tap } from 'rxjs';
import { UserNotificationAdapter } from '../../../application/adapters/user-notification.adapter';
import { DialogComponent } from '../dialog/dialog.component';
import { UserNotification } from '../../../util/dtos/use-notification.dto';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  private alertService = inject(UserNotificationAdapter);

  private child = new BehaviorSubject<DialogComponent | null>(null);

  private dialogComponent$ = this.child.pipe(
    filter(<T>(dialog: T | null): dialog is T => !!dialog),
  );

  @ViewChild(DialogComponent) set dialogComponent(value: DialogComponent) {
    this.child.next(value);
  }

  protected alert$ = combineLatest([
    this.alertService.getNotifications(),
    this.dialogComponent$,
  ]).pipe(
    filter(([alerts]) => !!alerts[0]),
    tap(([_, dialog]) => dialog.showModal()),
    map(([alert]) => alert[0]),
    startWith({
      title: '',
      text: '',
      primaryAction: '',
      type: 'info',
    } as UserNotification),
  );

  async onClose(value: string) {
    this.alertService.resolve(value);
  }
}
