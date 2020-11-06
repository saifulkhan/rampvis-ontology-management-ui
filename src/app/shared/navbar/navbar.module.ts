import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NavbarComponent } from './navbar.component';

@NgModule({
	imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  declarations: [ NavbarComponent ],
  exports: [ NavbarComponent ]
})

export class NavbarModule {}
