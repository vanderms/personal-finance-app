import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { IconComponent } from '../../../util/components/icon/icon.component';
import { RouterModule } from '@angular/router';
import { SignupClientService } from './signup.service';
import {
  IdHashPipe,
  IdHashSetPipe,
} from '../../../util/pipes/id-hash-pipe.pipe';

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
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private signupService = inject(SignupClientService);

  user = this.signupService.user;

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

  get usernameErrors() {
    return this.signupService.getUsernameErrorMessage();
  }

  get emailErrors() {
    return this.signupService.getEmailErrorMessage();
  }

  get passwordErrors() {
    return this.signupService.getPasswordErrorMessage();
  }

  submitForm(e: Event) {
    e.preventDefault();
    this.signupService.signUp();
  }
}