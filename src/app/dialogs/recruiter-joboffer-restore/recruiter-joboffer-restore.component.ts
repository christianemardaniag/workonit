import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-recruiter-joboffer-restore',
  templateUrl: './recruiter-joboffer-restore.component.html',
  styleUrls: ['./recruiter-joboffer-restore.component.css']
})
export class RecruiterJobofferRestoreComponent implements OnInit {

  constructor(public db: DbhelperService, @Inject(MAT_DIALOG_DATA) public jobOfferData: any) { }

  ngOnInit(): void {
  }
  restoreJobOffer() {
    this.db.restoreJobOffer(this.jobOfferData.id);
  }

}
