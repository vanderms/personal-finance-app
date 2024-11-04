import { Observable } from 'rxjs';
import { UserNotification } from '../../util/dtos/use-notification.dto';

export abstract class UserNotificationAdapter {
  abstract getNotifications(): Observable<UserNotification[]>;
  abstract push(notification: UserNotification): Promise<string>;
  abstract resolve(action: string): void;
}
