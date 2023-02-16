import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { get, getDatabase, onValue, ref } from 'firebase/database';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { RecruiterJobapplicantConfirmComponent } from '../recruiter-jobapplicant-confirm/recruiter-jobapplicant-confirm.component';
import { RecruiterJobapplicantHireConfirmComponent } from '../recruiter-jobapplicant-hire-confirm/recruiter-jobapplicant-hire-confirm.component';
import { RecruiterApplicantHireRejectComponent } from '../recruiter-jobapplicant-hire-reject/recruiter-applicant-hire-reject.component';
import { RecruiterJobapplicantRejectComponent } from '../recruiter-jobapplicant-reject/recruiter-jobapplicant-reject.component';
import { RecruiterAddreviewComponent } from '../recruiter-addreview/recruiter-addreview.component';
import {Chart, registerables} from 'chart.js'

@Component({
  selector: 'app-recruiter-jobapplicant-view',
  templateUrl: './recruiter-jobapplicant-view.component.html',
  styleUrls: ['./recruiter-jobapplicant-view.component.css'],
  providers: [DatePipe]
  
})
export class RecruiterJobapplicantViewComponent implements OnInit {
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
  application: any = {};
  isThreeMonthsElapse = false;
  isReviewed = false
  rating:any;
  ratingLabel:any;
  ngOnInit(): void {
    this.spinner.show()
    this.getJobOfferData()
    this.getStudentData()
    this.getRecruiterId(this.jobOfferData.recruiterId);
    this.getMessages()
    this.getStudentReview()
    this.userId = localStorage.getItem("currentUser")
    this.getStudentRating()



  }
  ngAfterViewChecked() {
    this.scrollToBottom();
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
      if(data.photoURL){
        this.student["profilePicture"] = data.photoURL
      }
      else{
        this.student["profilePicture"] = "./assets/images/defaultimage.jpg"
      }
     
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
    const recruiterRef = ref(getDatabase(), "Recruiters/"+key)
    get(recruiterRef).then((snapshot)=>{
      this.recruiter = snapshot.val()
      
    })
  }

  acceptApplicant(){
    this.dialogRef.open(RecruiterJobapplicantConfirmComponent, {data:this.jobOfferData})

  }
  rejectApplicant(){
    this.dialogRef.open(RecruiterJobapplicantRejectComponent, {data:this.jobOfferData})
  }

  getAttachment(value: any) {
    this.attachment = value.target.files[0];
    this.attachmentName = this.attachment.name;
    

  }
  getStudentRating(){
    Chart.register(...registerables);
    var numOfChild = 0
    var rating = 0
    const studentId =this.jobOfferData.studentId
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
        if(this.jobOfferData.status == 'Pending'){
          new Chart("myChart-sideNav", {
            type: 'pie',
            data: dataChart,
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: {
                    color:"white"
                  }
                  
                },
  
                title: {
                  display: true,
                  text: 'Sentiment Analysis',
                  color: "white"
                },
      
              },
     
            },
      
          });
        }
        
      if(this.jobOfferData.status == 'Processing' || this.jobOfferData.status == 'Hired' || this.jobOfferData.status == 'Confirmation'){
        new Chart("myChart-sideNav2", {
          type: 'pie',
          data: dataChart,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  color:"white"
                }
           
              },
              title: {
                display: true,
                text: 'Sentiment Analysis',
                color: "white"
              },
    
            },
   
          },
    
        });
      }
       
        
      }
   
    })
  })
    
   
  }
  getStudentReview(){
    const studentRef = ref(getDatabase(),"Students/"+ this.jobOfferData.studentId)
    const studentReviewRef = ref(getDatabase(), "Students/" + this.jobOfferData.studentId +"/rating/" + this.jobOfferData.recruiterId)
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
  @ViewChild('chatBox') private myScrollContainer!: ElementRef;
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  hire(){
    this.dialogRef.open(RecruiterJobapplicantHireConfirmComponent, {
      data:this.jobOfferData
    })
  }
  reject(){
    this.dialogRef.open(RecruiterApplicantHireRejectComponent, {
      data:this.jobOfferData
    })
  }

  addReviewStudent(){
    console.log(this.jobOfferData)
    this.dialogRef.open(RecruiterAddreviewComponent, {
      data:this.jobOfferData,
      width:"80%"
    })
  }

 

}
