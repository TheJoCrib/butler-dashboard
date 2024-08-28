import {Component, HostBinding, HostListener, OnDestroy, OnInit, ViewEncapsulation,} from "@angular/core";
import {MediaObserver} from "@angular/flex-layout";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

import {CoreSidebarService} from "@core/components/core-sidebar/core-sidebar.service";
import {CoreConfigService} from "@core/services/config.service";
import {CoreMediaService} from "@core/services/media.service";
import {User} from "@core/models/common-models";

import {Router} from "@angular/router";
import {DialogService} from "../../../../@core/components/dialog.service";

@Component({
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnInit, OnDestroy {
    public horizontalMenu: boolean;
    public hiddenMenu: boolean;

    public coreConfig: any;
    public currentSkin: string;
    public currentConfig: any;
    public prevSkin: string;

    public currentUser: User;

    public languageOptions: any;
    public navigation: any;
    public selectedLanguage: any;

    @HostBinding("class.fixed-top")
    public isFixed = false;

    @HostBinding("class.navbar-static-style-on-scroll")
    public windowScrolled = false;
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _router: Router,
        private _coreConfigService: CoreConfigService,
        private _coreMediaService: CoreMediaService,
        private _coreSidebarService: CoreSidebarService,
        private _mediaObserver: MediaObserver,
        private _dialogService: DialogService,
    ) {
        this.languageOptions = {
            en: {
                title: "English",
                flag: "us",
            },
            fr: {
                title: "French",
                flag: "fr",
            },
            de: {
                title: "German",
                flag: "de",
            },
            pt: {
                title: "Portuguese",
                flag: "pt",
            },
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // Add .navbar-static-style-on-scroll on scroll using HostListener & HostBinding
    @HostListener("window:scroll", [])
    onWindowScroll() {
        if (
            (window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop > 100) &&
            this.coreConfig.layout.navbar.type == "navbar-static-top" &&
            this.coreConfig.layout.type == "horizontal"
        ) {
            this.windowScrolled = true;
        } else if (
            (this.windowScrolled && window.pageYOffset) ||
            document.documentElement.scrollTop ||
            document.body.scrollTop < 10
        ) {
            this.windowScrolled = false;
        }
    }

    toggleSidebar(key): void {
        this._coreSidebarService.getSidebarRegistry(key).toggleOpen();
    }

    setLanguage(language): void {
        // Set the selected language for the navbar on change
        this.selectedLanguage = language;

        // Use the selected language id for translations

        this._coreConfigService.setConfig(
            {app: {appLanguage: language}},
            {emitEvent: true}
        );
    }

    toggleDarkSkin() {
        // Get the current skin
        this._coreConfigService
            .getConfig()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.currentSkin = config.layout.skin;
            });

        // Toggle Dark skin with prevSkin skin
        this.prevSkin = localStorage.getItem("prevSkin");
        this.currentConfig = JSON.parse(localStorage.getItem("config"));

        if (this.currentSkin === "dark") {
            const skin = this.prevSkin ? this.prevSkin : "semi-dark";
            this._coreConfigService.setConfig(
                {layout: {skin: skin}},
                {emitEvent: true}
            );
            this.currentConfig.layout.skin =  skin;
        } else {
            localStorage.setItem("prevSkin", this.currentSkin);
            this._coreConfigService.setConfig(
                {layout: {skin: "dark"}},
                {emitEvent: true}
            );
        }
    }

    ngOnInit(): void {
        // get the currentUser details from localStorage
        this.currentUser = JSON.parse(localStorage.getItem("admin"));
        // Subscribe to the config changes
        this._coreConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.coreConfig = config;
                this.horizontalMenu = config.layout.type === "horizontal";
                this.hiddenMenu = config.layout.menu.hidden === true;
                this.currentSkin = config.layout.skin;

                // Fix: for vertical layout if default navbar fixed-top than set isFixed = true
                if (this.coreConfig.layout.type === "vertical") {
                    setTimeout(() => {
                        if (this.coreConfig.layout.navbar.type === "fixed-top") {
                            this.isFixed = true;
                        }
                    }, 0);
                }
            });

        // Horizontal Layout Only: Add class fixed-top to navbar below large screen
        if (this.coreConfig.layout.type == "horizontal") {
            // On every media(screen) change
            this._coreMediaService.onMediaUpdate
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    const isFixedTop = this._mediaObserver.isActive("bs-gt-xl");
                    if (isFixedTop) {
                        this.isFixed = false;
                    } else {
                        this.isFixed = true;
                    }
                });
        }

    }

    logoutUser() {
        const msg = 'Are you sure, you want to logout?';
        this._dialogService.swalConfirmation(msg, 'warning', "Yes").then(value => {
            if (value && value.value) {
                this._router.navigate(["/admin/auth"]);
            }
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    navigateToChangePassword() {
        this._router.navigateByUrl("/admin/auth/change-password");
    }
}
