import {Component, OnDestroy, OnInit} from "@angular/core";
import {AuthGuard} from "@core/services/authentication/auth-guard.service";
import {CategoryService} from "@core/services/category/category.service";
import {PERMISSIONS} from "@core/utilities/constants";
import {ToastrService} from "ngx-toastr";
import {MatTreeNestedDataSource} from "@angular/material/tree";
import {NestedTreeControl} from "@angular/cdk/tree";
import {DialogService} from "../../../../@core/components/dialog.service";
import {Subscription} from "rxjs";

@Component({
    selector: "app-category-managment",
    templateUrl: "./category-managment.component.html",
    styleUrls: ["./category-managment.component.scss"],
})
export class CategoryManagmentComponent implements OnInit, OnDestroy {
    treeControl = new NestedTreeControl((node) => (node as any).children);
    dataSource = new MatTreeNestedDataSource<[]>();
    categories = [];
    loading = false;
    controlListCat = {};
    contentHeader = {};
    categoriesContentHeader = {};
    newRootCat = "";
    public list = [];
    confPerm = PERMISSIONS;
    treeList = [];

    subscription: Subscription = new Subscription();

    constructor(
        private categoryService: CategoryService,
        private toasterService: ToastrService,
        private _dialogService: DialogService,
        private authGuardService: AuthGuard
    ) {
    }

    hasChild = (_: number, node) => !!node.children && node.children.length > 0;

    ngOnInit(): void {
        this.inItContentHeader();
        this.inItCategoriesContentHeader();
        this.getAllCategories();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getAllCategories() {
        this.loading = true;
        this.categoryService.getCategories().subscribe((res: any) => {
            this.categories = res.categories;
            this.loading = false;
            this.getChildrens();
            this.list = this.categories;
            this.dataSource.data = this.categories;
        }, () => {
            this.loading = false;
        })
    }

    submitRootCat() {
        this.categoryService
            .create({
                name: this.newRootCat,
                path: null,
            })
            .subscribe((res) => {
                this.newRootCat = "";
                this.getAllCategories();
            });
    }

    handleDelete(cat: any) {

        this._dialogService.swalConfirmation(`Are you sure? You sure you want to delete ${cat.name}`,
            "warning", "Yes, delete it!").then((result: any) => {
            if (result && result.value) {
                this.loading = true;
                this.categoryService.delete(cat._id).subscribe((res) => {
                    this.toasterService.success(
                        `${cat.name} deleted successfully`,
                        `Deleted`,
                        {
                            toastClass: "toast ngx-toastr",
                            closeButton: true,
                        }
                    );
                    this.loading = false;
                    this.getAllCategories();
                }, () => {
                    this.loading = false;
                });
            }
        });
    }

    handleAddNewCategory(node) {
        const resp = this._dialogService.addNewSubCategoryDialog(node, '');
        this.subscription.add(resp.subscribe(value => {
            if (value) {
                this.controlListCat[node.name] = value;
                this.handleCategorySubmit(node);
            }
        }));
    }

    handleCategorySubmit(cat: any) {
        if (
            !this.controlListCat[cat.name] ||
            !this.controlListCat[cat.name].trim().length
        ) {
            this.toasterService.error(`empty or invalid category name`, `Failure`, {
                toastClass: "toast ngx-toastr",
                closeButton: true,
            });
            return;
        }
        let tempPath = cat.path ? cat.path : ",";
        let payload = {
            path: tempPath + cat.name + ",",
            name: this.controlListCat[cat.name],
        };
        this.loading = true;
        this.categoryService.create(payload).subscribe((res) => {
            this.controlListCat[cat.name] = "";
            this.loading = false;
            this.toasterService.success(
                `${payload.name} created successfully`,
                `Created`,
                {
                    toastClass: "toast ngx-toastr",
                    closeButton: true,
                }
            );
            this.getAllCategories();
        }, () => {
            this.loading = false;
        });
    }

    getChildrens() {
        this.categories = this.categories.map((item) => {
            return {
                ...item,
                text: item.name,
                value: item.value,
            };
        });
        for (let i = 0; i < this.categories.length; i++) {
            let temp = this.categories.filter((c: any) =>
                new RegExp("," + this.categories[i].name + ",$").test(c.path)
            );
            //this.categories[i]["color"] = "#" + Math.floor(Math.random() * 10000215).toString(16);
            if (temp && temp.length) {
                this.categories[i]["children"] = [...temp];
            }
        }
        this.categories = this.categories.filter((ele) => ele.path === null);
    }

    checkPermission(permission) {
        return this.authGuardService.checkPermisison(permission);
    }

    inItContentHeader() {
        this.contentHeader = {
            headerTitle: "Control Panel",
            actionButton: false,
            breadcrumb: {
                type: "",
                links: [
                    {
                        name: "Category Management",
                        isLink: false,
                    },
                ],
            },
        };
    }

    inItCategoriesContentHeader() {
        this.categoriesContentHeader = {
            headerTitle: "List of Categories",
            actionButton: false,
            breadcrumb: {
                type: "",
            },
        };
    }
}
