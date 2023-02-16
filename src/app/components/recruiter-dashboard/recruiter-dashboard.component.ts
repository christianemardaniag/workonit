import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {Chart, registerables} from 'chart.js'
import { getAuth } from 'firebase/auth';
import { get, getDatabase, onValue, ref } from 'firebase/database';
import { NgxSpinnerService } from 'ngx-spinner';
import { LogoutComponent } from 'src/app/dialogs/logout/logout.component';
import { NotificationsViewComponent } from 'src/app/dialogs/notifications-view/notifications-view.component';
import { DbhelperService } from 'src/app/services/dbhelper.service';


@Component({
  selector: 'app-recruiter-dashboard',
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.css']
})
export class RecruiterDashboardComponent implements OnInit {

  hiredCount: any;
  notHiredCount: any;
  rating:any;
  recruiter:any = {}
  ratingLabel:any;
  constructor( public db: DbhelperService, public dialogRef: MatDialog, public spinner:NgxSpinnerService, public router:Router) { }
  sentimentData:any = []
  data = [
    "Hello", "world", "normally", "you", "want", "more", "words",
    "than", "this"].map(function (d) {
      return { text: d, value: 10 + Math.random() * 90};
    })
  ngOnInit(): void {
    this.sentimentData = this.db.getSentimentData()

    this.getGraphs()
    this.recruiter = this.db.getCurrentRecruiter()
    this.getNotification()
    this.checkIfAuth()
    
 
  }
  barChartLabels:any = [];
  studentApplication: any = [];
  studentCount:any =[];
  colors:any = []
  recruiterRating:any = [];
  recruiterRatingCount:any =[];
  numberOfStudent = 0
  numberOfJobOffer = 0
  jobOffer:any = []
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

    if (this.user == "recruiter" && currentUser) {
      this.router.navigate(["RecruiterDashboard"]);
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
  getGraphs(){
    Chart.register(...registerables);

    const studentApplication = ref(getDatabase(),"Student Applications/")
    const studentRef = ref(getDatabase(),"Students/")
    var recruiterId = localStorage.getItem("currentUser")
    const recruiterRef = ref(getDatabase(),"Sentiment Analyis/" + recruiterId)
    const recruiterRatingRef = ref(getDatabase(),"Recruiters/" + recruiterId +"/rating/" )
    const jobOfferRef = ref(getDatabase(),"Job Offers/" + recruiterId +"/")
      get(jobOfferRef).then((snapshot)=> {
        this.numberOfJobOffer = snapshot.size
        snapshot.forEach((items)=> {
          var item = items.val()
          this.barChartLabels.push(item.jobPosition)
          this.studentCount[item.id] = 0
          this.colors.push(this.getRandomColor())
        
        })
      
      }).then(()=> {

        get(studentApplication).then((snapshot)=> {
          this.hiredCount = 0
          this.notHiredCount = 0
          snapshot.forEach((item)=> {
            item.forEach((item2)=> {
              var data = item2.val()
              if(data.recruiterId == recruiterId){
                 
                
                this.numberOfStudent++;
  
                if(data.status != "Hired"){
                    this.notHiredCount++
                }
                else {
                  this.hiredCount++
                }
  
           
                this.jobOffer.push(data.jobOfferId)
              
           
       
                
              }
            })
          })
        }).then(()=> {
          this.jobOffer.forEach((item:any)=>{
            Object.entries(this.studentCount).forEach(([key, value]) => {
       
              if(item == key){
                
                this.studentCount[key] +=1
              
              }
           });
          })
         
         this.studentApplication = Object.values(this.studentCount);
          var barChart = new Chart("barChart", {
            type: 'bar',
            data: {
              labels: this.barChartLabels,
              datasets: [{
                label: 'Number of Applicant',
                data: this.studentApplication,
                backgroundColor: this.colors,
                borderColor: [
                 
                ],
                borderWidth: 1,
      
             
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true
                },
      
              }, animation: {
                duration: 500 * 1.5,
                easing: 'linear'
              },
              plugins: {
                legend: {
                  display: false
                },
                title: {
                  display: true,
                  text: 'NUMBER OF APPLICATION PER JOB POSITION'
                },
      
              },
      
      
            }
          });
          var barChart = new Chart("barChart-sideNav", {
            type: 'bar',
            data: {
              labels: this.barChartLabels,
              datasets: [{
                label: 'Number of Applicant',
                data: this.studentApplication,
                backgroundColor: this.colors,
                borderColor: [
                 
                ],
                borderWidth: 1,
      
             
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true
                },
      
              }, animation: {
                duration: 500 * 1.5,
                easing: 'linear'
              },
              plugins: {
                legend: {
                  display: false
                },
                title: {
                  display: true,
                  text: 'NUMBER OF APPLICATION PER JOB POSITION'
                },
      
              },
      
      
            }
          });
          const dataChart = {
            labels: [
              "Hired",
              "Not Hired"
            ],
            datasets: [{
              label: 'Number of applicants',
              data: [this.hiredCount,this.notHiredCount] ,
              backgroundColor: [
                'rgba(255, 170, 40,1)',
                '#cf542f',
               
              ],
              hoverOffset: 4
            }]
          };
      
          var pieChart =  new Chart("pieChart", {
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
                  text: 'NUMBER OF HIRED APPLICANTS'
                },
      
              },
     
            },
      
          });
          var pieChart =  new Chart("pieChart-sideNav", {
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
                  text: 'NUMBER OF HIRED APPLICANTS'
                },
      
              },
     
            },
      
          });
       
       
        }).then(()=> {
         
          var numOfChild = 0
          var rating = 0
          get(recruiterRatingRef).then((snapshot)=> {
            numOfChild = snapshot.size
           
           snapshot.forEach((item)=> {
             
             const recruiterRatingRef2 = ref(getDatabase(),"Recruiters/" + recruiterId +"/rating/"+item.key +"/" )
             get(recruiterRatingRef2).then((snapshot)=> {
                 snapshot.forEach((item)=> {
                     var data = item.val()
                     rating += data.rating
                    
   
                 })
                
             }).then(()=> {
               
                 this.rating = Math.ceil(rating/numOfChild)
                 
                 this.ratingLabel = rating/numOfChild
              
             })
           })
         
        
         })
        }).then(()=> {
      
        })
      })
      
      


   
  }
  getRandomColor() {
    var colors = [      'rgba(255, 170, 40,1)',
    '#cf542f'];
    const random = Math.floor(Math.random() * colors.length);
    return colors[random];
  }


}
