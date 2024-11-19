import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  EventEmitter,
  input,
  Output,
  signal
} from '@angular/core';
import { v4 } from 'uuid';
import { DropdownOptionComponent } from '../dropdown-option/dropdown-option.component';

@Component({
  selector: 'ui-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
  id = v4();

  options = contentChildren(DropdownOptionComponent);

  name = input.required<string>();

  value = input<string>();

  _closed = signal(true);

  get closed() {
    return this._closed.asReadonly();
  }

  @Output() componentChange = new EventEmitter<string>();

  @Output() componentBlur = new EventEmitter();

  onChange(value: string) {
    this.componentChange.emit(value);
  }

  onClick(e: MouseEvent) {
    if (e.clientX || e.clientY) {
      this.closeDropdown();
    }
  }

  openDropdown() {
    this._closed.set(false);
  }

  closeDropdown() {
    this._closed.set(true);
    this.componentBlur.emit();
  }
}
