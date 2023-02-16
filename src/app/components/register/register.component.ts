import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';

import { DataPrivacyComponent } from 'src/app/dialogs/data-privacy/data-privacy.component';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(public dialogRef: MatDialog, public db: DbhelperService, public toast: NgToastService) { }
  skills: string[] = [];
  inputedSkill: string = "";
  ngOnInit(): void {


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

  toggleBool: boolean = true;

  checkBox(event: any) {

    if (event.target.checked) {
      this.toggleBool = false;
    }
    else {
      this.toggleBool = true;
    }
  }

  goToPrivacy() {
    this.dialogRef.open(DataPrivacyComponent);
  }
  registerUser(value: any) {
    var contactNo = "+63" + value.contactNo;
    this.db.registerStudent(value.first_name, value.middle_name, value.last_name, value.address, value.email, value.password, value.repassword, value.gender, value.idNo, value.section, this.skills, contactNo);

  }

}
