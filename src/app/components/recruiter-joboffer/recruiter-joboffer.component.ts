import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { get, getDatabase, onValue, ref } from 'firebase/database';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { LogoutComponent } from 'src/app/dialogs/logout/logout.component';
import { NotificationsViewComponent } from 'src/app/dialogs/notifications-view/notifications-view.component';
import { RecruiterAddJobofferComponent } from 'src/app/dialogs/recruiter-add-joboffer/recruiter-add-joboffer.component';
import { RecruiterJoboffersViewComponent } from 'src/app/dialogs/recruiter-joboffers-view/recruiter-joboffers-view.component';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-recruiter-joboffer',
  templateUrl: './recruiter-joboffer.component.html',
  styleUrls: ['./recruiter-joboffer.component.css']
})
export class RecruiterJobofferComponent implements OnInit {

  constructor(public db: DbhelperService, public dialogRef: MatDialog, public spinner: NgxSpinnerService, public router:Router) { }
  jobOffers: any = [];
  recruiter: any = {};
  p: number = 1;
  searchText: string = "";
  jobOfferStatus = "active";
  ngOnInit(): void {

    this.getActiveJobOffer();
    this.recruiter = this.db.getCurrentRecruiter();
    this.getNotification()
    this.checkIfAuth()

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
  getActiveJobOffer() {
    const recruiterId = localStorage.getItem("currentUser");
    const jobOfferRef = ref(getDatabase(), "Job Offers/" + recruiterId);
    this.spinner.show();

    onValue(jobOfferRef, (snapshot) => {
      this.jobOffers = [];
      snapshot.forEach((snapshot2) => {
        var data = snapshot2.val();

        if (data.status == "active") {
          this.jobOffers.push(snapshot2.val());
        }


      })
      this.spinner.hide();

    })

  }

  getArchiveJobOffer() {
    const recruiterId = localStorage.getItem("currentUser");
    const jobOfferRef = ref(getDatabase(), "Job Offers/" + recruiterId);

    this.spinner.show();
    onValue(jobOfferRef, (snapshot) => {
      this.jobOffers = [];
      snapshot.forEach((snapshot2) => {
        var data = snapshot2.val();

        if (data.status == "archived") {
          this.jobOffers.push(snapshot2.val());
        }


      })

      this.spinner.hide();
    })

  }




  openAddJobOffer() {
    this.dialogRef.open(RecruiterAddJobofferComponent, { width: "80%" })
  }
  readMore(value: any) {
    this.dialogRef.open(RecruiterJoboffersViewComponent, { width: "80%", data: value, panelClass: 'custom-dialog-container' });
  }
}
