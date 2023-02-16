import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { get, getDatabase, ref } from 'firebase/database';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { RecruiterAnnouncementConfirmComponent } from '../recruiter-announcement-confirm/recruiter-announcement-confirm.component';

@Component({
  selector: 'app-recruiter-announcement-view',
  templateUrl: './recruiter-announcement-view.component.html',
  styleUrls: ['./recruiter-announcement-view.component.css']
})
export class RecruiterAnnouncementViewComponent implements OnInit {

  constructor(public db: DbhelperService, public dialogRef: MatDialog) { }
  jobOffers:any = []
  jobPositionInput:any =""
  statusInput:any=""
  ngOnInit(): void {

    this.getJobPosition()

  }

  createAnnouncement(value: any) {
    if(this.jobPositionInput != "" && this.statusInput != ""){
      value["sendTo"] = "both"
    }
    else if (this.jobPositionInput != ""){
      value["sendTo"] = "jobPosition"
    }
    else if (this.statusInput !=""){
      value["sendTo"] = "status"
    }
    
    this.dialogRef.open(RecruiterAnnouncementConfirmComponent, {
      data:value
    })
  }

  getJobPosition(){
    const recruiterId = localStorage.getItem("currentUser")
    const jobOfferRef = ref(getDatabase(),"Job Offers/" + recruiterId +"/")

    get(jobOfferRef).then((snapshot)=>{
      snapshot.forEach((items)=>{
        const data = items.val()
        this.jobOffers.push(data)
      })
      
    })
  }
}
