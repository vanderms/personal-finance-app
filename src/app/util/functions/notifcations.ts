import { UserNotification } from '../dtos/use-notification.dto';

export class BadRequestFormNotification implements UserNotification {
  readonly title = 'Error';
  readonly text = 'The form has errors, please correct them before submitting it again.';
  readonly type = 'danger';
  readonly primaryAction = 'Close';
  readonly secondaryAction = undefined;
}

export class UnknownErrorNotifcation implements UserNotification {
  readonly title = 'Error';
  readonly text = 'An unexpected error occurred. Please try again later.';
  readonly type = 'danger';
  readonly primaryAction = 'Close';
  readonly secondaryAction = undefined;
}

export class ResourceCreatedNotification implements UserNotification {
  constructor(private resource: string) {}
  readonly title = 'Success';
  get text() {
    return `${this.resource} was created successfully!`;
  }
  readonly type = 'info';
  readonly primaryAction = 'Continue';
  readonly secondaryAction = undefined;
}
