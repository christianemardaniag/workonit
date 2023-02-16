import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { MatDialog } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { get, getDatabase, onValue, ref } from 'firebase/database';
import { LogoutComponent } from 'src/app/dialogs/logout/logout.component';
import { NotificationsViewComponent } from 'src/app/dialogs/notifications-view/notifications-view.component';

@Component({
  selector: 'app-recruiter-profile',
  templateUrl: './recruiter-profile.component.html',
  styleUrls: ['./recruiter-profile.component.css']
})
export class RecruiterProfileComponent implements OnInit {

  constructor(public db: DbhelperService, public router: Router, public dialogRef:MatDialog) { }
  recruiter: any = {};
  ngOnInit(): void {

    this.recruiter = this.db.getCurrentRecruiter();
    this.checkIfAuth();
    this.getNotification()


  

  }

  sideNavOpened = false;
  checkAuth: boolean = false;
  user: any;
  notifNumber:any;
  notifData:any = []
  notifCounter = 0
  sideNavClose() {
    this.sideNavOpened = false;

  }

  childEvent(clicked: boolean) {
    this.sideNavOpened = clicked;

  }
  getNotification(){
 
    const currentUser = localStorage.getItem("currentUser") || '{}'
    const notifRef = ref(getDatabase(),"Notifications/" + currentUser)
    const studentRef = ref(getDatabase(), "Students/")
    get(studentRef).then((snapshot)=>{
      if(snapshot.hasChild(currentUser)){
        onValue(notifRef,(snapshot)=>{
          this.notifCounter = 0
          this.notifData = []
            snapshot.forEach((item)=> {
              var data = item.val()
              if(data.status == "unread"){
                this.notifCounter++
              }
              data["userType"] = "student"
              this.notifData.push(data)
            })
            
        })
      }
      else {
        onValue(notifRef,(snapshot)=>{
          this.notifCounter = 0
          this.notifData = []
            snapshot.forEach((item)=> {
              var data = item.val()
              if(data.status == "unread"){
                this.notifCounter++
              }
              data["userType"] = "recruiter"
              this.notifData.push(data)
            })
            
        })
      }
    })

  }

  openDialog() {
    this.dialogRef.open(LogoutComponent);
  }
  openNotif(){
     this.dialogRef.open(NotificationsViewComponent, {
      width:"80%",
      data:this.notifData
     })
  }
  goToHome() {

    var currentUser = localStorage.getItem('currentUser') as string;

    if (this.user == "student" && currentUser) {
      this.router.navigate(["Home"]);
    }

    else {

      this.router.navigate([""]);
    }
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
            
            }
         


          });

        })
      } else {
        this.router.navigate([""]);
      }

    });
  }
  goToAboutWork() {
    this.router.navigate(["AboutWorkOnIt"]);
  }
  goToAboutCICT() {
    this.router.navigate(["AboutCICT"]);
  }
  goToAboutDevelopers() {
    this.router.navigate(["AboutDevelopers"]);
  }
  goToAdminAboutWork() {
    this.router.navigate(["AdminAboutWorkOnIt"]);
  }
  goToAdminAboutCICT() {
    this.router.navigate(["AdminAboutCICT"]);
  }
  goToAdminAboutDevelopers() {
    this.router.navigate(["AdminAboutDevelopers"]);
  }
  goToAboutTheDevelopers(){
    this.router.navigate(["AboutDevelopers"])
  }
  goToEditProfile() {
    this.router.navigate(["RecruiterEditProfile"])
  }


}
