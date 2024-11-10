import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, IconComponent, RouterModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NavComponent {
  @Input({ required: true }) active:
    | 'Overview'
    | 'Transactions'
    | 'Budgets'
    | 'Pots'
    | 'Recurring bills' = 'Overview';

  protected readonly links = [
    { text: 'Overview', link: '/overview', icon: 'house' },
    { text: 'Transactions', link: '/transactions', icon: 'arrows-down-up' },
    { text: 'Budgets', link: '/budgets', icon: 'chart-donut' },
    { text: 'Pots', link: '/pots', icon: 'jar-fill' },
    { text: 'Recurring bills', link: '/recurring-bills', icon: 'receipt' },
  ];
}
