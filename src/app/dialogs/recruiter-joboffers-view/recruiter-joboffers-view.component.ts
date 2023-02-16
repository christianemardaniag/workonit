import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { RecruiterJobofferArchiveComponent } from '../recruiter-joboffer-archive/recruiter-joboffer-archive.component';
import { RecruiterJobofferEditComponent } from '../recruiter-joboffer-edit/recruiter-joboffer-edit.component';
import { RecruiterJobofferRestoreComponent } from '../recruiter-joboffer-restore/recruiter-joboffer-restore.component';
import {Chart, registerables} from 'chart.js'
import { get, getDatabase, ref } from 'firebase/database';
@Component({
  selector: 'app-recruiter-joboffers-view',
  templateUrl: './recruiter-joboffers-view.component.html',
  styleUrls: ['./recruiter-joboffers-view.component.css']
})
export class RecruiterJoboffersViewComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public jobOfferData: any, public db: DbhelperService, public dialogRef: MatDialog) { }
  jobOffer: any = {};
  recruiter: any = {};
  rating:any;
  ratingLabel = 0;
  sentimentData:any = []
  ngOnInit(): void {
    this.jobOffer = this.jobOfferData;
    this.sentimentData = this.db.getSentimentData()
    this.jobOffer["dateDuration"] =  this.jobOffer["dateDuration"].replace("T"," ")
 
    this.getRecruiterId()



  }
  getRecruiterId(){
    var key = localStorage.getItem("currentUser")
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

  openEditJobOffer() {
    this.dialogRef.open(RecruiterJobofferEditComponent, { width: "80%", data: this.jobOfferData })
  }
  openArchiveJobOffer() {
    this.dialogRef.open(RecruiterJobofferArchiveComponent, { data: this.jobOfferData });
  }

  openRestoreJobOffer() {
    this.dialogRef.open(RecruiterJobofferRestoreComponent, { data: this.jobOfferData });
  }

}
