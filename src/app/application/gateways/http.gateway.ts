import { Observable } from 'rxjs';
import { RestResponse } from '../../util/dtos/rest-response.dto';

export abstract class HttpGateway {
  abstract getLoadingStatus(): Observable<'loading' | 'idle'>;

  abstract get<TReturnType>(url: string): Promise<RestResponse<TReturnType>>;

  abstract post<TReturnType>(
    url: string,
    body: unknown
  ): Promise<RestResponse<TReturnType>>;

  abstract delete<TReturnType>(url: string): Promise<RestResponse<TReturnType>>;

  abstract put<TReturnType>(
    url: string,
    body: unknown
  ): Promise<RestResponse<TReturnType>>;
}
