import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './infrastructure/components/alert/alert.component';
import { ApplicationProviders } from './infrastructure/providers/providers.util';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertComponent],
  providers: [...ApplicationProviders],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'personal-finance-app';
}
