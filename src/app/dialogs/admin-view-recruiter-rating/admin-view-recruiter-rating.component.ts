import { Component,OnInit,Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { getAuth } from 'firebase/auth';
import { get, getDatabase, onValue, ref } from 'firebase/database';
import { LogoutComponent } from 'src/app/dialogs/logout/logout.component';
import { NotificationsViewComponent } from 'src/app/dialogs/notifications-view/notifications-view.component';


@Component({
  selector: 'app-admin-view-recruiter-rating',
  templateUrl: './admin-view-recruiter-rating.component.html',
  styleUrls: ['./admin-view-recruiter-rating.component.css']
})
export class AdminViewRecruiterRatingComponent implements OnInit {
  constructor(public db: DbhelperService, public router: Router, public dialogRef:MatDialog, @Inject(MAT_DIALOG_DATA) public recruiterData: any) { }
  ratingsDataArr:any = []
  ratingsData:any = {}
  studentNames:any = []
  ngOnInit(): void {
    this.getRecruiterData()
    

  }
  getRecruiterData(){
  
    const recruiterRef = ref(getDatabase(),"Recruiters/" + this.recruiterData.id +"/rating/")
    
    get(recruiterRef).then((snapshot)=>{
      snapshot.forEach((items)=>{
    
        const studentRef = ref(getDatabase(),"Students/"+ items.key +"/")
        get(studentRef).then((snapshot)=>{
          
          const studentData = snapshot.val()
   
          this.studentNames.push(studentData.Firstname +" " + studentData.Middlename +" "+ studentData.Lastname) 
          
        }).then(()=> {
          items.forEach((ratings)=>{
            
            const data  = ratings.val()
      
            this.ratingsDataArr.push(data)
         
          })
        }).then(()=> {
          
            var i = 0
          this.studentNames.forEach((items:any)=>{
            
              
              this.ratingsDataArr[i]["studentName"] = items
              i++
          
          })
       
        })
    
   
     
     
      })
      
    
      
     
    })
  }
  

}
