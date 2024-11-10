export interface UserNotification {
  get title(): string;
  get text(): string | string[];
  get type(): 'info' | 'danger';
  get primaryAction(): string;
  get secondaryAction(): string | undefined;
}
