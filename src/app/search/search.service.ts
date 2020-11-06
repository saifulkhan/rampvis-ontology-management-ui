import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import {APIService} from '../services/api.service';

@Injectable()
export class SearchService {
	private url = environment.components.apiPy + '/twitter';

	public static SEARCH_TYPE: any = {
        KEYWORD: 'keyword',
        USERNAME: 'username'
    };

	constructor(private api: APIService, private http: HttpClient) {
	}

	queryTweets(type: string, term: string): Observable<Array<string>> {
		let query: string;

		if(type == SearchService.SEARCH_TYPE.KEYWORD) {
			query = `${this.url}/search?keywords=${term}`;
		} else if(type == SearchService.SEARCH_TYPE.USERNAME) {
			query = `${this.url}/user?user_name=${term}`;
		}

		return this.api.get<Array<string>>(query);
	}
}
