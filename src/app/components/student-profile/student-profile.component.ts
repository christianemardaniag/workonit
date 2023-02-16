import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import {Chart, registerables} from 'chart.js'
import { get, getDatabase, onValue, ref } from 'firebase/database';
import { LogoutComponent } from 'src/app/dialogs/logout/logout.component';
import { NotificationsViewComponent } from 'src/app/dialogs/notifications-view/notifications-view.component';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { StudentResumeViewComponent } from 'src/app/dialogs/student-resume-view/student-resume-view.component';



@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit {

  constructor(public db: DbhelperService, public router: Router, public dialogRef:MatDialog) { }
  student: any = {};
  ngOnInit(): void {
    this.student = this.db.getCurrentStudent();
    this.checkIfAuth();
    this.getNotification()
    this.getStudentRating()

  

  }

  sideNavOpened = false;
  checkAuth: boolean = false;
  user: any;
  notifNumber:any;
  notifData:any = []
  notifCounter = 0
  rating:any;
  ratingLabel:any;
  sideNavClose() {
    this.sideNavOpened = false;

  }


  
  getStudentRating(){
    Chart.register(...registerables);
    var numOfChild = 0
    var rating = 0
    const studentId = localStorage.getItem("currentUser")
    const studentRatingRef = ref(getDatabase(),"Students/" + studentId + "/rating/")
    const studentRef = ref(getDatabase(),"Students/" + studentId)
    get(studentRatingRef).then((snapshot)=> {
      numOfChild = snapshot.size
     
     snapshot.forEach((item)=> {
       
       const studentRatingRef2 = ref(getDatabase(),"Students/" + studentId +"/rating/"+item.key +"/" )
       get(studentRatingRef2).then((snapshot)=> {
           snapshot.forEach((item)=> {
               var data = item.val()
               rating += data.rating
              

           })
          
       }).then(()=> {
         
           this.rating = Math.ceil(rating/numOfChild)
           
           this.ratingLabel = rating/numOfChild
        
       })
     })
   
  
   }).then(()=> {
    get(studentRef).then((snapshot)=>{
      var data = snapshot.val()
      if(data.positive != 0 || data.negative != 0){
    
        const dataChart = {
          labels: [
            "Positive",
            "Negative"
          ],
          datasets: [{
            label: 'Sentiment Analysis',
            data: [data.positive, data.negative],
            backgroundColor: [
              'rgba(255, 170, 40,1)',
              '#cf542f',
             
            ],
            hoverOffset: 4
          }]
        };
  
        new Chart("myChart-sideNav", {
          type: 'pie',
          data: dataChart,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom"
              },
              title: {
                display: true,
                text: 'Sentiment Analysis'
              },
    
            },
   
          },
    
        });
        new Chart("myChart-sideNav2", {
          type: 'pie',
          data: dataChart,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom"
              },
              title: {
                display: true,
                text: 'Sentiment Analysis'
              },
    
            },
   
          },
    
        });
      }
   
    })
  })
    
   
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
  goToEditProfile() {
    this.router.navigate(["StudentEditProfile"])
  }

  generateResume(){
    this.dialogRef.open(StudentResumeViewComponent,{
      data:this.student,
      width:"80%"
    })
  }


}
