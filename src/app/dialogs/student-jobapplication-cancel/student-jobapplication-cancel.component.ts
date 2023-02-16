import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-student-jobapplication-cancel',
  templateUrl: './student-jobapplication-cancel.component.html',
  styleUrls: ['./student-jobapplication-cancel.component.css']
})
export class StudentJobapplicationCancelComponent implements OnInit {

  constructor(public db:DbhelperService,@Inject(MAT_DIALOG_DATA) public jobOfferData:any) { }

  ngOnInit(): void {

  }
  cancelJobApplication(){
    this.db.studentCancelJobOffer(this.jobOfferData.id)
  }

}
