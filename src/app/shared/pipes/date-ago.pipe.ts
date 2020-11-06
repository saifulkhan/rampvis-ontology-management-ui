import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

moment.updateLocale('en', {
	relativeTime: {
		future: 'in %s',
		past: '%s ago',
		s:  'seconds',
		ss: '%ss',
		m:  'a minute',
		mm: '%dm',
		h:  'an hour',
		hh: '%dh',
		d:  'a day',
		dd: '%dd',
		M:  'a month',
		MM: '%dM',
		y:  'a year',
		yy: '%dY'
	}
});

@Pipe({
	name: 'dateAgo',
	pure: true
})
export class DateAgoPipe implements PipeTransform {
	transform(value: any, args?: any): any {
		return value ? moment(new Date(value)).fromNow() : '';
	}

}
