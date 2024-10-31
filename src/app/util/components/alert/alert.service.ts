import { BehaviorSubject, map } from 'rxjs';

export interface Alert {
  title: string;
  text: string | string[];
  type: 'info' | 'danger';
  primaryAction: string;
  secondaryAction?: string;
}

export class AlertService {
  static instance?: AlertService;

  static getInstance() {
    if (!this.instance) this.instance = new AlertService();
    return this.instance;
  }

  private alerts = new BehaviorSubject<
    Array<{ alert: Alert; resolve: (value: string) => void }>
  >([]);

  getAlerts() {
    return this.alerts.pipe(
      map((alerts) => alerts.map((alert) => alert.alert))
    );
  }

  push(alert: Alert) {
    return new Promise((resolve) => {
      this.alerts.next([...this.alerts.value, { alert, resolve }]);
    });
  }

  onClose(action: string) {
    const next = this.alerts.value[0];

    if (!next) {
      const errorMessage =
        'Invalid State: there should be at leat one alert on the queue';
      return console.error(errorMessage);
    }

    next.resolve(action);
    this.alerts.next(this.alerts.value.slice(1));
  }
}
