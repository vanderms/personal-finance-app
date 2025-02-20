import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { FailedRequestError } from '../../util/errors/failed-request.error';
import { InvalidResponseError } from '../../util/errors/invalid-response.error';
import { isRestResponse, RestResponse } from '../../util/dtos/rest-response.dto';
import { HttpAdapter } from '../../application/adapters/http.adapter';
import { Singleton } from '../../util/decorators/singleton.decorator';

@Singleton()
export class HttpAdapterImpl extends HttpAdapter {
  private API = 'https://personal-finance-app-drx.pages.dev/api/v1/routes/';

  private loadingCounter = new BehaviorSubject(0);

  private loadingStatus: Observable<'loading' | 'idle'> = this.loadingCounter.pipe(
    map((count) => (count > 0 ? 'loading' : 'idle')),
  );

  getLoadingStatus() {
    return this.loadingStatus;
  }

  private push() {
    this.loadingCounter.next(this.loadingCounter.value + 1);
  }

  private pop() {
    this.loadingCounter.next(Math.max(this.loadingCounter.value - 1, 0));
  }

  private unauthenticatedResponse = new Subject<RestResponse>();

  override getUnauthenticatedResponse(): Observable<RestResponse> {
    return this.unauthenticatedResponse.asObservable();
  }

  private extractErrorMessage(error: unknown): string {
    if (typeof error === 'string') {
      return error;
    } else if (error instanceof Error) {
      return error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    return 'An unexpected error occurred while trying to fetch the server.';
  }

  private async request<TReturnType>(
    url: string,
    options?: RequestInit,
  ): Promise<RestResponse<TReturnType>> {
    this.push();
    try {
      const response = await fetch(`${this.API}${url}`, options);

      const json = await response.json();

      if (isRestResponse(json)) {
        if (response.status === 401) {
          this.unauthenticatedResponse.next(json);
        }

        return json as RestResponse<TReturnType>;
      }

      throw new InvalidResponseError('Invalid response type: expecting RestResponse<T>.');
    } catch (error) {
      //
      if (error instanceof InvalidResponseError) {
        throw error;
      }

      const message = this.extractErrorMessage(error);
      throw new FailedRequestError(message);
    } finally {
      this.pop();
    }
  }

  async get<TReturnType>(url: string): Promise<RestResponse<TReturnType>> {
    return this.request<TReturnType>(url);
  }

  async post<TReturnType>(url: string, body: unknown): Promise<RestResponse<TReturnType>> {
    return this.request<TReturnType>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }
  async delete<TReturnType>(url: string): Promise<RestResponse<TReturnType>> {
    return this.request<TReturnType>(url, {
      method: 'DELETE',
    });
  }

  async put<TReturnType>(url: string, body: unknown): Promise<RestResponse<TReturnType>> {
    return this.request<TReturnType>(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }
}
