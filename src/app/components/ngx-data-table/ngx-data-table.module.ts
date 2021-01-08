import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDataTableComponent } from './ngx-data-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatInputModule],
    declarations: [NgxDataTableComponent],
    exports: [NgxDataTableComponent],
})
export class NgxDataTableModule {}
