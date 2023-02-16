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
import { AdminAddRecruiterComponent } from 'src/app/dialogs/admin-add-recruiter/admin-add-recruiter.component';
import { AdminEditRecruiterComponent } from 'src/app/dialogs/admin-edit-recruiter/admin-edit-recruiter.component';
import { AdminDeactivateRecruiterComponent } from 'src/app/dialogs/admin-deactivate-recruiter/admin-deactivate-recruiter.component';
import { AdminReactivateRecruiterComponent } from 'src/app/dialogs/admin-reactivate-recruiter/admin-reactivate-recruiter.component';
import { AdminViewStudentComponent } from 'src/app/dialogs/admin-view-student/admin-view-student.component';
import { NotificationsViewComponent } from 'src/app/dialogs/notifications-view/notifications-view.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-student',
  templateUrl: './admin-student.component.html',
  styleUrls: ['./admin-student.component.css']
})
export class AdminStudentComponent implements OnInit {

  displayedColumns: string[] = ['studentNo', "studentName", 'studentId', 'studentEmail', 'studentContactNo',"companyName","jobPosition", "studentStatus"];
  dataSource!: MatTableDataSource<any>;


  @ViewChild("sort1") sort!: MatSort;

  @ViewChild("table1", { static: false }) paginator!: MatPaginator;

  dataSource2!: MatTableDataSource<any>;

  statusInput:any =""
  @ViewChild("sort2") sort2!: MatSort;

  @ViewChild("table2", { static: false }) paginator2!: MatPaginator;


  constructor(public db: DbhelperService, public dialogRef: MatDialog,public router:Router) { }

  ngOnInit(): void {
  

    this.checkIfAuth()
    this.getNotification()
    this.getAllStudentJobApplications()


  }

  filterByStatus(){
    if(this.statusInput == ""){
      this.getAllStudentJobApplications()
    }
    else if(this.statusInput =="Hired"){
      this.getAllStudentJobApplicationsHired()
    }
    else if(this.statusInput == "Not Hired"){
      this.getAllStudentJobApplicationsNotHired()
    }
  }

  getAllStudentJobApplications() {
   
    const studentJobApplicationRef = ref(getDatabase(),"Student Applications/")
    var studentJobApplicationObj:any = []
    onValue(studentJobApplicationRef, (snapshot) => {
      snapshot.forEach((item)=> {
        item.forEach((item2)=> {
          const studentJobOffer = item2.val()
          studentJobApplicationObj = [];
          
          const jobApplicationRef = ref(getDatabase(),"Job Offers/")
          get(jobApplicationRef).then((snapshot)=> {
            snapshot.forEach((item2)=>{
              const jobApplicationRef2 = ref(getDatabase(),"Job Offers/" + item2.key +"/" + studentJobOffer.jobOfferId);
              const studentRef = ref(getDatabase(),"Students/" +studentJobOffer.studentId)
          
              get(studentRef).then((snapshot)=> {
                const studentData = snapshot.val()
               
                if(studentData.hired){
                  studentJobOffer["studentStatus"] = "Hired"
                }else{
                  studentJobOffer["studentStatus"] = "Not Hired"
                }
                
                studentJobOffer["studentNo"] = studentData.idno
                studentJobOffer["studentName"] = studentData.Lastname + " " + studentData.Middlename +" " + studentData.Firstname
                studentJobOffer["studentEmail"] = studentData.email
                studentJobOffer["studentContactNo"] = studentData.contactNo
                studentJobOffer["studentId"] = studentData.id
              }).then(()=> {
                get(jobApplicationRef2).then((snapshot)=> {
                  var data = snapshot.val()
                  
                  if(data != null){
                  const recruiterRef = ref(getDatabase(),"Recruiters/" + data.recruiterId)
                  get(recruiterRef).then((snapshot)=> {
                      
                      var recruiter = snapshot.val()
                     
                      studentJobOffer["companyName"] = recruiter.companyName;
                      studentJobOffer["jobPosition"] = data.jobPosition
    
                 
               
                   
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
        
      })
    
    })
  

  }
  getAllStudentJobApplicationsHired() {
   
    const studentJobApplicationRef = ref(getDatabase(),"Student Applications/")
    var studentJobApplicationObj:any = []
    onValue(studentJobApplicationRef, (snapshot) => {
      snapshot.forEach((item)=> {
        item.forEach((item2)=> {
          const studentJobOffer = item2.val()
          studentJobApplicationObj = [];
          var studentData:any;
          const jobApplicationRef = ref(getDatabase(),"Job Offers/")
          get(jobApplicationRef).then((snapshot)=> {
            snapshot.forEach((item2)=>{
              const jobApplicationRef2 = ref(getDatabase(),"Job Offers/" + item2.key +"/" + studentJobOffer.jobOfferId);
              const studentRef = ref(getDatabase(),"Students/" +studentJobOffer.studentId)
          
              get(studentRef).then((snapshot)=> {
                studentData = snapshot.val()
               
                if(studentData.hired){
                  studentJobOffer["studentStatus"] = "Hired"
                }else{
                  studentJobOffer["studentStatus"] = "Not Hired"
                }
                
                studentJobOffer["studentNo"] = studentData.idno
                studentJobOffer["studentName"] = studentData.Lastname + " " + studentData.Middlename +" " + studentData.Firstname
                studentJobOffer["studentEmail"] = studentData.email
                studentJobOffer["studentContactNo"] = studentData.contactNo
                studentJobOffer["studentId"] = studentData.id
              }).then(()=> {
                get(jobApplicationRef2).then((snapshot)=> {
                  var data = snapshot.val()
                  
                  if(data != null){
                  const recruiterRef = ref(getDatabase(),"Recruiters/" + data.recruiterId)
                  get(recruiterRef).then((snapshot)=> {
                      
                      var recruiter = snapshot.val()
                     
                      studentJobOffer["companyName"] = recruiter.companyName;
                      studentJobOffer["jobPosition"] = data.jobPosition
    
                 
               
                      if(studentData.hired){
                        studentJobApplicationObj.push(studentJobOffer)
                      }
                      
                      
                    
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
        
      })
    
    })
  

  }

  getAllStudentJobApplicationsNotHired() {
   
    const studentJobApplicationRef = ref(getDatabase(),"Student Applications/")
    var studentJobApplicationObj:any = []
    onValue(studentJobApplicationRef, (snapshot) => {
      snapshot.forEach((item)=> {
        item.forEach((item2)=> {
          const studentJobOffer = item2.val()
          studentJobApplicationObj = [];
          var studentData:any;
          const jobApplicationRef = ref(getDatabase(),"Job Offers/")
          get(jobApplicationRef).then((snapshot)=> {
            snapshot.forEach((item2)=>{
              const jobApplicationRef2 = ref(getDatabase(),"Job Offers/" + item2.key +"/" + studentJobOffer.jobOfferId);
              const studentRef = ref(getDatabase(),"Students/" +studentJobOffer.studentId)
          
              get(studentRef).then((snapshot)=> {
                studentData = snapshot.val()
               
                if(studentData.hired){
                  studentJobOffer["studentStatus"] = "Hired"
                }else{
                  studentJobOffer["studentStatus"] = "Not Hired"
                }
                
                studentJobOffer["studentNo"] = studentData.idno
                studentJobOffer["studentName"] = studentData.Lastname + " " + studentData.Middlename +" " + studentData.Firstname
                studentJobOffer["studentEmail"] = studentData.email
                studentJobOffer["studentContactNo"] = studentData.contactNo
                studentJobOffer["studentId"] = studentData.id
              }).then(()=> {
                get(jobApplicationRef2).then((snapshot)=> {
                  var data = snapshot.val()
                  
                  if(data != null){
                  const recruiterRef = ref(getDatabase(),"Recruiters/" + data.recruiterId)
                  get(recruiterRef).then((snapshot)=> {
                      
                      var recruiter = snapshot.val()
                     
                      studentJobOffer["companyName"] = recruiter.companyName;
                      studentJobOffer["jobPosition"] = data.jobPosition
    
                 
               
                      if(!studentData.hired){
                        studentJobApplicationObj.push(studentJobOffer)
                      }
                      
                      
                    
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
        
      })
    
    })
  

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

  openStudent(value:any){
    this.dialogRef.open(AdminViewStudentComponent, {
      data:value,
      width:"80%"
    })
  }





}
