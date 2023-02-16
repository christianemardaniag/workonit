import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-student-addreview-confirm',
  templateUrl: './student-addreview-confirm.component.html',
  styleUrls: ['./student-addreview-confirm.component.css']
})
export class StudentAddreviewConfirmComponent implements OnInit {

  constructor(public db:DbhelperService,@Inject(MAT_DIALOG_DATA) public reviewData:any) { }

 
  ngOnInit(): void {
   
  }
  submit(){
    
   this.db.studentSubmitRating(this.reviewData.comment,this.reviewData.recruiterId,this.reviewData.rating)
  }


}
