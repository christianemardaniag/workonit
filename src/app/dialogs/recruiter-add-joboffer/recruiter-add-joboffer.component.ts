import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-recruiter-add-joboffer',
  templateUrl: './recruiter-add-joboffer.component.html',
  styleUrls: ['./recruiter-add-joboffer.component.css'],
  providers: [DatePipe]

})
export class RecruiterAddJobofferComponent implements OnInit {
  skills: string[] = [];
  inputedSkill: string = "";
  attachment:any;
  attachmentName:any;
  constructor(public datePipe: DatePipe, public db: DbhelperService) { }

  ngOnInit(): void {


    

  }

  addJobOffer(value: any) {
    var date:any;
    var currentDate:any;
    date = new Date();
    currentDate = this.datePipe.transform(date, "YYYY-MM-ddTHH:mm");
    this.db.addJobOffer(value.jobPosition, value.jobDescription, value.location, value.vacancy, this.skills, currentDate,value.dateDuration,this.attachment)


  
    
  }
  getAttachment(value: any) {
    this.attachment = value.target.files[0];
    
   


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
  removeSkill(index: any) {
    if (index > -1) {
      this.skills.splice(index, 1);
    }


  }

}
