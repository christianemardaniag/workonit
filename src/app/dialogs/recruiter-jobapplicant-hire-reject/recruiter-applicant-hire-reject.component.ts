import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-recruiter-applicant-hire-reject',
  templateUrl: './recruiter-applicant-hire-reject.component.html',
  styleUrls: ['./recruiter-applicant-hire-reject.component.css']
})
export class RecruiterApplicantHireRejectComponent implements OnInit {

  constructor(public db:DbhelperService,@Inject(MAT_DIALOG_DATA) public jobOfferData:any) { }

  currentDate: any;
  ngOnInit(): void {
   
  }
  accept(){
    this.db.recruiterRejectApplication(this.jobOfferData.studentId, this.jobOfferData.id,this.jobOfferData.recruiterId)
    
  }

}
