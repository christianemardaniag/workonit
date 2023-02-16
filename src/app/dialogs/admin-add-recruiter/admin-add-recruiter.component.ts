import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-admin-add-recruiter',
  templateUrl: './admin-add-recruiter.component.html',
  styleUrls: ['./admin-add-recruiter.component.css'],
  providers: [DatePipe]
})
export class AdminAddRecruiterComponent implements OnInit {

  constructor(public db: DbhelperService, @Inject(MAT_DIALOG_DATA) public editEvaluatorData: any, public datePipe: DatePipe) { }

  date = new Date();
  currentDate: any;
  ngOnInit(): void {


    this.currentDate = this.datePipe.transform(this.date, "yyyy-MM-dd");




  }
  registerUser(value: any) {

    this.db.registerRecruiter(value.companyName, value.recruiterName, value.email, this.currentDate, value.password, value.repassword);




  }
}
