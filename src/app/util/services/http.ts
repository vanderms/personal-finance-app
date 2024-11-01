import { Observable } from 'rxjs';
import { RestResponse } from '../types/api-responses.type';

export interface HttpService {
  getLoadingStatus(): Observable<'loading' | 'idle'>;

  get<TReturnType>(url: string): Promise<RestResponse<TReturnType>>;

  post<TReturnType>(
    url: string,
    body: unknown
  ): Promise<RestResponse<TReturnType>>;

  delete<TReturnType>(url: string): Promise<RestResponse<TReturnType>>;

  put<TReturnType>(
    url: string,
    body: unknown
  ): Promise<RestResponse<TReturnType>>;
}
