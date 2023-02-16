import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-admin-add-developer',
  templateUrl: './admin-add-developer.component.html',
  styleUrls: ['./admin-add-developer.component.css']
})
export class AdminAddDeveloperComponent implements OnInit {

  constructor(public db: DbhelperService, @Inject(MAT_DIALOG_DATA) public editEvaluatorData: any) { }
  image: any;
  getFileInput(value: any) {
    this.image = value.target.files[0];
  }

  ngOnInit(): void {


  }
  addDeveloper(value: any) {

    this.db.addDeveloper(value.developerName, this.image);




  }



}
