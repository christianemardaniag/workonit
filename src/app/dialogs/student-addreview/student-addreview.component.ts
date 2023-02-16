import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { get, getDatabase, ref } from 'firebase/database';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { StudentAddreviewConfirmComponent } from '../student-addreview-confirm/student-addreview-confirm.component';

@Component({
  selector: 'app-student-addreview',
  templateUrl: './student-addreview.component.html',
  styleUrls: ['./student-addreview.component.css']
})
export class StudentAddreviewComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public jobOfferData: any, public db: DbhelperService, public dialogRef: MatDialog, public spinner:NgxSpinnerService,) { }
  recruiter:any = {}
  comment="";
  rating:any;
  student:any={}
  isReviewed = false;

  ngOnInit(): void {
    this.getRecruiter()

    
  }

  getRecruiter(){
    this.spinner.show()
    const recruiterRef = ref(getDatabase(), "Recruiters/" + this.jobOfferData.recruiterId)
    get(recruiterRef).then((snapshot)=> {
      this.recruiter = snapshot.val()
      this.spinner.hide()
    })
  }
  submitReview(value:any){
    value.rating = this.rating
    value.recruiterId = this.jobOfferData.recruiterId
 


     this.dialogRef.open(StudentAddreviewConfirmComponent,{data:value})
  }



}
