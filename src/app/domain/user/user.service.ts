import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';

export class UserService {
  static instance?: UserService;

  static getInstance() {
    if (!this.instance) this.instance = new UserService();
    return this.instance;
  }

  user = new BehaviorSubject<User | null>(null);

  getUser() {
    return this.user.asObservable();
  }

  setUser(user: User | null) {
    this.user.next(user);
  }
}
