import { Observable } from 'rxjs';
import { User } from '../../domain/user.model';

export abstract class UserAdapter {
  abstract getCurrentUser(): Observable<User | null>;
}
