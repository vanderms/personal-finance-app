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
import { SignupClientService } from '../../signup.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, IconComponent, RouterModule],
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

  setPassword(password: string) {
    this.signupService.patchUser({ password });
  }

  setEmail(email: string) {
    this.signupService.patchUser({ email });
  }
}
