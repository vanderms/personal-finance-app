import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { LoginInteractor } from '../../../application/usecases/login.interactor';
import { SignupInteractor } from '../../../application/usecases/signup.interactor';
import { UserDTO } from '../../../domain/user.model';
import { IconComponent } from '../../components/icon/icon.component';
import { TextboxComponent } from '../../components/textbox/textbox.component';
import { HomeLayoutComponent } from './home-layout/home-layout.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, IconComponent, HomeLayoutComponent, RouterModule, TextboxComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private signupInteractor = inject(SignupInteractor);

  private loginInteractor = inject(LoginInteractor);

  private routerService = inject(Router);

  protected signupUser = toSignal(this.signupInteractor.getUser());

  protected loginUser = toSignal(this.loginInteractor.getUser());

  protected page = signal<'login' | 'signup'>('signup');

  protected getPage() {
    return this.page.asReadonly();
  }

  protected setPage(page: 'login' | 'signup') {
    this.page.set(page);
    this.markAllAsUnTouched();
  }

  protected user = computed(() => {
    if (this.page() === 'signup') return this.signupUser();
    return this.loginUser();
  });

  protected patchUser(user: UserDTO) {
    if (this.page() === 'signup') {
      return this.signupInteractor.patchUser(user);
    }
    return this.loginInteractor.patchUser(user);
  }

  protected titleText = computed(() => {
    if (this.page() === 'signup') return 'Get Started';
    return 'Login';
  });

  protected buttonText = computed(() => {
    if (this.page() === 'signup') return 'Create Account';
    return 'Login';
  });

  protected passwordVisible = signal(false);

  protected passwordType = computed(() => {
    return this.passwordVisible() ? 'text' : 'password';
  });

  protected touched = signal({
    username: false,
    email: false,
    password: false,
  });

  protected passwordHints = new Set(['Password must be at least 8 characters']);

  protected touch(value: { username?: boolean; email?: boolean; password?: boolean }) {
    this.touched.update((current) => ({ ...current, ...value }));
  }

  private markAllAsTouched() {
    this.touched.set({ username: true, email: true, password: true });
  }

  private markAllAsUnTouched() {
    this.touched.set({ username: false, email: false, password: false });
  }

  async submitForm(e: Event) {
    e.preventDefault();

    const send = {
      signup: () => this.signupInteractor.signUp(),
      login: () => this.loginInteractor.login(),
    };

    const success = await send[this.page()]();

    if (success) {
      this.routerService.navigate(['overview']);
    } else {
      this.markAllAsTouched();
    }
  }
}
