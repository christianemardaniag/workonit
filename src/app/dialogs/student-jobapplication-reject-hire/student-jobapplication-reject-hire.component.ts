import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-student-jobapplication-reject-hire',
  templateUrl: './student-jobapplication-reject-hire.component.html',
  styleUrls: ['./student-jobapplication-reject-hire.component.css']
})
export class StudentJobapplicationRejectHireComponent implements OnInit {

  constructor(public db:DbhelperService,@Inject(MAT_DIALOG_DATA) public jobOfferData:any) { }

  currentDate: any;
  ngOnInit(): void {
   
  }
  reject(){
    this.db.rejectHire(this.jobOfferData.id, this.jobOfferData.studentId,this.jobOfferData.jobOfferId,this.jobOfferData.recruiterId)
    
  }
}
