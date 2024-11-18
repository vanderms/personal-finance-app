import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavComponent } from '../../../components/nav/nav.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, NavComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
