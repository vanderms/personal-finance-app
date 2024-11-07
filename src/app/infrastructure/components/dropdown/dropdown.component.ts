import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
} from '@angular/core';
import { DropdownOptionComponent } from '../dropdown-option/dropdown-option.component';
import { CommonModule } from '@angular/common';
import { v4 } from 'uuid';

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

  protected closed = signal(true);

  @Output() componentChange = new EventEmitter<string>();

  onChange(value: string) {
    this.componentChange.emit(value);
  }

  openDropdown() {
    this.closed.set(false);
  }

  closeDropdown() {
    this.closed.set(true);
  }
}
