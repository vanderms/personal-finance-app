import { InjectionToken } from '@angular/core';
import { environment } from './env';

export const EnvironmentToken = new InjectionToken('environment', {
  providedIn: 'root',
  factory: () => environment,
});
