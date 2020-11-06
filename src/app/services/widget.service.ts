import { Injectable } from '@angular/core';
import { Widget } from '../experimental-dashboard/widgets/widget';
import { ExperimentalTimelineComponent } from '../experimental-dashboard/widgets/dashboard-timeline-tile/dashboard-timeline-tile.component';
import { FacebookTileComponent } from '../experimental-dashboard/widgets/dashboard-facebook-tile/dashboard-facebook-tile.component';
import { TwitterTileComponent } from '../experimental-dashboard/widgets/dashboard-twitter-tile/dashboard-twitter-tile.component';
import { InstagramTileComponent } from '../experimental-dashboard/widgets/dashboard-insta-tile/dashboard-insta-tile.component';


@Injectable()

export class WidgetService {

  public getWidget(name: string) {
    return new Widget(this.getComponent(name));
  }

  private getComponent(name: string): any {
    switch (name) {
      case 'timeline':
        return ExperimentalTimelineComponent;
      case 'facebook':
        return FacebookTileComponent;
      case 'twitter':
        return TwitterTileComponent;
      case 'instagram':
        return InstagramTileComponent;
    }
  }
}