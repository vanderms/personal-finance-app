export type UserNotification = {
  title: string;
  text: string | string[];
  type: 'info' | 'danger';
  primaryAction: string;
  secondaryAction?: string;
};
