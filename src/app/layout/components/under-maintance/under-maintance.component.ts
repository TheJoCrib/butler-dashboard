import {Component, OnInit} from '@angular/core';
import {CoreConfigService} from "../../../../@core/services/config.service";
import AOS from 'aos';

@Component({
    selector: 'app-under-maintance',
    templateUrl: './under-maintance.component.html',
    styleUrls: ['./under-maintance.component.scss']
})
export class UnderMaintanceComponent implements OnInit {

    constructor(private _coreConfigService: CoreConfigService,) {
        this._coreConfigService.config = {
            layout: {
                navbar: {
                    hidden: true,
                },
                menu: {
                    hidden: true,
                },
                footer: {
                    hidden: true,
                },
                customizer: false,
                skin: 'semi-dark',
                enableLocalStorage: false,
            },
        };
    }

    ngOnInit(): void {
        AOS.init();
        this.prelaoderHandler();
    }

    /**
     * Easy selector helper function
     */
    select = (el: string, all = false): any => {
        el = el.trim()
        if (all) {
            return document.querySelectorAll(el)
        } else {
            return document.querySelector(el)
        }
    }
    /**
     * Easy event listener function
     */
    on = (type: any, el: any, listener: any, all = false) => {
        let selectEl = this.select(el, all)
        if (selectEl) {
            if (all) {
                selectEl.forEach(e => e.addEventListener(type, listener))
            } else {
                selectEl.addEventListener(type, listener)
            }
        }
    }

    prelaoderHandler() {
        let preloader = this.select('#preloader');
        if (preloader) {
            window.addEventListener('load', () => {
                preloader.remove()
            });
        }
    }
}
