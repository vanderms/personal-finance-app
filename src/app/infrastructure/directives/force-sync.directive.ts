import { Directive, DoCheck, Input, ElementRef, Renderer2, inject } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appForceValueSync]',
})
export class ForceValueSyncDirective implements DoCheck {
  @Input() value?: string;

  private renderer = inject(Renderer2);
  private element = inject(ElementRef).nativeElement;

  ngDoCheck(): void {
    if (this.value !== undefined && this.element.value !== this.value) {
      this.renderer.setProperty(this.element, 'value', this.value);
    }
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
