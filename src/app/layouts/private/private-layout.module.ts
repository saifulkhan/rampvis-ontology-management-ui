import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PrivateLayoutComponent } from './private-layout.component';
import { PrivateLayoutRoutes } from './private-layout.routing';
import { SidebarModule } from '../../shared/sidebar/sidebar.module';
import { FooterModule } from '../../shared/footer/footer.module';
import { NavbarModule } from '../../shared/navbar/navbar.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(PrivateLayoutRoutes),
        SidebarModule,
        NavbarModule,
        FooterModule,
        DirectivesModule
    ],
    declarations: [
        PrivateLayoutComponent,
    ],
    providers: [
        // Services
    ]
})

export class PrivateLayoutModule {}
