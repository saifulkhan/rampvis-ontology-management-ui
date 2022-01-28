import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from "@angular/core";
import { Observable, of } from "rxjs";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { catchError, debounceTime, distinctUntilChanged, map, startWith } from "rxjs/operators";
import { MatChipInputEvent } from "@angular/material/chips";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { NgxUiLoaderService } from "ngx-ui-loader";

import { OntoVisSearch } from "../../models/ontology/onto-vis.model";
import { OntoVisService } from "../../services/ontology/onto-vis.service";
import { OntoDataService } from "../../services/ontology/onto-data.service";
import { DATA_TYPE } from "../../models/ontology/onto-data-types";
import { OntoData } from "../../models/ontology/onto-data.model";
import { LocalNotificationService } from "../../services/local-notification.service";
import { PROPAGATION_TYPE } from "../../models/ontology/propagation-type.enum";
import { ErrorHandler2Service } from "../../services/error-handler-2.service";
import { OntoPage, OntoPageExt, OntoPageExtSearchGroup } from "../../models/ontology/onto-page.model";
import { OntoVisSearchFilterVm } from "../../models/ontology/onto-vis-search-filter.vm";
import { OntoPageService } from "../../services/ontology/onto-page.service";
import { DataStreamKeywordsArr } from "../../services/ontology/data-stream-keywords.service";
import { PAGE_TYPE } from "../../models/ontology/page-type.enum";
import { SEL_KW_STATE } from "../../models/selected-kw-state";
import { SEL_DATATYPE_STATE } from "../../models/selected-datatype-state";
import { MatRadioChange } from "@angular/material/radio";

@Component({
  selector: "app-propagation",
  templateUrl: "./propagation.component.html",
  styleUrls: ["./propagation.component.scss"],
})
export class PropagationComponent implements OnInit {
  //
  // Search VIS function
  //

  public ontoVisSearchFormGroup!: FormGroup;
  public searchOntoVisQuery!: string;
  public highlightOntoVisSearchSuggestion!: string;
  public suggestedOntoVis!: OntoVisSearch[];
  public referenceOntoVis: OntoVisSearch[] = [];

  // Example binding data and page
  public referenceOntoData: OntoData[] = [];
  public exampleLinks: OntoPageExt[] = [];

  constructor(
    private fb: FormBuilder,
    private ontoVisService: OntoVisService,
    private ontoDataService: OntoDataService,
    private localNotificationService: LocalNotificationService,
    private errorHandler2Service: ErrorHandler2Service,
    private ngxUiLoaderService: NgxUiLoaderService,
    private ontoPageService: OntoPageService
  ) {}

  ngOnInit(): void {
    this.ngOnInitVisSearch();
    this.ngOnInit_dataSearch();
  }

  ngAfterViewInit(): void {}

  //
  // VIS function search and reference data
  //

  ngOnInitVisSearch(): void {
    // Vis search form and suggestion
    this.ontoVisSearchFormGroup = this.fb.group({
      ontoVisSearchQuery: new FormControl("", [Validators.required]),
    });

    this.ontoVisSearchFormGroup
      .get("ontoVisSearchQuery")
      ?.valueChanges.pipe(debounceTime(0), distinctUntilChanged())
      .subscribe((query) => {
        if (!query || query === " ") {
          return;
        }

        this.highlightOntoVisSearchSuggestion = query;
        this.ontoVisService.suggest(query).subscribe((res) => {
          this.suggestedOntoVis = res;
          console.log("PropagationComponent: suggestedOntoVis = ", this.suggestedOntoVis);
        });
      });
  }

  public onClickSearchOntoVis() {
    this.ontoVisSearchFormGroup.updateValueAndValidity();
    if (!this.ontoVisSearchFormGroup.valid) {
      return;
    }

    // Clear everything
    this.suggestedOntoVis = [];
    this.referenceOntoVis = [];
    this.referenceOntoData = [];
    this.discoveredOntoDataGroups = [];
    this.datatypeSelectionStateMap = {};
    this.keywordSelectionStateMap = {};

    const ontoVisSearchFilterVm: OntoVisSearchFilterVm = {
      query: this.ontoVisSearchFormGroup.value.ontoVisSearchQuery,
    } as OntoVisSearchFilterVm;

    console.log("PropagationComponent: onClickSearchOntoVis: ontoVisSearchFilterVm = ", ontoVisSearchFilterVm);

    this.ontoVisService
      .search(ontoVisSearchFilterVm)
      .pipe(
        catchError((err) => {
          this.errorHandler2Service.handleError(err);
          return of([]);
        })
      )
      .subscribe(
        (res: any) => {
          this.referenceOntoVis = res;
          console.log("PropagationComponent:searchOntoVis: ontoVisSearchResult = ", this.referenceOntoVis);
          if (!this.referenceOntoVis || this.referenceOntoVis.length <= 0 || !this.referenceOntoVis[0]?.id) {
            this.localNotificationService.error({ message: "No matching VIS function found" });
            return;
          }
          this.getReferenceOntoData();
          this.getExampleLinks();
        },
        (err) => {}
        // () => (this.spinner = false)
      );
  }

  private getReferenceOntoData() {
    this.ontoVisService.getExampleOntoDataBindingVisId(this.referenceOntoVis[0].id).subscribe((res: OntoData[]) => {
      console.log("PropagationComponent:getReferenceOntoData: referenceOntoData = ", res);
      this.referenceOntoData = res;
    });
  }

  private getExampleLinks() {
    if (!this.referenceOntoVis || !this.referenceOntoVis[0]?.id) {
      return;
    }

    this.ontoVisService.getReferencePagesBindingVisId(this.referenceOntoVis[0].id).subscribe((res: OntoPageExt[]) => {
      console.log("PropagationComponent:getExampleLinks: exampleLinks = ", res);
      this.exampleLinks = res;
    });
  }

  //
  // Build search from using keywords and data-types from example stream and adding new keywords
  //

  @ViewChild("keywordInput1") keywordInput1!: ElementRef<HTMLInputElement>;
  keywordInputCtrl1 = new FormControl();
  @ViewChild("keywordInput2") keywordInput2!: ElementRef<HTMLInputElement>;
  keywordInputCtrl2 = new FormControl();
  @ViewChild("keywordInput3") keywordInput3!: ElementRef<HTMLInputElement>;
  keywordInputCtrl3 = new FormControl();
  @ViewChild("dataTypeInput") dataTypeInput!: ElementRef<HTMLInputElement>;
  dataTypeInputCtrl = new FormControl();

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  allKeywords!: string[];
  allDataTypes!: string[];

  // Keyword in search form, the state of the keywords are are,
  // 1 => must, 2 => should, 3 => must not
  keywordSelectionStateMap: any = {};
  datatypeSelectionStateMap: any = {};

  // Ranking parameters
  public alpha: number = 1.0;
  public beta: number = 0.0;
  public theta: number = 0.0;
  public minimumShouldMatch: number = 1;
  public cluster: boolean = true;
  allAlgorithms: string[] = ["Spectral-clustering", "K-means", "Brute-force"];
  selectedAlgorithm: string = "Spectral-clustering";
  allProcessor: string[] = ["CPU", "GPU"];
  selectedProcessor: string = "CPU";
  maxSearchWindow = 10000;

  ngOnInit_dataSearch() {
    this.allKeywords = DataStreamKeywordsArr();
    this.allDataTypes = (Object.keys(DATA_TYPE) as Array<keyof typeof DATA_TYPE>).map((d) => DATA_TYPE[d]);

    // Mock data
    // this.ontoDataMatchingGroups = this.ontoDataService.getMockMatchingData();
  }

  getSelectedKeywords(state: SEL_KW_STATE): string[] {
    return Object.keys(this.keywordSelectionStateMap).filter((d) => this.keywordSelectionStateMap[d].state === state);
  }

  onChangeKeywords(_keywordSelectionStateMap: any) {
    this.keywordSelectionStateMap = _keywordSelectionStateMap;
  }

  onClickRemoveKeyword(kw: string) {
    delete this.keywordSelectionStateMap[kw];
  }

  onEnterAddKeywordMust(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    this.keywordSelectionStateMap[value] = { state: SEL_KW_STATE.MUST, from: "nw" };
    this.keywordInput1.nativeElement.value = ""; // clear
  }

  onEnterAddKeywordShould(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    this.keywordSelectionStateMap[value] = { state: SEL_KW_STATE.SHOULD, from: "nw" };
    this.keywordInput2.nativeElement.value = ""; // clear
  }

  onEnterAddKeywordMustNot(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    this.keywordSelectionStateMap[value] = { state: SEL_KW_STATE.MUST_NOT, from: "nw" };
    this.keywordInput3.nativeElement.value = ""; // clear
  }

  onEnterAddDataType(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    this.datatypeSelectionStateMap[value] = { state: SEL_DATATYPE_STATE.FILTER, from: "nw" };
    this.dataTypeInput.nativeElement.value = "";
  }

  getSelectedDataTypes(state: SEL_DATATYPE_STATE = 1): string[] {
    return Object.keys(this.datatypeSelectionStateMap).filter((d) => this.datatypeSelectionStateMap[d].state === state);
  }

  onChangeDataTypes(_datatypeSelectionStateMap: any) {
    this.datatypeSelectionStateMap = _datatypeSelectionStateMap;
  }

  onClickRemoveDataType(dt: string) {
    delete this.datatypeSelectionStateMap[dt];
  }

  onProcessorRadioChange(event: MatRadioChange) {
    console.log("onProcessorRadioChange: event.value = ", event.value);
    if (event.value === "GPU") {
      this.selectedAlgorithm = "K-means";
    }
  }

  onAlgorithmRadioChange(event: MatRadioChange) {
    console.log("onAlgorithmRadioChange: event.value = ", event.value);
    if (event.value === "Spectral-clustering") {
      this.selectedProcessor = "CPU";
    }
  }

  //
  // Search result groups
  //

  // Search data result in group
  public discoveredOntoDataGroups!: any; //OntoDataSearchGroup[];
  // Search page result in group
  public ontoPageExtSearchGroups!: OntoPageExtSearchGroup[];

  public onClickSearchMatchingGroups() {
    if (!this.referenceOntoVis || !this.referenceOntoVis[0]?.id) {
      this.localNotificationService.error({ message: "Search a VIS function and its reference data streams." });
    }

    let query = {
      visId: this.referenceOntoVis[0]?.id,
      mustKeys: this.getSelectedKeywords(SEL_KW_STATE.MUST),
      shouldKeys: this.getSelectedKeywords(SEL_KW_STATE.SHOULD),
      mustNotKeys: this.getSelectedKeywords(SEL_KW_STATE.MUST_NOT),
      filterKeys: this.getSelectedDataTypes(),

      minimumShouldMatch: this.minimumShouldMatch,
      alpha: this.alpha,
      beta: this.beta,
      theta: this.theta,
      clusteringAlgorithm: this.selectedAlgorithm,
      processor: this.selectedProcessor,
      maxSearchWindow: this.maxSearchWindow,
    };

    console.log("PropagationComponent:onClickSearchMatchingGroups: query = ", query);

    this.ngxUiLoaderService.start();

    this.ontoDataService
      .searchMatchingGroups(query, this.referenceOntoData)
      .pipe(
        catchError((err) => {
          this.errorHandler2Service.handleError(err);
          this.ngxUiLoaderService.stop();
          return of([]);
        })
      )
      .subscribe(
        (res: any) => {
          this.discoveredOntoDataGroups = res;
          console.log("PropagationComponent:search: onClickSearchMatchingData = ", this.discoveredOntoDataGroups);
          this.ngxUiLoaderService.stop();
        },
        (err) => {}
        // () => (this.spinner = false)
      );
  }

  // Propagation

  public onClickPropagate(idx: number) {
    if (!this.referenceOntoVis[0]?.id || idx < 0) {
      return;
    }

    const d = this.discoveredOntoDataGroups.splice(idx, 1)[0];
    console.log("PropagationComponent:onClickPropagate: propagate data = ", d);
    if (!d) {
      return;
    }

    const ontoPage: any = {
      pageType: PAGE_TYPE.REVIEW,
      visId: this.referenceOntoVis[0]?.id,
      dataIds: d.group.map((d: any) => d.id),
    };

    this.ontoPageService.createPage(ontoPage).subscribe((res: any) => {
      console.log("PropagationComponent:onClickPropagate: res = ", res);
      this.localNotificationService.success({ message: "Propagated" });
    });
  }

  public onClickPropagateAll() {
    // prettier-ignore
    console.log("PropagationComponent:onClickPropagateAll: num. discovered = ", this.discoveredOntoDataGroups?.length);
    const d = this.discoveredOntoDataGroups.splice(0, 100);
    // prettier-ignore
    console.log("PropagationComponent:onClickPropagateAll: num. propagate = ", d.length);
    if (!this.referenceOntoVis[0]?.id || !d?.length) {
      return;
    }

    const ontoPages: any[] = d?.map((d: any) => {
      return {
        pageType: PAGE_TYPE.REVIEW,
        visId: this.referenceOntoVis[0]?.id,
        dataIds: d.group.map((d: any) => d.id),
      };
    });

    this.ontoPageService.createPages(ontoPages).subscribe((res: any) => {
      console.log("PropagationComponent:onClickPropagateAll: res = ", res);
      this.localNotificationService.success({
        message: `success: ${res?.success}, duplicate: ${res?.duplicate}, error: ${res?.error}`,
      });
    });
  }

  public onClickRemove(idx: number) {
    if (idx >= 0) {
      let res = this.discoveredOntoDataGroups.splice(idx, 1);
      this.localNotificationService.warning({ message: "Removed" });
    }
  }

  /**
   * Used by autocomplete UI
   */
  public optionSelected(input: HTMLInputElement) {
    input.blur();
    input.setSelectionRange(0, 0);
    input.focus();
  }
}
