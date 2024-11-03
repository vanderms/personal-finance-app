import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { LoginInteractor } from '../../../application/usecases/login.interactor';
import { SignupInteractor } from '../../../application/usecases/signup.interactor';
import { IconComponent } from '../../components/icon/icon.component';
import { FormFieldDirective } from '../../directives/form-field.directive';
import { IdHashPipe, IdHashSetPipe } from '../../pipes/id-hash-pipe.pipe';
import {
  HttpGatewayProvider,
  UserNotificationGatewayProvider,
  SignupInteractorProvider,
  LoginInteractorProvider,
} from '../../providers/providers.util';

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

  protected signupAcessors = toSignal(this.signupInteractor.getStateAcessors());

  protected loginAcessors = toSignal(this.loginInteractor.getStateAcessors());

  protected page = signal<'login' | 'signup'>('signup');

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

  constructor() {
    effect(() => {
      this.page();
    });
  }

  log<T>(value: T): T {
    console.log(value);
    return value;
  }

  submitForm(e: Event) {
    e.preventDefault();
    this.signupInteractor.signUp();
  }
}
