import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-recruiter-joboffer-edit',
  templateUrl: './recruiter-joboffer-edit.component.html',
  styleUrls: ['./recruiter-joboffer-edit.component.css']
})
export class RecruiterJobofferEditComponent implements OnInit {
  skills: string[] = [];
  inputedSkill: string = "";
  attachment:any;
  jobOffer: any = {};
  attachmentName:any;
  constructor(public db: DbhelperService, @Inject(MAT_DIALOG_DATA) public jobOfferData: any) { }

  ngOnInit(): void {
    this.jobOffer = this.jobOfferData;
    this.jobOfferData.skills.forEach((value: any) => {
      this.skills.push(value);
    })
  
   
    


  }

  editJobOffer(value: any) {
 
  this.db.editJobOffer(value.jobPosition, value.jobDescription, value.location, value.vacancy, this.skills, this.jobOfferData.id,value.dateDuration,this.attachment)

  }
  getInputSkill(value: string) {

    this.inputedSkill = value;
  }
  addSkill() {
    if (this.inputedSkill.length != 0) {
      this.skills.push(this.inputedSkill.toUpperCase());
      this.inputedSkill = "";
    }

  }
  getAttachment(value: any) {
    this.attachment = value.target.files[0];
    


  }
  removeSkill(index: any) {

    if (index > -1) {
      this.skills.splice(index, 1);
    }


  }

}
