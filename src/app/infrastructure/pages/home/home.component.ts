import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { LoginInteractor } from '../../../application/usecases/login.interactor';
import { SignupInteractor } from '../../../application/usecases/signup.interactor';
import { IconComponent } from '../../components/icon/icon.component';
import { FormFieldDirective } from '../../directives/form-field.directive';
import { IdHashPipe, IdHashSetPipe } from '../../pipes/id-hash-pipe.pipe';
import {
  HttpGatewayProvider,
  LoginInteractorProvider,
  SignupInteractorProvider,
  UserNotificationGatewayProvider,
} from '../../providers/providers.util';
import { HomeLayoutComponent } from './home-layout/home-layout.component';

type InnerSignal<T> = T extends Signal<infer U> ? U : never;

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    HomeLayoutComponent,
    RouterModule,
    IdHashPipe,
    IdHashSetPipe,
    FormFieldDirective,
  ],
  providers: [
    HttpGatewayProvider,
    UserNotificationGatewayProvider,
    SignupInteractorProvider,
    LoginInteractorProvider,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private signupInteractor = inject(SignupInteractor);

  private loginInteractor = inject(LoginInteractor);

  private routerService = inject(Router);

  protected signupAcessors = toSignal(this.signupInteractor.getStateAcessors());

  protected loginAcessors = toSignal(this.loginInteractor.getStateAcessors());

  private page = signal<'login' | 'signup'>('signup');

  protected getPage() {
    return this.page.asReadonly();
  }

  protected setPage(page: 'login' | 'signup') {
    this.page.set(page);
    this.markAllAsUnTouched();
  }

  protected formAcessors = computed(() => {
    if (this.page() === 'signup') return this.signupAcessors();
    return this.loginAcessors();
  });

  protected titleText = computed(() => {
    if (this.page() === 'signup') return 'Get Started';
    return 'Login';
  });

  protected buttonText = computed(() => {
    if (this.page() === 'signup') return 'Create Account';
    return 'Login';
  });

  isSignupAcessor(
    x: object | undefined
  ): x is InnerSignal<HomePageComponent['signupAcessors']> {
    return !!x && 'email' in x;
  }

  protected passwordVisible = signal(false);

  protected passwordType = computed(() => {
    return this.passwordVisible() ? 'text' : 'password';
  });

  protected touched = {
    username: signal(false),
    email: signal(false),
    password: signal(false),
  };

  private markAllAsTouched() {
    this.touched.email.set(true);
    this.touched.password.set(true);
    this.touched.username.set(true);
  }

  private markAllAsUnTouched() {
    this.touched.email.set(false);
    this.touched.password.set(false);
    this.touched.username.set(false);
  }

  async submitForm(e: Event) {
    e.preventDefault();
    if (this.page() === 'signup') {
      this.createAccount();
    }
  }

  async createAccount() {
    const success = await this.signupInteractor.signUp();
    if (success) {
      this.routerService.navigate(['overview']);
    } else {
      this.markAllAsTouched();
    }
  }
}
