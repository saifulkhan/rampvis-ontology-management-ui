import { AfterViewInit, Component, Input, NgZone, OnChanges, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { Timeline } from './timeline.model';
import { normalizeTimelineMsg } from './helper/timeline.helper';

@Component({
    selector: 'timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
    animations: [
        trigger('cardsAnimation', [
            state('in', style({ opacity: 1 })),
            transition(':enter', [style({ opacity: 0 }), animate('0.5s')]),
            transition(':leave', [animate(400, style({ opacity: 0 }))]),
        ]),
    ],
})
export class TimelineComponent implements OnChanges, AfterViewInit {
    @Input() history: Array<Timeline> = [];
    @Input() timelineStream!: Timeline;
    @ViewChildren('timeline') timeline!: QueryList<any>;
    @ViewChildren('timelineElement') timelineElement!: QueryList<HTMLLIElement>;
    public timelineEvents = [];
    public unseenElements = [];

    constructor(private zone: NgZone) {}

    ngAfterViewInit(): void {
        this.timeline.first.nativeElement.addEventListener('mousemove', () => {
            this.unseenElements.forEach((item: any) => {
                if (this.isVisible(item)) {
                    item.nativeElement.lastChild.className = 'timeline-panel';
                    this.unseenElements = this.unseenElements.filter((element) => element !== item);
                }
            });
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['history']) {
            this.history = changes['history'].currentValue.map(normalizeTimelineMsg);
        }

        if (changes['timelineStream'] && changes['timelineStream'].currentValue) {
            this.zone.run(() => {
                const normalizedMsg = normalizeTimelineMsg(changes['timelineStream'].currentValue);
                this.history.unshift(normalizedMsg);
                console.log('TimelineComponent: ngOnChanges: history = ', this.history);
            });
        }
    }

    removeNotification(id: string): void {
        this.history = this.history.filter((event) => event.id !== id);
    }

    clearNotifications(): void {
        this.history = [];
    }

    private isVisible(el: any): boolean {
        const { top, bottom } = el.nativeElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        return bottom < 0 || top > windowHeight ? false : true;
    }

    public getTypeIcon(type: string) {
        return `assets/img/icons/logo-${type.toLowerCase()}.svg`;
    }
}
