import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminRoutingModule} from './admin-routing.module';
import {AdminComponent} from './admin/admin.component';
import {LayoutModule} from "../../layout/layout.module";
import {AuthGuardAdminService} from "../../../@core/services/authentication/auth-guard-admin.service";


@NgModule({
    declarations: [
        AdminComponent
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        LayoutModule,

    ],
    providers: [AuthGuardAdminService],
})
export class AdminModule {
}
