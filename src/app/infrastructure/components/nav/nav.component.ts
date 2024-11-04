import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, IconComponent],
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
    { text: 'Overview', icon: 'house' },
    { text: 'Transactions', icon: 'arrows-down-up' },
    { text: 'Budgets', icon: 'chart-donut' },
    { text: 'Pots', icon: 'jar-fill' },
    { text: 'Recurring bills', icon: 'receipt' },
  ];
}
