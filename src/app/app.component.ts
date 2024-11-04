import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertComponent } from './infrastructure/components/alert/alert.component';
import { ApplicationProviders } from './infrastructure/adapters/ioc.adapter';
import { LoadingComponent } from './infrastructure/components/loading/loading.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertComponent, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'personal-finance-app';
}
