import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { SignupService } from '../../domain/user/signup.service';
import {
  AlertServiceProvider,
  HttpServiceProvider,
  LoginServiceProvider,
  SignupServiceProvider,
  UserServiceProvider,
} from '../../util/adapters/providers.util';
import { IconComponent } from '../../util/components/icon/icon.component';
import { FormFieldDirective } from '../../util/directives/form-field.directive';
import { IdHashPipe, IdHashSetPipe } from '../../util/pipes/id-hash-pipe.pipe';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { LoginService } from '../../domain/user/login.service';

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
    UserServiceProvider,
    HttpServiceProvider,
    AlertServiceProvider,
    SignupServiceProvider,
    LoginServiceProvider,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  private signupService = inject(SignupService);

  private loginService = inject(LoginService);

  protected signupAcessors = toSignal(this.signupService.getStateAcessors());

  protected loginAcessors = toSignal(this.loginService.getStateAcessors());

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

  constructor() {}

  submitForm(e: Event) {
    e.preventDefault();
    this.signupService.signUp();
  }
}
