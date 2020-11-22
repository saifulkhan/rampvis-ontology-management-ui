import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

import { APIService } from './api.service';
import { User } from '../models/user.model';
import { UtilService } from './util.service';
import { Role } from '../models/role.enum';
import { ErrorHandler2Service } from './common/error-handler-2.service';
import { HTTP_ERROR_CODES } from '../models/http-error-codes.enum';
import { NotificationService } from './notification.service';

@Injectable()
export class AuthenticationService {
	private jwtHelperService: JwtHelperService;
	private user: User;
	private genericErrorMessage: any;

	constructor(
		private api: APIService,
		private utilService: UtilService,
		private errorHandler2Service: ErrorHandler2Service,
		private messagingService: NotificationService,
	) {

		this.user = null;
		this.jwtHelperService = new JwtHelperService();

		const errorCode: string = this.utilService.nameOf(() => HTTP_ERROR_CODES.SERVER_EXCEPTION);
		this.genericErrorMessage = { error: { code: errorCode } };
	}

	isAuthenticated(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const localToken: string = this.api.getToken();
			const isExpired: boolean = this.jwtHelperService.isTokenExpired(localToken);

			if (localToken && !isExpired) {
				return this.loadUser()
					.then(resolve)
					.catch(reject);
			}

			this.logout();
			reject();
		});
	}

	getUser(): User {
		return this.user;
	}

	getDefaultRoute(): string {
		return '/dashboard';
	}

	login(username: string, password: string): Promise<User> {
		const userInfo: any = {
			password: password,
			email: username
		};

		return new Promise((resolve, reject) => {
			this.api.post<any>('/auth/login', userInfo)
				.subscribe(data => {
						if (!data || !data.token) {
							this.logout();
							reject({ 
								status: this.errorHandler2Service.handleError(this.genericErrorMessage, false) 
							});
							return;
						}

						this.api.setToken(data.token);
						this.loadUser(true)
							.then(() => resolve(this.getUser()))
							.catch((error) => reject({ 
								status: this.errorHandler2Service.handleError(error || this.genericErrorMessage, false) 
							}));
					},
					(error) => reject({ status: this.errorHandler2Service.handleError(error || this.genericErrorMessage, false) }));

		});

	}

	logout(): void {
		this.messagingService.unsubscribe(this.messagingService.getRegistrationToken()).subscribe();
		this.api.logout();
		this.user = null;
	}

	private loadUser(reload: boolean = false): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const url: string = this.getUserUrl();

			if (this.user && !reload) {
				resolve(true);
			}

			this.api.get<User>(url).subscribe(
				(user: User) => {
					if (!user.id) {
						this.logout();
						reject();
						return;
					}
					this.user = user;
					resolve(true);
				},
				(error) => {
					this.logout();
					reject();
				});
		});

	}

	private getId(): string {
		const token = this.api.getToken();
		const decodeToken = this.jwtHelperService.decodeToken(token);
		return decodeToken['id'];
	}

	private getRole(): Role {
		const token = this.api.getToken();
		const decodeToken = this.jwtHelperService.decodeToken(token);

		console.log('decodeToken: ', decodeToken);
		return decodeToken['role'] as Role;
	}

	private getUserUrl(): string {
		return '/user/' + this.getId();
	}

}
