import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-recruiter-announcement-confirm',
  templateUrl: './recruiter-announcement-confirm.component.html',
  styleUrls: ['./recruiter-announcement-confirm.component.css']
})
export class RecruiterAnnouncementConfirmComponent implements OnInit {
  constructor(public db:DbhelperService,@Inject(MAT_DIALOG_DATA) public announcementData:any) { }

  currentDate: any;
  recruiter:any = {}
  ngOnInit(): void {
   this.recruiter = this.db.getCurrentRecruiter()
  }
  accept(){
    if(this.announcementData.sendTo == "jobPosition"){
      this.db.createAnnouncementJobPosition(this.announcementData.jobPosition,this.announcementData.announcement,this.recruiter.companyLogo)
    }else if(this.announcementData.sendTo == 'status'){
      this.db.createAnnouncement(this.announcementData.status,this.announcementData.announcement,this.recruiter.companyLogo)

    }
    else {
      this.db.createAnnouncementBoth(this.announcementData.jobPosition,this.announcementData.status,this.announcementData.announcement,this.recruiter.companyLogo)
    }
    
    
  }
}
