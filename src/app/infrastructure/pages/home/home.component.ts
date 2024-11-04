import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { LoginInteractor } from '../../../application/usecases/login.interactor';
import { SignupInteractor } from '../../../application/usecases/signup.interactor';
import { IconComponent } from '../../components/icon/icon.component';
import { FormFieldDirective } from '../../directives/form-field.directive';
import { IdHashPipe, IdHashSetPipe } from '../../pipes/id-hash-pipe.pipe';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { UserAdapter } from '../../../application/adapters/user.adapter';
import { firstValueFrom } from 'rxjs';

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
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  private signupInteractor = inject(SignupInteractor);

  private loginInteractor = inject(LoginInteractor);

  private userAdapter = inject(UserAdapter);

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

  isSignupAcessor(x: object | undefined): x is InnerSignal<HomePageComponent['signupAcessors']> {
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

  async ngOnInit() {
    const user = await firstValueFrom(this.userAdapter.getCurrentUser());
    if (user) this.routerService.navigate(['overview']);
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
