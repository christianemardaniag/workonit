import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-admin-remove-developer',
  templateUrl: './admin-remove-developer.component.html',
  styleUrls: ['./admin-remove-developer.component.css']
})
export class AdminRemoveDeveloperComponent implements OnInit {

  constructor(public db: DbhelperService, @Inject(MAT_DIALOG_DATA) public developerData: any) { }

  ngOnInit(): void {

  }
  removeDeveloper() {
    this.db.removeDeveloper(this.developerData.id);
  }

}
