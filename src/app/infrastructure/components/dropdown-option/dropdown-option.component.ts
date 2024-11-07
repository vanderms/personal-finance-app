import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  TemplateRef,
  viewChild
} from '@angular/core';
import { DropdownComponent } from '../dropdown/dropdown.component';

@Component({
  standalone: true,
  selector: 'ui-dropdown-option',
  template: '<ng-template><ng-content/></ng-template>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownOptionComponent {
  template = viewChild.required(TemplateRef);

  value = input.required<string>();

  private dropdown = inject(DropdownComponent);

  get checked() {
    return this.dropdown.value() === this.value();
  }
}
