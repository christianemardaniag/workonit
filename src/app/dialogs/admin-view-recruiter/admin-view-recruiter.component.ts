import { Component, OnInit,Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { get, getDatabase, onValue, ref } from 'firebase/database';
import { LogoutComponent } from 'src/app/dialogs/logout/logout.component';
import { NotificationsViewComponent } from 'src/app/dialogs/notifications-view/notifications-view.component';
import { AdminViewRecruiterRatingComponent } from '../admin-view-recruiter-rating/admin-view-recruiter-rating.component';

@Component({
  selector: 'app-admin-view-recruiter',
  templateUrl: './admin-view-recruiter.component.html',
  styleUrls: ['./admin-view-recruiter.component.css']
})
export class AdminViewRecruiterComponent implements OnInit {
  constructor(public db: DbhelperService, public router: Router, public dialogRef:MatDialog, @Inject(MAT_DIALOG_DATA) public recruiterData: any) { }
  recruiter: any = {};
  sentimentData:any = []
  recruiterRating:any = {}
  rating:any;
  ratingLabel:any
  ngOnInit(): void {

    this.recruiter = this.getCurrentRecruiter()
    this.sentimentData = this.db.getSentimentDataStudentView(this.recruiterData.id)
    this.getRecruiterRating()
    


  

  }
  viewSentiment(){
    this.dialogRef.open(AdminViewRecruiterRatingComponent,{
      data:this.recruiterData,
      width:"80%"
    })
  }
  getRecruiterRating(){
    var key = this.recruiterData.id

    const recruiterRef = ref(getDatabase(), "Recruiters/"+key)
    const recruiterRatingRef = ref(getDatabase(),"Recruiters/" + key +"/rating/" )
    var rating = 0;
    var numOfChild=0;
    get(recruiterRef).then((snapshot)=>{
      var data = snapshot.val()
      this.recruiterRating["name"] = data.recruiterName
      this.recruiterRating["profilePicture"] = data.photoURL
      this.recruiterRating["companyLogo"] = data.companyLogo
    

   
    }).then(()=> {
      get(recruiterRatingRef).then((snapshot)=> {
         numOfChild = snapshot.size
        
        snapshot.forEach((item)=> {
          
          const recruiterRatingRef2 = ref(getDatabase(),"Recruiters/" + key +"/rating/"+item.key +"/" )
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
    })
   
  }
  getCurrentRecruiter() {
  
    var currentUser = this.recruiterData.id

    var recruiterObj: any = {};

    const recruiterRef = ref(getDatabase(), "Recruiters/" + currentUser);
    var contactNo: string;
    var newContactNo: string;
    onValue(recruiterRef, ((snapshot) => {
      const data = snapshot.val();

      recruiterObj.recruiterName = data.recruiterName;

      recruiterObj.photoURL = data.photoURL;
      recruiterObj.email = data.email;


      contactNo = data.contactNo;
      newContactNo = contactNo.replace("+63", "");
      recruiterObj.contactNo = newContactNo;
      recruiterObj.companyLogo = data.companyLogo;
      recruiterObj.rating = data.rating;
      recruiterObj.positive = data.rating;
      recruiterObj.negative = data.negative;




    }))



    return recruiterObj;



  }
}
