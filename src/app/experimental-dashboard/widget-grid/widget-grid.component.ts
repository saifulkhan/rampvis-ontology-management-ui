import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, AfterViewInit, ComponentFactoryResolver, ViewContainerRef, ViewChildren, QueryList, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CompactType, DisplayGrid, Draggable, GridsterConfig, GridsterItem, GridType, PushDirections, Resizable, GridsterItemComponentInterface } from 'angular-gridster2';
import { DashboardSettings } from 'src/app/shared/models/app-settings.model';
import { WidgetService } from 'src/app/services/widget.service';


interface OpenWidgetObject {
  id: string;
  ref: ViewContainerRef;
}

interface Safe extends GridsterConfig {
  draggable: Draggable;
  resizable: Resizable;
  pushDirections: PushDirections;
}

const options = {
  gridType: GridType.Fixed,
  compactType: CompactType.None,
  margin: 10,
  outerMargin: true,
  outerMarginTop: null,
  outerMarginRight: null,
  outerMarginBottom: null,
  outerMarginLeft: null,
  useTransformPositioning: true,
  mobileBreakpoint: 800,
  minCols: 1,
  maxCols: 20,
  minRows: 1,
  maxRows: 20,
  maxItemCols: 10,
  minItemCols: 1,
  maxItemRows: 10,
  minItemRows: 1,
  maxItemArea: 2500,
  minItemArea: 1,
  defaultItemCols: 1,
  defaultItemRows: 1,
  fixedColWidth: 105,
  fixedRowHeight: 105,
  keepFixedHeightInMobile: false,
  keepFixedWidthInMobile: false,
  scrollSensitivity: 10,
  scrollSpeed: 20,
  enableEmptyCellClick: false,
  enableEmptyCellContextMenu: false,
  enableEmptyCellDrop: false,
  enableEmptyCellDrag: false,
  enableOccupiedCellDrop: false,
  emptyCellDragMaxCols: 50,
  emptyCellDragMaxRows: 50,
  ignoreMarginInRow: false,
  draggable: {
    enabled: true,
  },
  resizable: {
    enabled: true,
  },
  swap: false,
  pushItems: true,
  disablePushOnDrag: false,
  disablePushOnResize: false,
  pushDirections: {north: true, east: true, south: true, west: true},
  pushResizeItems: false,
  displayGrid: DisplayGrid.None,
  disableWindowResize: false,
  disableWarnings: false,
  scrollToNewItems: false
};

@Component({
  selector: 'app-widget-grid',
  templateUrl: './widget-grid.component.html',
  styleUrls: ['./widget-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class WidgetGridComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() dashboardSettings: DashboardSettings;
  @Input() events: any;
  @Output() sendUpdatedDashboardSettings = new EventEmitter<GridsterItem>();
  @Output() removeWidget = new EventEmitter<string>();
  @ViewChildren('widgetPlaceholder', { read: ViewContainerRef }) widgetHosts: QueryList<ViewContainerRef>;

  public options: Safe = options;
  public dashboard: Array<GridsterItem> = [];
  private openWidgets: Array<string>;

  private openComponentRefs: Array<any> = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private widgetService: WidgetService,
    private cDRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.openWidgets = [...this.dashboardSettings.openWidgets];
    if (this.openWidgets?.length > 0) this.addCards(this.openWidgets);
    this.options.itemChangeCallback = this.itemChange.bind(this);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.events) {
      console.log(this.events);
      this.updateComponentData();
      this.cDRef.markForCheck();
    }

    if (!changes.dashboardSettings) return;
    if (!this.openWidgets) return;
    const newOpenWidgetList = changes.dashboardSettings.currentValue.openWidgets;
    const missingWidgets = newOpenWidgetList.filter(w => !this.openWidgets.includes(w));
    if (missingWidgets.length > 0) {
      this.addCards(missingWidgets);
      setTimeout(() => {
        const {length} = missingWidgets;
        const missingWidgetViewRefs = this.widgetHosts.toArray().slice(length * -1);
        const missingWidgetObjects = this.setOpenWidgetObjects(missingWidgets, missingWidgetViewRefs);
        this.insertWidgets(missingWidgetObjects);
      }, 100);
    }
    const excessWidgets = this.openWidgets.filter(w => !newOpenWidgetList.includes(w));
    if (excessWidgets.length > 0) this.removeWidgets(excessWidgets);
    this.openWidgets = [...newOpenWidgetList];
  }

  ngAfterViewInit(): void {
    if (this.openWidgets?.length > 0) this.insertWidgets(this.setOpenWidgetObjects(this.openWidgets, this.widgetHosts.toArray()));
  }

  public removeItem($event, item): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
    this.dashboardSettings.openWidgets = this.dashboardSettings.openWidgets.filter(widget => widget !== item.id);
    this.openWidgets = [...this.dashboardSettings.openWidgets];
    this.removeWidget.emit(item.id);
  }

  public itemChange(item: GridsterItem, itemComponent: GridsterItemComponentInterface): void {
    this.sendUpdatedDashboardSettings.emit(item);
  }

  private setOpenWidgetObjects(widgetList: Array<string>, containerRefs: Array<ViewContainerRef>): Array<OpenWidgetObject> {
    const {length} = widgetList;
    const result: Array<OpenWidgetObject> = [];
    for (let i = 0; i < length; i++) {
      result[i] = { id: widgetList[i], ref: containerRefs[i] };
    }
    return result;
  }

  private addCards(widgetNames: Array<string>): void {
    widgetNames.forEach(name => {
      this.dashboard.push(this.dashboardSettings.widgetTileSettings.find(item => item.id === name));
    });
  }

  private insertWidgets(widgetObjects: Array<OpenWidgetObject>): void {
    widgetObjects.forEach(info => this.loadComponent(info));
  }

  private removeWidgets(ids: Array<string>): void {
    ids.forEach(item => {
      const card = this.dashboard.find(element => element.id === item);
      this.dashboard.splice(this.dashboard.indexOf(card), 1);
    });
    this.dashboardSettings.openWidgets = this.dashboardSettings.openWidgets.filter(id => !ids.includes(id));
  }

  private loadComponent(info: OpenWidgetObject): void {
    const widget = this.widgetService.getWidget(info.id);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(widget.component);
    info.ref.clear();
    const componentRef = info.ref.createComponent(componentFactory);
    componentRef.instance.events = this.events;
    this.openComponentRefs.push(componentRef)
  }

  private updateComponentData(): void {
    this.openComponentRefs.forEach(ref => ref.instance.events = this.events);
  }
}
