import {Injectable} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {AddNewCategoryComponent} from "./dialog/add-new-category/add-new-category.component";
import Swal from "sweetalert2";

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    constructor(public dialog: MatDialog) {
    }


    addNewSubCategoryDialog(node: any, name: string): Observable<any> {
        const dialogRef = this.dialog.open(AddNewCategoryComponent, {
            width: '600px',
            data: {
                node,
                name
            }
        });
        return dialogRef.afterClosed();
    }

    swalConfirmation(title: string, icon: any, successbtn: string) {
        return Swal.fire({
            title: title,
            icon: icon,
            showCancelButton: true,
            confirmButtonColor: "#7367F0",
            cancelButtonColor: "#E42728",
            confirmButtonText: successbtn,
            customClass: {
                confirmButton: "btn btn-danger",
                cancelButton: "btn btn-primary ml-1",
            },
        });
    }

    swalConfirmationWithInput(title: string, icon: any, successbtn: string) {
        return Swal.fire({
            title: title,
            icon: icon,
            showCancelButton: true,
            confirmButtonColor: "#7367F0",
            cancelButtonColor: "#E42728",
            confirmButtonText: successbtn,
            customClass: {
                confirmButton: "btn btn-danger",
                cancelButton: "btn btn-primary ml-1",
                input: "swal2-input" // Apply custom class to the input field
            },
            input: 'text',
            inputPlaceholder: 'Enter your reason',
            inputValidator: (value) => {
                return !value && 'Please enter a reason'; // Show an error message if the input field is empty
            },
            allowOutsideClick: () => !Swal.isLoading(),
            preConfirm: (value) => {
                if (value) {
                    // Handle the confirmation logic when the input field is not empty
                    // You can also access the input value using the 'value' parameter
                } else {
                    Swal.showValidationMessage('Please enter a value'); // Show an error message if the input field is empty
                    return false; // Prevent the modal from closing when the input field is empty
                }
            },
        });
    }

    swalConfirmationWithInputAndDropdown(title, successbtn, admins) {
        const self = this;

        return new Promise((resolve, reject) => {
            Swal.fire({
                title: title,
                input: 'select',
                inputOptions: self.getAdminsInputOptions(admins),
                inputPlaceholder: 'Select an admin',
                customClass: {
                    confirmButton: "btn btn-danger",
                    cancelButton: "btn btn-primary ml-1",
                },
                showCancelButton: true,
                inputValidator: (value) => {
                    return  !value && 'Please choose an admin';
                }
            }).then((result) => {
                if (!result.isDismissed && result.value) {
                    const selectedAdmin = self.getAdminById(admins, result.value);
                    resolve(selectedAdmin);
                } else {
                    reject(new Error('Dialog dismissed or rejected'));
                }
            });
        });
    }



    getAdminsInputOptions(admins) {
        const inputOptions = {};
        if( admins.length > 0) {
            admins.forEach(admin => {
                inputOptions[admin.id] = admin.displayName;
            });
        }

        return inputOptions;
    }

    getAdminById(admins, id) {
        return admins.find(admin => admin.id === id);
    }
}
