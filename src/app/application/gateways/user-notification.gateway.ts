import { Observable } from 'rxjs';
import { UserNotification } from '../../util/dtos/use-notification.dto';

export abstract class UserNotificationGateway {
  abstract getAlerts(): Observable<UserNotification[]>;
  abstract push(alert: UserNotification): Promise<string>;
  abstract resolve(action: string): void;
}
