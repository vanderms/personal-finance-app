import { Component, inject } from '@angular/core';
import { HttpAdapter } from '../../../application/adapters/http.adapter';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  protected loadingStatus = toSignal(inject(HttpAdapter).getLoadingStatus());
}
