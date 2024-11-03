import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './infrastructure/components/alert/alert.component';
import { UserNotificationGatewayImpl } from './infrastructure/gateways/user-notification.gateway.impl';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'personal-finance-app';
  
}
