import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-recruiter-addreview-confirm',
  templateUrl: './recruiter-addreview-confirm.component.html',
  styleUrls: ['./recruiter-addreview-confirm.component.css']
})
export class RecruiterAddreviewConfirmComponent  implements OnInit {
  constructor(public db:DbhelperService,@Inject(MAT_DIALOG_DATA) public reviewData:any) { }
  ngOnInit(): void {
   
  }
  submit(){
    
   this.db.recruiterSubmitRating(this.reviewData.comment,this.reviewData.studentId,this.reviewData.rating)
  }

}
