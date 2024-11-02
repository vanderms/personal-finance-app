import {
  Component,
  Directive,
  DoCheck,
  ElementRef,
  Host,
  Input,
  Optional,
  Renderer2,
} from '@angular/core';
import { StateAcessor } from '../misc/form-field';

@Component({
  template: ``,
})
export abstract class AbstractFieldAdapterComponent<
  T extends string | boolean
> {
  abstract setValue(value: T): void;
  abstract onChange(fn: (value: T) => void): void;
}

class InputTextFieldAdapter extends AbstractFieldAdapterComponent<string> {
  constructor(
    private renderer: Renderer2,
    private elem: HTMLInputElement | HTMLTextAreaElement,
    private changeFn: ((value: string) => void) | null = null
  ) {
    super();
    renderer.listen(elem, 'input', () => {
      if (this.changeFn) this.changeFn(this.elem.value);
    });
  }

  override setValue(value: string): void {
    this.renderer.setProperty(this.elem, 'value', value);
  }

  override onChange(fn: (value: string) => void): void {
    this.changeFn = fn;
  }
}

class SelectFieldAdapter extends AbstractFieldAdapterComponent<string> {
  constructor(
    private renderer: Renderer2,
    private elem: HTMLSelectElement,
    private changeFn: ((value: string) => void) | null = null
  ) {
    super();
    renderer.listen(elem, 'change', () => {
      if (this.changeFn) this.changeFn(this.elem.value);
    });
  }

  override setValue(value: string): void {
    this.renderer.setProperty(this.elem, 'value', value);
  }

  override onChange(fn: (value: string) => void): void {
    this.changeFn = fn;
  }
}

class InputRadioFieldAdapter extends AbstractFieldAdapterComponent<string> {
  constructor(
    private renderer: Renderer2,
    private elem: HTMLInputElement,
    private changeFn: ((value: string) => void) | null = null
  ) {
    super();
    renderer.listen(elem, 'change', () => {
      if (this.changeFn) this.changeFn(this.elem.value);
    });
  }

  override setValue(value: string): void {
    this.renderer.setProperty(this.elem, 'checked', value === this.elem.value);
  }

  override onChange(fn: (value: string) => void): void {
    this.changeFn = fn;
  }
}

class InputCheckboxFieldAdapter extends AbstractFieldAdapterComponent<boolean> {
  constructor(
    private renderer: Renderer2,
    private elem: HTMLInputElement,
    private changeFn: ((value: boolean) => void) | null = null
  ) {
    super();
    renderer.listen(elem, 'change', () => {
      if (this.changeFn) this.changeFn(this.elem.checked);
    });
  }

  override setValue(value: boolean): void {
    if (value) {
      this.renderer.setAttribute(this.elem, 'checked', 'true');
    } else {
      this.renderer.removeAttribute(this.elem, 'checked');
    }
  }

  override onChange(fn: (value: boolean) => void): void {
    this.changeFn = fn;
  }
}

const createFieldAdapter = <T extends string | boolean>(
  renderer: Renderer2,
  el: ElementRef,
  component: AbstractFieldAdapterComponent<T>
):
  | AbstractFieldAdapterComponent<boolean>
  | AbstractFieldAdapterComponent<string> => {
  const element = el.nativeElement;

  if (element instanceof HTMLInputElement && element.type === 'checkbox') {
    return new InputCheckboxFieldAdapter(renderer, element);
  } //
  else if (element instanceof HTMLInputElement && element.type === 'radio') {
    return new InputRadioFieldAdapter(renderer, element);
  } //
  else if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    return new InputTextFieldAdapter(renderer, element);
  } //
  else if (element instanceof HTMLSelectElement) {
    return new SelectFieldAdapter(renderer, element);
  } //
  else if (component) {
    return component as AbstractFieldAdapterComponent<string>;
  } else {
    throw new Error('Invalid State');
  }
};

@Directive({
  standalone: true,
  selector: '[appFormField]',
})
export class FormFieldDirective<T extends boolean | string> implements DoCheck {
  constructor(
    renderer: Renderer2,
    el: ElementRef,
    @Optional() @Host() component: AbstractFieldAdapterComponent<T>
  ) {
    this.customFormField = createFieldAdapter(
      renderer,
      el,
      component
    ) as AbstractFieldAdapterComponent<T>;
  }

  @Input({ required: true }) set appFormField(control: StateAcessor<T>) {
    this.customFormField.onChange((x: T) => control.setValue(x));

    this.control = control;
  }

  private control?: StateAcessor<T>;

  customFormField: AbstractFieldAdapterComponent<T>;

  ngDoCheck() {
    if (this.control) this.customFormField.setValue(this.control.getValue());
  }
}
