import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { get } from '@angular/fire/database';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { Database, set, ref, update } from "@angular/fire/database";
import { getDatabase, limitToLast, onValue, orderByChild, query } from 'firebase/database';
import { MatDialog } from '@angular/material/dialog';
import { LogoutComponent } from 'src/app/dialogs/logout/logout.component';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { NotificationsViewComponent } from 'src/app/dialogs/notifications-view/notifications-view.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [DatePipe]
})
export class NavbarComponent implements OnInit {
  @Output() menuClicked = new EventEmitter<boolean>();
  constructor(public db: DbhelperService, public dialogRef: MatDialog, public spinner: NgxSpinnerService, public router: Router,public datePipe: DatePipe) {

  }
  checkAuth: boolean = false;
  user: any;
  notifNumber:any;
  notifData:any = []
  notifCounter = 0
  currentDate: any;
  date = new Date();

  ngOnInit(): void {
    this.checkIfAuth();
    this.getNotification()
   
    setInterval(()=> { this.checkJobOffer() },1000);
  }
  
  menuEvent(clicked: boolean) {
    this.menuClicked.emit(clicked);
   

  }
  checkJobOffer(){
    
    const jobOfferRef = ref(getDatabase(),"Job Offers/")
    get(jobOfferRef).then((snapshot)=>{
      snapshot.forEach((jobOfferKey)=> {
        
        const jobOfferRef2 = ref(getDatabase(),"Job Offers/" + jobOfferKey.key + "/")
        get(jobOfferRef2).then((snapshot)=>{
        snapshot.forEach((items)=>{
        const data = items.val()
        const endDate = new Date(data.dateDuration)

        this.currentDate = new Date()
        
        if(this.currentDate.valueOf() >= endDate ){
          const jobOfferSpecificRef = ref(getDatabase(),"Job Offers/" + jobOfferKey.key +"/" + data.id +"/")
          update(jobOfferSpecificRef, {
            status: "archived"
          })
        }
      })
        })
      })

    })
  }
  getNotification(){
 
    const currentUser = localStorage.getItem("currentUser") || '{}'
    const notifRef = ref(getDatabase(),"Notifications/" + currentUser)
    const studentRef = ref(getDatabase(), "Students/")
    const notifRef2 = query(ref(getDatabase(),"Notifications/" + currentUser))
    
    get(studentRef).then((snapshot)=>{
      if(snapshot.hasChild(currentUser)){
        
        onValue(notifRef2,(snapshot)=>{
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
      this.router.navigate(["StudentHome"]);
    }
    else if (this.user == "admin" && currentUser){
      this.router.navigate(["AdminDashboard"])
    }
    else if (this.user == "recruiter" && currentUser){
      this.router.navigate(["RecruiterDashboard"])
    }

    else {

       this.router.navigate([""])
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
}
