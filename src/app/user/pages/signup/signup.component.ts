import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertService } from '../../../util/components/alert/alert.service';
import { IconComponent } from '../../../util/components/icon/icon.component';
import {
  IdHashPipe,
  IdHashSetPipe,
} from '../../../util/pipes/id-hash-pipe.pipe';
import { HttpService } from '../../../util/services/http.service';
import { SignupService } from './signup.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    RouterModule,
    IdHashPipe,
    IdHashSetPipe,
  ],
  providers: [
    {
      provide: SignupService,
      useFactory: () =>
        SignupService.getInstance(
          HttpService.getInstance(),
          AlertService.getInstance()
        ),
    },
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private signupService = inject(SignupService);

  protected userData$ = this.signupService.getState();

  protected passwordVisible = signal(false);

  protected passwordType = computed(() => {
    return this.passwordVisible() ? 'text' : 'password';
  });

  setName(username: string) {
    this.signupService.patchUser({ username });
  }

  blurName() {
    this.signupService.patchTouched({ username: true });
  }

  setPassword(password: string) {
    this.signupService.patchUser({ password });
  }

  blurPassword() {
    this.signupService.patchTouched({ password: true });
  }

  setEmail(email: string) {
    this.signupService.patchUser({ email });
  }

  blurEmail() {
    this.signupService.patchTouched({ email: true });
  }

  submitForm(e: Event) {
    e.preventDefault();
    this.signupService.signUp();
  }
}
