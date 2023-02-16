import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-student-jobapplication-accept-hire',
  templateUrl: './student-jobapplication-accept-hire.component.html',
  styleUrls: ['./student-jobapplication-accept-hire.component.css']
})
export class StudentJobapplicationAcceptHireComponent implements OnInit {

  constructor(public db:DbhelperService,@Inject(MAT_DIALOG_DATA) public jobOfferData:any) { }

  currentDate: any;
  ngOnInit(): void {
   
  }
  accept(){
    this.db.confirmHire(this.jobOfferData.id, this.jobOfferData.studentId,this.jobOfferData.jobOfferId, this.jobOfferData.recruiterId)
    
    
  }
}
