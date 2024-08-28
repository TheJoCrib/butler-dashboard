import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlPanelRoutingModule } from './control-panel-routing.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CoreCommonModule } from '@core/common.module';
import { FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminManagementComponent } from './admin-management/admin-management.component';
import { RoleManagmentComponent } from './role-managment/role-managment.component';
import { CategoryManagmentComponent } from './category-managment/category-managment.component';
import { MatTreeModule } from '@angular/material/tree';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from "@angular/material/button";

@NgModule({
  declarations: [
    AdminManagementComponent,
    RoleManagmentComponent,
    CategoryManagmentComponent
  ],
    imports: [
        CommonModule,
        ControlPanelRoutingModule,
        ContentHeaderModule,
        NgxDatatableModule,
        NgbModule,
        MatTreeModule,
        MatIconModule,
        SweetAlert2Module.forRoot(),
        CoreCommonModule,
        NgMultiSelectDropDownModule.forRoot(),
        FormsModule,
        MatButtonModule
    ],
  providers: []
})
export class ControlPanelModule { }
