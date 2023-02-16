import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';


@Component({
  selector: 'app-recruiter-jobapplicant-confirm',
  templateUrl: './recruiter-jobapplicant-confirm.component.html',
  styleUrls: ['./recruiter-jobapplicant-confirm.component.css']
})
export class RecruiterJobapplicantConfirmComponent implements OnInit {

  constructor(public db:DbhelperService,@Inject(MAT_DIALOG_DATA) public jobOfferData:any) { }

  currentDate: any;
  ngOnInit(): void {
   
  }
  accept(){
    this.db.recruiterAcceptApplication(this.jobOfferData.studentId, this.jobOfferData.id,this.jobOfferData.recruiterId)
    
  }

}
