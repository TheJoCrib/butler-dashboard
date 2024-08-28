import { Component, OnInit } from "@angular/core";
import { UserService } from "@core/services/user/user.service";

@Component({
  selector: "app-top-customers",
  templateUrl: "./top-customers.component.html",
  styleUrls: ["./top-customers.component.scss"],
})
export class TopCustomersComponent implements OnInit {
  constructor(private userService: UserService) {}
  topCustomersData: any;
  loader = false;
  ngOnInit(): void {
    this.getTopCustomersByJobs();
  }
  getTopCustomersByJobs() {
    this.userService.getTopClients().subscribe((res) => {
      console.log(res);
      this.topCustomersData = res;
    });
  }
}
