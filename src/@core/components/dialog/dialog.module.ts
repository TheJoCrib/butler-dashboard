import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {AddNewCategoryComponent} from './add-new-category/add-new-category.component';
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [
        AddNewCategoryComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        FormsModule
    ]
})
export class DialogModule {
}
