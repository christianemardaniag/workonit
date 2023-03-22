import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { get } from '@angular/fire/database';
import { getDatabase, onValue, ref } from 'firebase/database';
import { getAuth } from '@angular/fire/auth';
import { LogoutComponent } from 'src/app/dialogs/logout/logout.component';
import { StudentJobapplicationViewComponent } from 'src/app/dialogs/student-jobapplication-view/student-jobapplication-view.component';
import { NotificationsViewComponent } from 'src/app/dialogs/notifications-view/notifications-view.component';
import { Router } from '@angular/router';



@Component({
  selector: 'app-student-jobapplications',
  templateUrl: './student-jobapplications.component.html',
  styleUrls: ['./student-jobapplications.component.css']
})
export class StudentJobapplicationsComponent implements OnInit {
  displayedColumns: string[] = ['jobPosition',"companyName","id","date","jobOfferId","recruiterId","status"];
  dataSource!: MatTableDataSource<any>;
  dataSource2!: MatTableDataSource<any>;



  @ViewChild("sort1") sort!: MatSort;
  @ViewChild("table1", { static: false }) paginator!: MatPaginator;
  @ViewChild("sort2") sort2!: MatSort;
  @ViewChild("table2", { static: false }) paginator2!: MatPaginator;
  tableStatus = false;
  constructor(public db: DbhelperService, public dialogRef: MatDialog, public router:Router) { }
  studentJobApplication:any = [];
  ngOnInit(): void {
 
    

    this.getAllStudentJobApplications()
       
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

  getAllStudentJobApplications() {
    const studentId = localStorage.getItem("currentUser");
    const studentJobApplicationRef = ref(getDatabase(),"Student Applications/" + studentId + "/")
    var studentJobApplicationObj:any = []
    onValue(studentJobApplicationRef, (snapshot) => {
      snapshot.forEach((item)=> {
        const studentJobOffer = item.val()
        studentJobApplicationObj = [];
        const jobApplicationRef = ref(getDatabase(),"Job Offers/")
        get(jobApplicationRef).then((snapshot)=> {
          snapshot.forEach((item)=>{
            const jobApplicationRef2 = ref(getDatabase(),"Job Offers/" + item.key +"/" + studentJobOffer.jobOfferId);

            get(jobApplicationRef2).then((snapshot)=> {
              var data = snapshot.val()
              
              if(data != null){
              const recruiterRef = ref(getDatabase(),"Recruiters/" + data.recruiterId)
              get(recruiterRef).then((snapshot)=> {
                  
                  var recruiter = snapshot.val()
                 
                  studentJobOffer["companyName"] = recruiter.companyName;
                  studentJobOffer["contactNo"] = recruiter.contactNo
                  studentJobOffer["email"] = recruiter.email
                  studentJobOffer["recruiterName"]= recruiter.recruiterName
                  studentJobOffer["jobPosition"] = data.jobPosition
                  studentJobOffer["recruiterId"] = recruiter.id

             
           
               
                  studentJobApplicationObj.push(studentJobOffer)
                  
                
              }).then(()=> {
          
                this.dataSource = new MatTableDataSource(studentJobApplicationObj);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.dataSource2 = new MatTableDataSource(studentJobApplicationObj);
                this.dataSource2.paginator = this.paginator2;
                this.dataSource2.sort = this.sort2;
              })
            }
             
            })

          })
          
        })
      })
    
    })
  

  }


  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  applyFilter2(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }

  viewJobApplication(event:any){
    this.dialogRef.open(StudentJobapplicationViewComponent, {
      data:event,
      width: "80%",
      panelClass: 'custom-dialog-container'
    })
  }





}
