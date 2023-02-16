import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { get, getDatabase, onValue, ref } from 'firebase/database';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { StudentAddreviewComponent } from '../student-addreview/student-addreview.component';
import { StudentJobapplicationCancelComponent } from '../student-jobapplication-cancel/student-jobapplication-cancel.component';
import {Chart, registerables} from 'chart.js'
import { StudentJobapplicationAcceptHireComponent } from '../student-jobapplication-accept-hire/student-jobapplication-accept-hire.component';
import { StudentJobapplicationRejectHireComponent } from '../student-jobapplication-reject-hire/student-jobapplication-reject-hire.component';
@Component({
  selector: 'app-student-jobapplication-view',
  templateUrl: './student-jobapplication-view.component.html',
  styleUrls: ['./student-jobapplication-view.component.css']
})
export class StudentJobapplicationViewComponent implements OnInit {
  
  @ViewChild('attachment') attachmentInput!: ElementRef;
  constructor(@Inject(MAT_DIALOG_DATA) public jobOfferData: any, public db: DbhelperService, public dialogRef: MatDialog, public spinner:NgxSpinnerService) { }
  jobOffer: any = {};
  recruiter: any = {};
  student:any = {}
  messages: any = [];
  responseDetails: any = {};
  userId: any;
  message: any;
  attachment: any;
  attachmentType: any;
  attachmentName = "";
  rating:any;
  ratingLabel = 0;
  application: any = {};
  isReviewed=false;
  isThreeMonthsElapse = false;
  sentimentData:any = []
  
  ngOnInit(): void {
    this.spinner.show()
    this.sentimentData = this.db.getSentimentDataStudentView(this.jobOfferData.recruiterId)
    this.getStudentReview()
    this.getJobOfferData()
    this.getRecruiterId(this.jobOfferData.recruiterId);
    this.getStudentData()
    this.getMessages()
    
    this.userId = localStorage.getItem("currentUser")
  
  



  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  @ViewChild('chatBox') private myScrollContainer!: ElementRef;
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  getStudentReview(){
    const studentRef = ref(getDatabase(),"Students/"+ this.jobOfferData.studentId)
    const studentReviewRef = ref(getDatabase(), "Recruiters/" + this.jobOfferData.recruiterId +"/rating/" + this.jobOfferData.studentId)
    get(studentRef).then((snapshot)=>{
      var data = snapshot.val()
      if(data.hiredDate){
        const startDate = new Date(data.hiredDate)
        const endDate = new Date(startDate.getTime() + 3*30*24*60*60*1000)
        const currentDate = new Date()
      
        if(currentDate.valueOf() >= endDate.valueOf()){
          this.isThreeMonthsElapse = true;
        }
       
        
        
      }
 
    
    }).then(()=>{
      get(studentReviewRef).then((snapshot)=> {
        snapshot.forEach((item)=> {
        
          this.isReviewed = true
          
        })
       
       
    })
    })

  }

  getStudentData(){
   
    const studentRef = ref(getDatabase(),"Students/" + this.jobOfferData.studentId)
    get(studentRef).then((snapshot)=> {
      var data = snapshot.val()
      this.student["name"] = data.Firstname +" " +data.Middlename +" " + data.Lastname
      this.student["gender"] = data.gender
      this.student["address"]= data.Address
      this.student["email"] = data.email
      var newContactNo = ""
      newContactNo = data.contactNo.replace("+63", "")
      this.student["contactNo"]  = newContactNo
      this.student["profilePicture"] = data.photoURL
      this.student["skills"] = data.skills
      this.student["resume"] = data.resume
      
     

    })
  }
  getJobOfferData(){
    const jobOfferRef = ref(getDatabase(),"Job Offers/")
    get(jobOfferRef).then((snapshot)=> {
      snapshot.forEach((item)=> {
        if(item != null){
          const jobOfferRef = ref(getDatabase(),"Job Offers/"+item.key+"/"+this.jobOfferData.jobOfferId)
        get(jobOfferRef).then((snapshot)=> {
          if(snapshot.val() != null){
            var data = snapshot.val();
            data["applicationStatus"] = this.jobOfferData.status;
            this.jobOffer = data;
            this.jobOffer["dateDuration"] =  this.jobOffer["dateDuration"].replace("T"," ")
            this.spinner.hide()
            
          }
          
          
        })
        }
        
      })
    })


  }
  getRecruiterId(key:any){

  
    Chart.register(...registerables);
    const recruiterRef = ref(getDatabase(), "Recruiters/"+key)
    const recruiterRatingRef = ref(getDatabase(),"Recruiters/" + key +"/rating/" )
    var rating = 0;
    var numOfChild=0;
    get(recruiterRef).then((snapshot)=>{
      var data = snapshot.val()
      this.recruiter["name"] = data.recruiterName
      this.recruiter["profilePicture"] = data.photoURL
      this.recruiter["companyLogo"] = data.companyLogo
    
      
   
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
  cancelJobOffer(){
    this.dialogRef.open(StudentJobapplicationCancelComponent, {data:this.jobOfferData})
  }
  getAttachment(value: any) {
    this.attachment = value.target.files[0];
    this.attachmentName = this.attachment.name;


  }
  removeAttachment() {
    this.attachmentInput.nativeElement.value = "";
    this.attachment = null;
    this.attachmentName = "";
  }

  submitResponse(value: any) {
    if (this.attachment) {
      if (this.attachment.type.includes("image/")) {
        this.attachmentType = "image";
      }
      else if (this.attachment.type.includes("application/")) {
        this.attachmentType = "application";
      }
      else if (this.attachment.type.includes("text/")) {
        this.attachmentType = "text";
      }
    }

    this.db.makeResponseRecruiter(value.jobOfferId, this.jobOfferData.studentId, value.message, this.attachment, this.attachmentType);
   
    this.message = "";
    this.attachmentInput.nativeElement.value = "";
    this.attachment = null;
    this.attachmentName = "";
  }

  getMessages(){
    const responseRef = ref(getDatabase(), "Student Applications/" + this.jobOfferData.studentId + "/" + this.jobOfferData.id+ "/" + "messages/");
    onValue(responseRef, (snapshot) => {

      this.messages = [];

      snapshot.forEach((snapshot2) => {
        const data = snapshot2.val();

        this.messages.push(data);




      });

      return;
    });

}



addReview(){
  this.dialogRef.open(StudentAddreviewComponent, {width:"80%", data:this.jobOfferData})
}

acceptHire(){
  this.dialogRef.open(StudentJobapplicationAcceptHireComponent, {
    data:this.jobOfferData
  })
}
rejectHire(){
  this.dialogRef.open(StudentJobapplicationRejectHireComponent, {
    data:this.jobOfferData
  })
}


}
