import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-admin-reactivate-recruiter',
  templateUrl: './admin-reactivate-recruiter.component.html',
  styleUrls: ['./admin-reactivate-recruiter.component.css']
})
export class AdminReactivateRecruiterComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public recruiterData: any, public db: DbhelperService) { }

  ngOnInit(): void {
  }
  reactivateRecruiter() {
    this.db.reactivateRecruiter(this.recruiterData.id);
  }

}
