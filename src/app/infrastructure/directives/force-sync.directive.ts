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
    
    const elementValue: string = this.element.value;

    if (elementValue.split('').filter((c) => c === '.' || c === ',').length > 1) {
      return true;
    }

    if (elementValue === this.value + '.' || elementValue === this.value + ',') {
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
