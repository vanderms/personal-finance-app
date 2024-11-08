import { Directive, DoCheck, Input, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appForceValueSync]',
})
export class ForceValueSyncDirective implements DoCheck {
  @Input() value?: string;
  @Input() isNumber: boolean = false;

  private renderer = inject(Renderer2);
  
  private element = inject(ElementRef).nativeElement;

  ngDoCheck(): void {
    if (this.value !== undefined && this.element.value !== this.value && !this.isNumber) {
      this.renderer.setProperty(this.element, 'value', this.value);
    }

    if (this.shouldSyncNumber()) {
      this.renderer.setProperty(this.element, 'value', this.value);
    }
  }

  shouldSyncNumber() {
    if (!this.isNumber || this.value === undefined || this.value === this.element.value) {
      return false;
    }

    const elementValue: string = this.element.value.replace(',', '.');

    const amountOfDots = elementValue.split('').filter((c) => c === '.').length;

    if (amountOfDots !== 1) {
      return true;
    }

    const dotIndex = elementValue.indexOf('.');

    if (dotIndex === elementValue.length - 1) {
      return false;
    }

    const realElementValue = Number(elementValue);

    const componentValue = Number(this.value);

    console.log(realElementValue, componentValue);

    if (realElementValue === componentValue) {
      return false;
    }

    return true;
  }
}

@Directive({
  standalone: true,
  selector: '[appForceCheckedSync]',
})
export class ForceCheckedSyncDirective implements DoCheck {
  @Input() checked?: boolean;

  private renderer = inject(Renderer2);
  private element = inject(ElementRef).nativeElement;

  ngDoCheck(): void {
    if (this.checked !== undefined && this.element.checked !== this.checked) {
      this.renderer.setProperty(this.element, 'checked', this.checked);
    }
  }
}
