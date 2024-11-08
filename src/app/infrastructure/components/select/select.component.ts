import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  dropdown = contentChild.required(DropdownComponent);

  label = input.required<string>();

  errors = input(new Set<string>());

  hints = input(new Set<string>());

  invalid = input(false);

  ariaLabel() {
    return `Open ${this.label()} dropdown to change selected value. Current selected: `;
  }

  onClick() {
    this.dropdown().openDropdown();
  }
}
