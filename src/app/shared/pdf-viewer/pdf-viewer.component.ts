import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PDFViewerComponent {

  constructor(
    private matDialogRef: MatDialogRef<PDFViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { pdfString: string }
  ) {}
}
