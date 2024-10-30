import { Injectable, signal } from '@angular/core';

export interface Alert {
  title: string;
  text: string | string[];
  type: 'info' | 'danger';
  primaryAction: string;
  secondaryAction?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  alerts = signal<Array<{ alert: Alert; resolve: (value: string) => void }>>(
    []
  );

  push(alert: Alert) {
    return new Promise((resolve) => {
      this.alerts.update((current) => [...current, { alert, resolve }]);
    });
  }

  onClose(action: string) {
    const next = this.alerts()[0];

    if (!next) {
      const errorMessage =
        'Invalid State: there should be at leat one alert on the queue';
      return console.error(errorMessage);
    }

    next.resolve(action);
    this.alerts.update((current) => current.slice(1));
  }
}
