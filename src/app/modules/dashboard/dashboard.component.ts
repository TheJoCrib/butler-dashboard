import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { SocketService } from "@core/services/chat/socket.service";
import { FreelancersService } from "@core/services/freelancers/freelancers.service";
import { UserService } from "@core/services/user/user.service";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [SocketService],
})
export class DashboardComponent implements OnInit {
  onlineFreelancersStats = {};
  constructor(
    private socketService: SocketService,
    private userService: UserService
  ) {
    console.log('Build Date: 240107')
  }

  ngOnInit(): void {
    this.socketService.connect();
    this.socketService.updatedUserStatus().subscribe((res) => {
      this.onlineFreelancersStats["online"] =
        res.users.activeFreelancers.length;
      this.userService.getFreelancers().subscribe((resp: any) => {
        this.onlineFreelancersStats["offline"] =
          resp.totalCount - res.users.activeFreelancers.length;
        this.onlineFreelancersStats["totalFreelancers"] = resp.totalCount;
        let pc = Number(
          (this.onlineFreelancersStats["online"] /
          resp.totalCount) *
            100
        );
        this.onlineFreelancersStats["percentage"] =
          pc > 0 ? [Number(pc).toFixed()] : [0];
      });
    });
  }
  ngOnDestroy() {
    this.socketService.disconnect();
  }
}
