import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { get, getDatabase, ref } from 'firebase/database';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { DatePipe } from '@angular/common';
import { StudentJobofferConfirmComponent } from '../student-joboffer-confirm/student-joboffer-confirm.component';
import {Chart, registerables} from 'chart.js'
@Component({
  selector: 'app-student-joboffer-view',
  templateUrl: './student-joboffer-view.component.html',
  styleUrls: ['./student-joboffer-view.component.css'],
  providers: [DatePipe]
})
export class StudentJobofferViewComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public jobOfferData: any, public db: DbhelperService, public dialogRef: MatDialog,
  public datePipe: DatePipe) { }
  jobOffer: any = {};
  recruiter: any = {};
  date = new Date();
  currentDate: any;
  student:any = {}
  rating:any;
  ratingLabel = 0;
  sentimentData:any = []
  ngOnInit(): void {
    this.jobOffer = this.jobOfferData;
    this.sentimentData = this.db.getSentimentDataStudentView(this.jobOffer.recruiterId)
    this.jobOffer["dateDuration"] =  this.jobOffer["dateDuration"].replace("T"," ")
    this.getRecruiterId(this.jobOffer.recruiterId);
    this.currentDate = this.datePipe.transform(this.date, "yyyy-MM-dd");
    this.student = this.db.getCurrentStudent()
  


  }
  
  getRecruiterId(key:any){
    Chart.register(...registerables);
    const recruiterRef = ref(getDatabase(), "Recruiters/"+key)
    const recruiterRatingRef = ref(getDatabase(),"Recruiters/" + key +"/rating/" )
    var rating = 0;
    var numOfChild=0;
    get(recruiterRef).then((snapshot)=>{
      var data = snapshot.val()
      this.recruiter["name"] = data.recruiterName
      this.recruiter["profilePicture"] = data.photoURL
      this.recruiter["companyLogo"] = data.companyLogo
    
      
   
    }).then(()=> {
      get(recruiterRatingRef).then((snapshot)=> {
         numOfChild = snapshot.size
        
        snapshot.forEach((item)=> {
          
          const recruiterRatingRef2 = ref(getDatabase(),"Recruiters/" + key +"/rating/"+item.key +"/" )
          get(recruiterRatingRef2).then((snapshot)=> {
              snapshot.forEach((item)=> {
                  var data = item.val()
                  rating += data.rating
                 

              })
             
          }).then(()=> {
            
              this.rating = Math.ceil(rating/numOfChild)
              
              this.ratingLabel = rating/numOfChild
           
          })
        })
      
     
      })
    })
   
  }

  applyJobOffer(){
    this.dialogRef.open(StudentJobofferConfirmComponent, {data:this.jobOffer} )
  }
  
 

}
