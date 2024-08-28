import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DashboardService} from '@core/services/dashboard/dashboard.service';
import {UserService} from '@core/services/user/user.service';

@Component({
    selector: 'app-freelancers-onboarding-onsight',
    templateUrl: './freelancers-onboarding-onsight.component.html',
    styleUrls: ['./freelancers-onboarding-onsight.component.scss']
})
export class FreelancersOnboardingOnsightComponent implements OnInit {
    @Input() title = '';
    onboardingInsight: any
    query = {};
    loader = true

    constructor(
        private dashboardService: DashboardService,
        private router: Router,
        private userService: UserService,
    ) {
    }

    ngOnInit(): void {
        this.getClients()
        this.onboardingInsight = {
            rejected: 0,
            pending: 0,
            approved: 0

        }
    }

    getClients() {
        this.userService
            .getClients({...this.query})
            .subscribe((res: any) => {
                const bannedClients = res.data?.filter(checkIsBanned)

                function checkIsBanned(users: any) {
                    return users.isBanned == true
                }

                const verifiedClients = res.data?.filter(checkIsVerified)

                function checkIsVerified(users: any) {
                    return users.isProfileVerified == true
                }

                this.onboardingInsight.rejected = bannedClients.length
                this.onboardingInsight.approved = verifiedClients.length
                this.onboardingInsight.pending = res.data.length
                this.loader = false
            });
    }

    // getFreelancers() {
    //   this.userService.getFreelancers(this.query).subscribe((res: any) => {
    //     const result = res.data?.filter(checkIsBanned)
    //     function checkIsBanned(users: any) {
    //       return users.isBanned == false
    //     }
    //     this.onboardingInsight.rejected = result.length
    //     this.loader = false
    //   });
    // }
    navigateTo(path: string) {
        this.router.navigateByUrl('/admin/freelancers/' + path)
    }
}
