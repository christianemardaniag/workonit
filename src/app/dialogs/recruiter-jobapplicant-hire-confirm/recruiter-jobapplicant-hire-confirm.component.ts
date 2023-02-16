import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-recruiter-jobapplicant-hire-confirm',
  templateUrl: './recruiter-jobapplicant-hire-confirm.component.html',
  styleUrls: ['./recruiter-jobapplicant-hire-confirm.component.css']
})
export class RecruiterJobapplicantHireConfirmComponent implements OnInit {
  
  constructor(public db:DbhelperService,@Inject(MAT_DIALOG_DATA) public jobOfferData:any) { }

  currentDate: any;
  ngOnInit(): void {
   
  }
  accept(){
    this.db.hireApplicant(this.jobOfferData.id, this.jobOfferData.studentId,this.jobOfferData.jobOfferId)
    
  }

}
