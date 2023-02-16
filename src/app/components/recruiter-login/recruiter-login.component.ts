import { Component, OnInit } from '@angular/core';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from 'src/app/dialogs/forgot-password/forgot-password.component';
import { NgToastComponent, NgToastService } from 'ng-angular-popup';
import { get, getDatabase, ref } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Router } from '@angular/router'

@Component({
  selector: 'app-recruiter-login',
  templateUrl: './recruiter-login.component.html',
  styleUrls: ['./recruiter-login.component.css']
})
export class RecruiterLoginComponent implements OnInit {
  constructor(public db: DbhelperService, public dialogRef: MatDialog, public toast: NgToastService, public router:Router) { }

   user:any;
  checkAuth:any
  ngOnInit(): void {
    this.checkIfAuth()
  }
  checkIfAuth() {
    getAuth().onAuthStateChanged((user) => {

      var currentUser = localStorage.getItem('currentUser') as string;

      const studentRef = ref(getDatabase(), "Students/");
      const adminRef = ref(getDatabase(), "Administrator/");
      const recruiterRef = ref(getDatabase(), "Recruiters/")

      if (currentUser) {
        get(studentRef).then((snapshot) => {
          if (snapshot.hasChild(currentUser)) {
            this.user = "student";

            if (user != null && user?.emailVerified) {
              this.checkAuth = true;
            }
            else {
              this.checkAuth = false;
            }
            this.router.navigate(["StudentHome"]);
          }


        }).then(() => {
          get(adminRef).then((snapshot) => {
            if (snapshot.hasChild(currentUser)) {
              this.user = "admin";

              if (user != null) {
                this.checkAuth = true;
              }
              else {
                this.checkAuth = false;
              }
              this.router.navigate(["AdminDashboard"]);
            }


          })
        }).then(() => {
          get(recruiterRef).then((snapshot) => {
            if (snapshot.hasChild(currentUser)) {
              this.user = "recruiter";


              if (user != null) {
                this.checkAuth = true;
              }
              else {
                this.checkAuth = false;
              }
              this.router.navigate(["RecruiterDashboard"]);
            }


          });

        })
      }

    });
  }

  Login(value: any) {
    this.db.loginRecruiter(value.email, value.password);
  }
  goToForgotPassword() {
    this.dialogRef.open(ForgotPasswordComponent, { width: "70%", })
  }


}
