import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { v4 } from 'uuid';
import { ForceValueSyncDirective } from '../../directives/force-sync.directive';

@Component({
  selector: 'ui-textbox',
  standalone: true,
  imports: [CommonModule, ForceValueSyncDirective],
  templateUrl: './textbox.component.html',
  styleUrl: './textbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextboxComponent {
  @Input({ required: true }) label: string = '';
  @Input() set value(x: string | undefined | undefined) {
    this._value = x ?? '';
  }

  protected _value: string = '';

  @Input() type: 'text' | 'date' | 'number' | 'email' | 'password' | 'textarea' = 'text';
  @Input() name?: string;
  @Input() invalid: boolean = false;
  @Input() errors = new Set<string>();
  @Input() hints = new Set<string>();

  log<T>(x: T) {
    console.log(this.hints, x);
    return x;
  }

  @Input() action: string = '';

  id = {
    describedBy: v4(),
    field: v4(),
  };

  @Output() componentChange = new EventEmitter<string>();
  @Output() componentBlur = new EventEmitter();
}
