import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';

import { SidebarModule } from './shared/sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule } from './shared/navbar/navbar.module';
import { FixedpluginModule } from './shared/fixedplugin/fixedplugin.module';

import { NotFoundComponent } from './errors/404';

import { AppRoutes } from './app.routing';
import { AnonymousGuard } from './guards/anonymous.guard';
import { ErrorHandler2Service } from './services/common/error-handler-2.service';
import { ErrorHandler1Service } from './services/common/error-handler-1.service';
import { AuthInterceptor } from './services/common/auth.interceptor';
import { LocalNotificationService } from './services/common/local-notification.service';
import { DialogService } from './services/common/dialog.service';
import { APIService } from './services/api.service';
import { AuthenticationService } from './services/authentication.service';
import { HelperService } from './services/common/helper.service';
import { AuthorizationService } from './services/authorization.service';
import { AuthorizationGuard } from './guards/authorization.guard';
import { UtilService } from './services/util.service';
import { JQUERY_PROVIDER } from './services/common/jQuery.service';
import { PublicLayoutComponent } from './layouts/public/public-layout.component';

// Firebase messaging related
import { NotificationService } from './services/notification.service';
import { environment } from '../environments/environment';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterModule.forRoot(AppRoutes, {
            // useHash: true,
            enableTracing: false,
        }),
        HttpClientModule,
        MaterialModule,

        SidebarModule,
        NavbarModule,
        FooterModule,
        FixedpluginModule,

        AngularFireMessagingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularSvgIconModule.forRoot(),
    ],
    declarations: [AppComponent, NotFoundComponent, PublicLayoutComponent],
    providers: [
        AnonymousGuard,
        ErrorHandler2Service,
        { provide: ErrorHandler, useClass: ErrorHandler1Service },
        JQUERY_PROVIDER,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        LocalNotificationService,
        DialogService,
        APIService,
        AuthenticationService,
        HelperService,
        AuthorizationService,
        AuthorizationGuard,
        UtilService,
        NotificationService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
