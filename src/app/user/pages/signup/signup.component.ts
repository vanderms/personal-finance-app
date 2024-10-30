import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent } from '../../../util/components/icon/icon.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {

  

}
