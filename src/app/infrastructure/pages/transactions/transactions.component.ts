import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavComponent } from '../../components/nav/nav.component';
import { DialogComponent } from '../../components/dialog/dialog.component';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, NavComponent, DialogComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent {}
