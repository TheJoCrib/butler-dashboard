import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { CoreCommonModule } from '@core/common.module';
import { CoreMenuComponent } from '@core/components/core-menu/core-menu.component';

import { CoreMenuVerticalSectionComponent } from '@core/components/core-menu/vertical/section/section.component';
import { CoreMenuVerticalItemComponent } from '@core/components/core-menu/vertical/item/item.component';
import { CoreMenuVerticalCollapsibleComponent } from '@core/components/core-menu/vertical/collapsible/collapsible.component';

CoreMenuVerticalSectionComponent;
CoreMenuVerticalItemComponent;
CoreMenuVerticalCollapsibleComponent;

@NgModule({
  imports: [CommonModule, RouterModule, CoreCommonModule],
  exports: [CoreMenuComponent],
  declarations: [
    CoreMenuComponent,
    CoreMenuVerticalSectionComponent,
    CoreMenuVerticalItemComponent,
    CoreMenuVerticalCollapsibleComponent
  ]
})
export class CoreMenuModule { }
