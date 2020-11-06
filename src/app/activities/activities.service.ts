import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {APIService} from '../services/api.service';
import {PaginationModel} from '../shared/models/pagination.model';
import {ActivitiesFiterVm} from '../shared/models/activities-filter.vm';
import {Activity} from '../shared/models/activity.model';

@Injectable()
export class ActivitiesService {
	private url: string = '/activities';

	constructor(private api: APIService) {
	}

	getActivities(filter: ActivitiesFiterVm): Observable<PaginationModel<Activity>> {
		let query: string = `${this.url}?page=${filter.page}&pageCount=${filter.pageCount}`;

		if (filter.filter) {
			query = query.concat(`&filter=${filter.filter}`);
		}
		if (filter.startDate) {
			query = query.concat(`&startDt=${filter.startDate.toISOString()}`);
		}
		if (filter.endDate) {
			query = query.concat(`&endDt=${filter.endDate.toISOString()}`);
		}

		return this.api.get<PaginationModel<Activity>>(query);
	}
}
