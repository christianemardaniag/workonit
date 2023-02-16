import { Component, OnInit } from '@angular/core';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(public db: DbhelperService) { }

  ngOnInit(): void {
  }
  Forgotpassword(value: any) {
    this.db.Forgotpassword(value.email);
  }


}
