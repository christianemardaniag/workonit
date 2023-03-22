
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { get, getDatabase, onValue, ref } from 'firebase/database';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { LogoutComponent } from 'src/app/dialogs/logout/logout.component';
import { NotificationsViewComponent } from 'src/app/dialogs/notifications-view/notifications-view.component';
import { RecruiterJoboffersViewComponent } from 'src/app/dialogs/recruiter-joboffers-view/recruiter-joboffers-view.component';
import { StudentJobofferViewComponent } from 'src/app/dialogs/student-joboffer-view/student-joboffer-view.component';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrls: ['./student-home.component.css']
})
export class StudentHomeComponent implements OnInit {

  constructor(public db:DbhelperService, public spinner:NgxSpinnerService, public dialogRef: MatDialog, public router:Router,public toast:NgToastService) { }
  jobOffers: any = [];
  recruiters: any = [];
  p: number = 1;
  searchText: string = "";
  jobOfferStatus = "active";
  studentJobApplications:any = []
  developers: any;
  checkAuth: boolean = false;
  user: any;
  notifNumber:any;
  notifData:any = []
  notifCounter = 0
  ngOnInit(): void {
    this.getAllRecruiter()
    this.getAllJobOffer()
    this.db.getDevelopers().subscribe({
      next: (res) => {
        this.developers = res;


      }
    });
    this.checkIfAuth();
    this.getNotification()
    this.checkResume()

  }
  sideNavOpened = false;
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
      this.router.navigate(["StudentHome"]);
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
  getAllJobOffer() {
    this.studentJobApplications= []
    const jobOfferRef = ref(getDatabase(), "Job Offers/");
    this.spinner.show();
    const studentId = localStorage.getItem("currentUser")
    const studentJobOfferApplicationRef = ref(getDatabase(),"Student Applications/" + studentId +"/")
    get(studentJobOfferApplicationRef).then((snapshot)=> {
      snapshot.forEach((item)=> {
        var data = item.val()

          this.studentJobApplications.push(data.jobOfferId)

        
      
      })
    }).then(()=> {
      onValue(jobOfferRef,(snapshot)=> {
     
        snapshot.forEach((recruiterId)=> {
          
          const jobKey = ref(getDatabase(), "Job Offers/" + recruiterId.key)
          
          get(jobKey).then((item)=> {
            this.jobOffers = []
            item.forEach((snapshot)=> {
             
              var data = snapshot.val();
            
              const recruiterRef = ref(getDatabase(),'Recruiters/' + data.recruiterId)
              get(recruiterRef).then((recruiter)=> {
                var recruiterData = recruiter.val()
                data["companyLogo"] = recruiterData.companyLogo
               
          
              }).then(()=> {
              
                if(!this.studentJobApplications.includes(data.id)){
                  if (data.status == "active" && data.vacancy > 0) {
                    
                    this.jobOffers.push(data);
                  }
                  this.spinner.hide();
                }
              
              })
            })
       
          })
        }) 
      })
      
    })
  
 

  }
  getAllJobOfferBySkills(){
    this.studentJobApplications= []
    const jobOfferRef = ref(getDatabase(), "Job Offers/");
    this.spinner.show();
    const currentUser = localStorage.getItem("currentUser");
    const studentRef = ref(getDatabase(),"Students/"+currentUser)
    var studentSkills:any = []
    const studentId = localStorage.getItem("currentUser")
    const studentJobOfferApplicationRef = ref(getDatabase(),"Student Applications/" + studentId +"/")
    get(studentJobOfferApplicationRef).then((snapshot)=> {
      snapshot.forEach((item)=> {
        var data = item.val()
        this.studentJobApplications.push(data.jobOfferId)
      
      })
    }).then(()=> {
      get(studentRef).then((snapshot)=> {
        var data = snapshot.val()
        studentSkills = data.skills;
       
      }).then(()=> {
        onValue(jobOfferRef,(snapshot)=> {
       
          snapshot.forEach((recruiterId)=> {
            
            const jobKey = ref(getDatabase(), "Job Offers/" + recruiterId.key)
            
            get(jobKey).then((item)=> {
              this.jobOffers = []
              item.forEach((snapshot)=> {
               
                var data = snapshot.val();
             
                const recruiterRef = ref(getDatabase(),'Recruiters/' + data.recruiterId)
                get(recruiterRef).then((recruiter)=> {
                  var recruiterData = recruiter.val()
                  data["companyLogo"] = recruiterData.companyLogo
                 
            
                }).then(()=> {
                  if(!this.studentJobApplications.includes(data.id)){
                    if (data.status == "active") {
                      data.skills.forEach((skill:any)=> {
                        if(studentSkills.includes(skill)){
                          this.jobOffers.push(data);
                        }
                      })
                  }
                 
                    
                  }
                  this.spinner.hide();
                })
              })
         
            })
          }) 
        })
      })
    })
   
  }

  readMore(value: any) {
    this.dialogRef.open(StudentJobofferViewComponent, { width: "80%", data: value, panelClass: 'custom-dialog-container' });
  }
  applyFilter(event:any){
    const filterValue = (event.target as HTMLInputElement).value;
    if(filterValue == ""){
      this.getAllJobOffer()
    }
    else if(filterValue=="skills"){
      this.getAllJobOfferBySkills()
    }
    
  }

  getAllRecruiter(){
    const recruiterRef = ref(getDatabase(),"Recruiters/")
    
    get(recruiterRef).then((snapshot)=> {
      snapshot.forEach((item)=> {
        this.recruiters.push(item.val())
      })
    
    })
  }
  getAllJobOfferByCompany(companyId:any){
    const filterValue = (companyId.target as HTMLInputElement).value;
   
    this.studentJobApplications= []
    const jobOfferRef = ref(getDatabase(), "Job Offers/"+filterValue+"/");
    this.spinner.show();
    const studentId = localStorage.getItem("currentUser")
    const studentJobOfferApplicationRef = ref(getDatabase(),"Student Applications/" + studentId +"/")
    get(studentJobOfferApplicationRef).then((snapshot)=> {
      snapshot.forEach((item)=> {
        var data = item.val()

          this.studentJobApplications.push(data.jobOfferId)

        
      
      })
    }).then(()=> {
    get( ref(getDatabase(), "Job Offers/")).then((snapshot)=> {
      if( filterValue == ""){
        this.getAllJobOffer()
      }
      else if(snapshot.hasChild(filterValue)){
       
        get(jobOfferRef).then((item)=> {
          this.jobOffers = []
         
          item.forEach((snapshot)=> {
       
            var data = snapshot.val();
          
            const recruiterRef = ref(getDatabase(),'Recruiters/' + data.recruiterId)
            get(recruiterRef).then((recruiter)=> {
              var recruiterData = recruiter.val()
              data["companyLogo"] = recruiterData.companyLogo
             
        
            }).then(()=> {
            
              if(!this.studentJobApplications.includes(data.id)){
                if (data.status == "active" && data.vacancy != 0) {
                  
                  this.jobOffers.push(data);
                }
                this.spinner.hide();
              }
            
            })
          })
     
        })
      }
      else{
        this.jobOffers = []
        this.spinner.hide();
      }
 
    })
      
      
    }).catch(()=> {
      this.spinner.hide();
    })
  
  }
  checkResume(){
    const studentId = localStorage.getItem("currentUser")
    const studentRef = ref(getDatabase(),"Students/"+studentId+"/")

    get(studentRef).then((snapshot)=> {
        var data = snapshot.val()
        if(!data.resume){
          this.toast.info({ detail: "NOTICE", summary: "Resume is required before applying", duration: 5000 });
        }

    })
  }
}
