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

  private state = new BehaviorSubject<
    Array<{ alert: Alert; resolve: (value: string) => void }>
  >([]);

  alerts$ = this.state.pipe(
    map((alerts) => alerts.map((alert) => alert.alert))
  );

  getAlerts() {
    return this.alerts$;
  }

  push(alert: Alert) {
    return new Promise((resolve) => {
      this.state.next([...this.state.value, { alert, resolve }]);
    });
  }

  onClose(action: string) {
    const next = this.state.value[0];

    if (!next) {
      const errorMessage =
        'Invalid State: there should be at leat one alert on the queue';
      return console.error(errorMessage);
    }

    next.resolve(action);
    this.state.next(this.state.value.slice(1));
  }
}
