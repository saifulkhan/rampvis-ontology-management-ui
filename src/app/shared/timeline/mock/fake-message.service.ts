import { Injectable } from "@angular/core";
import { from, Observable, of, Subject } from "rxjs";
import { concatMap, delay } from "rxjs/operators";
import { data } from './fake-data';

@Injectable({ providedIn: 'root' })
export class FakeMessageService {
  public currentMessage = new Subject<any>();

  constructor() {
    this.fakeApiRelease(data)
      .subscribe((val: any) => this.currentMessage.next(val));
  }
  
  private fakeApiRelease(output: Array<any>): Observable<any> {
    let randomTime = () => Math.round((Math.random()) * 3000);
    return from(output)
      .pipe(
        concatMap(item => of(item).pipe(delay(randomTime())))
      )
  }
}