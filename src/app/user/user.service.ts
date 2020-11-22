import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { APIService } from '../services/api.service';
import { User } from '../models/user.model';
import { Role } from '../models/role.enum';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	private url = '/user';

	constructor(private api: APIService) {
	}

	getUsers(type: Role = null): Observable<Array<User>> {
		return this.loadUsers().pipe(map(u => {
			if (type) {
				return u.filter(f => f.role == type);
			}
			return u;
		}));
	}

	getUser(id: string): Observable<User> {
		return this.api.get<User>(`${this.url}/${id}`);
	}

	getInternalUserRoles(): Array<string> {
		return [Role.ADMIN, Role.USER];
	}

	enableOrDisableUser(id: string): Observable<User> {
		return this.api.put<User>(`${this.url}/state/${id}`, {} as User);
	}

	createUser(user: User): Observable<User> {
		return this.api.post<User>(this.url, user);
	}

	updateUser(user: User): Observable<any> {
		return this.api.put(`${this.url}/${user.id}`, user);
	}

	getMember(id: string) {
		return this.api.get<User>(`/members/member/${id}`);
	}

	private loadUsers(): Observable<Array<User>> {
		return this.api.get<Array<User>>(this.url);
	}
}
