import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import 'hammerjs';
import {MatTreeModule} from '@angular/material/tree';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ToastrModule} from 'ngx-toastr';
import {ContextMenuModule} from '@ctrl/ngx-rightclick';
import {CoreModule} from '@core/core.module';
import {CoreCommonModule} from '@core/common.module';
import {CoreSidebarModule} from '@core/components';
//
import {NgSelectModule} from '@ng-select/ng-select';
//above select not working in lower modules
import {coreConfig} from '@core/utilities/app-config';
import {AppComponent} from 'app/app.component';
import {ContentHeaderModule} from 'app/layout/components/content-header/content-header.module';
import {AppRoutingModule} from './app-routing.module';
import {TokenInterceptor} from '../@core/interceptors/token-interreceptor.service';
import {ErrorInterceptorService} from '../@core/interceptors/error-interceptor.service';
import {AuthGuard} from '../@core/services/authentication/auth-guard.service';
import {CommonService} from '@core/services/common.service';
import {ReactiveFormsModule} from '@angular/forms';
import {DialogModule} from "../@core/components/dialog/dialog.module";
import {UnderMaintanceComponent} from "./layout/components/under-maintance/under-maintance.component";
import {LayoutModule} from "./layout/layout.module";
import {SpinnerService} from "../@core/services/spinner.service";
import {SpinnerInterceptor} from "../@core/interceptors/spinner.interceptor";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { SupportComponent } from './layout/components/support/support.component';

@NgModule({
    declarations: [
        AppComponent,
        UnderMaintanceComponent,
        SupportComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        NgbModule,
        MatTreeModule,
        ToastrModule.forRoot(),
        ContextMenuModule,
        CoreModule.forRoot(coreConfig),
        CoreCommonModule,
        CoreSidebarModule,
        DialogModule,
        ContentHeaderModule,
        NgSelectModule,
        LayoutModule,
        MatProgressSpinnerModule,
    ],

    providers: [
        CommonService,
        AuthGuard, SpinnerService,
        {provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true},
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptorService,
            multi: true,
        },
    ],
    entryComponents: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
