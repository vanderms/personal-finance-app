import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { IconComponent } from '../icon/icon.component';

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
  private router = inject(Router);

  activeLink = signal(this.router.url);

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => event.urlAfterRedirects),
        tap((route) => this.activeLink.set(route)),
        takeUntilDestroyed(),
      )
      .subscribe();

    effect(() => {
      const active = this.activeLink();
      console.log(`[NavComponent.constructor.effect] current route: ${active}`);
    });
  }

  protected readonly links = [
    { text: 'Overview', link: '/overview', icon: 'house' },
    { text: 'Transactions', link: '/transactions', icon: 'arrows-down-up' },
    { text: 'Budgets', link: '/budgets', icon: 'chart-donut' },
    { text: 'Pots', link: '/pots', icon: 'jar-fill' },
    { text: 'Recurring bills', link: '/recurring-bills', icon: 'receipt' },
  ];

  isActive(link: string, current: string | null) {
    return `/dashboard${link}` === current;
  }
}
