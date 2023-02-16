import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-recruiter-joboffer-archive',
  templateUrl: './recruiter-joboffer-archive.component.html',
  styleUrls: ['./recruiter-joboffer-archive.component.css']
})
export class RecruiterJobofferArchiveComponent implements OnInit {

  constructor(public db: DbhelperService, @Inject(MAT_DIALOG_DATA) public jobOfferData: any) { }

  ngOnInit(): void {
  }
  archiveJobOffer() {
    this.db.archiveJobOffer(this.jobOfferData.id);
  }

}
