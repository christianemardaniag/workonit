import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { DbstorageService } from 'src/app/services/dbstorage.service';
import { concatMap } from 'rxjs';
import { get } from '@angular/fire/database';
import { getDatabase, onValue, ref } from 'firebase/database';
import { getAuth } from '@angular/fire/auth';
import { LogoutComponent } from 'src/app/dialogs/logout/logout.component';
import { StudentJobapplicationViewComponent } from 'src/app/dialogs/student-jobapplication-view/student-jobapplication-view.component';
import { NotificationsViewComponent } from 'src/app/dialogs/notifications-view/notifications-view.component';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-student-profile-edit',
  templateUrl: './student-profile-edit.component.html',
  styleUrls: ['./student-profile-edit.component.css']
})
export class StudentProfileEditComponent implements OnInit {

  constructor(public db: DbhelperService, public dbstorage: DbstorageService, public toast: HotToastService, public router:Router, public dialogRef:MatDialog) { }
  student: any = {};
  skills: any = [];
  inputedSkill: string = "";

  ngOnInit(): void {
    this.student = this.db.getCurrentStudent();
    this.skills = this.db.getSkillsCurrentStudent();
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
      }else {
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
  editProfileDetails(value: any) {
    var contactNo = "+63" + value.contactNo;
    this.db.editProfileDetails(value.firstName, value.middleName, value.lastName, value.address, value.idNo, value.section, contactNo, this.skills);
  }
  getInputSkill(value: string) {

    this.inputedSkill = value;
  }
  addSkill() {
    if (this.inputedSkill.length != 0) {
      this.skills.push(this.inputedSkill);
      this.inputedSkill = "";
    }

  }
  removeSkill(index: any) {
    if (index > -1) {
      this.skills.splice(index, 1);
    }
  }
  resetPassword() {
    var email = this.student.email

    this.db.resetPassword(email);
  }

  uploadImage(event: any) {
    var currentUser = localStorage.getItem("currentUser");
    this.dbstorage.uploadProfilePicture(event.target.files[0], `images/profile pictures/${currentUser}`).pipe(
      this.toast.observe({
        loading: "Image is being uploaded...",
        success: "Image uploaded!",
        error: "There was  an error uploading"
      }), concatMap((photoURL) => this.db.updateProfilePicStudent(photoURL))
    ).subscribe();
  }
  uploadResume(event: any) {
    var currentUser = localStorage.getItem("currentUser");
    this.dbstorage.uploadResume(event.target.files[0], `images/resume/${currentUser}`).pipe(
      this.toast.observe({
        loading: "Resume is being uploaded...",
        success: "Resume uploaded!",
        error: "There was  an error uploading"
      }), concatMap((photoURL) => this.db.updateResumeStudent(photoURL))
    ).subscribe();
  }


}

