import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-admin-deactivate-recruiter',
  templateUrl: './admin-deactivate-recruiter.component.html',
  styleUrls: ['./admin-deactivate-recruiter.component.css']
})
export class AdminDeactivateRecruiterComponent implements OnInit {


  constructor(public db: DbhelperService, @Inject(MAT_DIALOG_DATA) public recruiterData: any) { }

  ngOnInit(): void {

  }
  deactivateRecruiter() {
    this.db.deactivateRecruiter(this.recruiterData.id);
  }

}
