import { Component } from '@angular/core'

@Component({
  selector: 'not-found',
  template: `<h4 class="text-sm-center" style="margin-top: 100px;">Under construction</h4>

  <p class="text-sm-center"><a [routerLink]="['/dashboard']">Go to Dashboard</a></p>`
})

export class NotFoundComponent { }
