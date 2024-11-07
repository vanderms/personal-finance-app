import { BehaviorSubject, map } from 'rxjs';
import { Singleton } from '../../util/decorators/singleton.decorator';
import { UserNotification } from '../../util/dtos/use-notification.dto';
import { UserNotificationAdapter } from '../../application/adapters/user-notification.adapter';

@Singleton()
export class UserNotificationAdapterImpl extends UserNotificationAdapter {
  private state = new BehaviorSubject<
    Array<{ alert: UserNotification; resolve: (value: string) => void }>
  >([]);

  private alerts$ = this.state.pipe(map((alerts) => alerts.map((alert) => alert.alert)));

  override getNotifications() {
    return this.alerts$;
  }

  override push(alert: UserNotification): Promise<string> {
    return new Promise((resolve) => {
      this.state.next([...this.state.value, { alert, resolve }]);
    });
  }

  override resolve(action: string) {
    const next = this.state.value[0];
    console.log(action);

    if (!next) {
      const errorMessage = 'Invalid State: there should be at leat one alert on the queue';
      return console.error(errorMessage);
    }

    next.resolve(action);
    this.state.next(this.state.value.slice(1));
  }
}
