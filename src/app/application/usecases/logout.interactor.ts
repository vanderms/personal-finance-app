import { Singleton } from '../../util/decorators/singleton.decorator';
import { HttpAdapter } from '../adapters/http.adapter';

@Singleton()
export class LogoutInteractor {
  constructor(private http: HttpAdapter) {}
}
