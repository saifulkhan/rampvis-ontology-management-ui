import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "../../material.module";
import { CustomPipesModule } from "../pipes/custom-pipes.module";
import { PDFViewerComponent } from './pdf-viewer.component';

@NgModule({
  declarations: [
    PDFViewerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    CustomPipesModule
  ],
  exports: [PDFViewerComponent]
})
export class PDFViewerModule {}
