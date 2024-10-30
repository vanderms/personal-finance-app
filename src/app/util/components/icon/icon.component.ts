import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal
} from '@angular/core';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [SafeHtmlPipe],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @Input({ required: true }) iconName: string = '';
  svgContent = signal<string | null>(null);

  ngOnInit(): void {
    fetch(`icons/${this.iconName}.svg`)
      .then((response) => response.text())
      .then((svg) => this.svgContent.set(svg));
  }
}
