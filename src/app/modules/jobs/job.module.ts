import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';
import { JobRoutingModule } from './job-routing.module';
import { JobComponent } from './job/job.component';
import { JobDetailsViewComponent } from './job-details-view/job-details-view.component';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { JobService } from '@core/services/jobs/job.service';
import { CreateJobComponent } from './create-job/create-job.component';
import { NgToggleModule } from 'ng-toggle-button';
@NgModule({
  declarations: [
        JobComponent,
        JobDetailsViewComponent,
        CreateJobComponent
  ],
  imports: [
    CommonModule,
    NgMultiSelectDropDownModule.forRoot(),
    JobRoutingModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgxDatatableModule,
    NgSelectModule,
    NgToggleModule
  ],
  providers: [JobService]
})
export class JobModule { }
