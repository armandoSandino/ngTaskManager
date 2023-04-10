import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isAdmin:boolean = false;
  userName: string = '';

  constructor(
    private ngZone: NgZone,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getDataUser();
  }

  getDataUser(): void {

    this.ngZone.run(() => this.router.navigate(['/home']) ).then();
  
  }

  logout( $event: any ): void | any {

  }

}