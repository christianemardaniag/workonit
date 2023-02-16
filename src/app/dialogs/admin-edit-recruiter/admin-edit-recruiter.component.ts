import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-admin-edit-recruiter',
  templateUrl: './admin-edit-recruiter.component.html',
  styleUrls: ['./admin-edit-recruiter.component.css']
})
export class AdminEditRecruiterComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public editEvaluatorData: any, public db: DbhelperService) { }
  recruiter: any = {};
  ngOnInit(): void {

    this.recruiter = this.editEvaluatorData;

  }

  editUser(value: any) {
    this.db.editRecruiter(value.companyName, value.recruiterName, this.editEvaluatorData.id);
  }


}
