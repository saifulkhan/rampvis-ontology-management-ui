import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HideIfUnauthorizedDirective } from './hide-if-unauthorized';
import { DisableIfUnauthorizedDirective } from './disable-if-unauthorized';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    HideIfUnauthorizedDirective,
    DisableIfUnauthorizedDirective,
  ],
  exports: [
    HideIfUnauthorizedDirective,
    DisableIfUnauthorizedDirective,
  ]
})

export class DirectivesModule {}
