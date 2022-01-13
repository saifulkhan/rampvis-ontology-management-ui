import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ReplaySubject } from "rxjs";

import { APIService } from "../../../services/api.service";
import { OntoData } from "../../../models/ontology/onto-data.model";
import { environment } from "../../../../environments/environment";
import { URL_CODE } from "../../../models/ontology/onto-data-types";

@Component({
  selector: "app-onto-data-show",
  templateUrl: "./show.component.html",
  styleUrls: ["./show.component.scss"],
})
export class OntoDataShowComponent implements OnInit {
  @ViewChild("modalForm") modalForm: any;

  public length$: ReplaySubject<number> = new ReplaySubject<number>(1);
  public jsonData$: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  public column$: ReplaySubject<[]> = new ReplaySubject<[]>(1);

  public data!: OntoData;
  public url = "";
  spinner = true;

  constructor(
    public matDialogRef: MatDialogRef<OntoDataShowComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private api: APIService
  ) {
    console.log("OntoDataShowComponent: data = ", data);
    this.data = data;

    const urlCode: URL_CODE = this.data.urlCode;
    if (urlCode === URL_CODE.API_JS || urlCode === URL_CODE.API_PY) {
      this.url = `${(environment.components as any)[urlCode]}${this.data.endpoint}`;
    } else {
      this.url = this.data.endpoint;
    }

    this.api.get(this.url).subscribe((res: any) => {
      console.log("OntoDataShowComponent: res = ", res);

      if (res && Array.isArray(res) && res.length > 0) {
        this.jsonData$.next((res as any).slice(Math.max(res.length - 10, 0)));
        this.length$.next(res.length);
        this.column$.next(Object.keys(res[0]) as any);
        this.spinner = false;
      } else if (res) {
        this.jsonData$.next(res);
        this.length$.next(0);
        this.spinner = false;
      }
    });
  }

  ngOnInit(): void {}

  public close() {
    this.matDialogRef.close();
  }
}
