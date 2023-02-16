import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-student-joboffer-confirm',
  templateUrl: './student-joboffer-confirm.component.html',
  styleUrls: ['./student-joboffer-confirm.component.css'],
  providers: [DatePipe]
})
export class StudentJobofferConfirmComponent implements OnInit {

  constructor(public db:DbhelperService,@Inject(MAT_DIALOG_DATA) public jobOfferData:any, public datePipe:DatePipe) { }

  date = new Date();
  currentDate: any;
  ngOnInit(): void {
    this.currentDate = this.datePipe.transform(this.date, "yyyy-MM-dd");
  }
  apply(){
    this.db.studentApplyJobOffer(this.jobOfferData.id,this.currentDate,this.jobOfferData.recruiterId)
    
  }

}
