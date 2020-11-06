import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MaterialModule } from "../../material.module";
import { CustomPipesModule } from "../pipes/custom-pipes.module";
import { TimelineComponent } from "./timeline.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    AngularSvgIconModule,
    CustomPipesModule
  ],
  declarations: [
    TimelineComponent
  ],
  exports: [
    TimelineComponent
  ]
})
export class TimelineModule {}
