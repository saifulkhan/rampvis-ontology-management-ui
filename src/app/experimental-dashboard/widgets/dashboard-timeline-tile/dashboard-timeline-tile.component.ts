import { Component } from '@angular/core';

@Component({
  selector: 'app-experimental-timeline',
  templateUrl: './dashboard-timeline-tile.component.html',
  styleUrls: ['./dashboard-timeline-tile.component.scss']
})
export class ExperimentalTimelineComponent {

  public events:any = [];

  constructor() {}
}
