import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { get, getDatabase, ref } from 'firebase/database';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { StudentAddreviewConfirmComponent } from '../student-addreview-confirm/student-addreview-confirm.component';
import { RecruiterAddreviewConfirmComponent } from '../recruiter-addreview-confirm/recruiter-addreview-confirm.component';

@Component({
  selector: 'app-recruiter-addreview',
  templateUrl: './recruiter-addreview.component.html',
  styleUrls: ['./recruiter-addreview.component.css']
})
export class RecruiterAddreviewComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public jobOfferData: any, public db: DbhelperService, public dialogRef: MatDialog, public spinner:NgxSpinnerService,) { }
  student:any = {}
  comment="";
  rating:any;

  isReviewed = false;

  ngOnInit(): void {
    this.getStudent()

    
  }

  getStudent(){
    this.spinner.show()
    const studentRef = ref(getDatabase(), "Students/" + this.jobOfferData.studentId)
    get(studentRef).then((snapshot)=> {
      this.student = snapshot.val()
      this.spinner.hide()
    })
  }
  submitReview(value:any){
    value.rating = this.rating
    value.studentId = this.jobOfferData.studentId
 


     this.dialogRef.open(RecruiterAddreviewConfirmComponent,{data:value})
  }

}
