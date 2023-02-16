import { Component, OnInit } from '@angular/core';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(public db: DbhelperService) { }

  ngOnInit(): void {
  }
  logout() {
    this.db.logout();
    localStorage.removeItem("currentUser")
  }

}
