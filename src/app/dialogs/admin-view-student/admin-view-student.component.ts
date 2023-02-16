import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { get, getDatabase, onValue, ref } from 'firebase/database';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import {Chart, registerables} from 'chart.js'

@Component({
  selector: 'app-admin-view-student',
  templateUrl: './admin-view-student.component.html',
  styleUrls: ['./admin-view-student.component.css']
})
export class AdminViewStudentComponent implements OnInit {
  displayedColumns: string[] = ['jobPosition',"companyName","recruiterName","email","contactNo","id","date","jobOfferId","recruiterId","status"];
  dataSource!: MatTableDataSource<any>;
  studentJobApplication:any = [];
 


  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild("activeTable", { static: false }) paginator!: MatPaginator;
  constructor(@Inject(MAT_DIALOG_DATA) public studentData: any, public db: DbhelperService, public dialogRef: MatDialog, public spinner:NgxSpinnerService) { }
  student:any = {}
  rating:any;
  ratingLabel:any;
  ngOnInit(): void {
    this.getAllStudentJobApplications()
    this.getStudentData()
    this.getStudentRating()
   
 
  }
  getStudentData(){
    const studentRef = ref(getDatabase(),"Students/" + this.studentData.studentId)
    get(studentRef).then((snapshot)=> {
      var data = snapshot.val()
      this.student["name"] = data.Firstname +" " +data.Middlename +" " + data.Lastname
      this.student["gender"] = data.gender
      this.student["address"]= data.Address
      this.student["email"] = data.email
      var newContactNo = ""
      this.student["idno"] = data.idno
      this.student["section"] = data.section
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
      this.student["positive"] = data.positive
      this.student["negative"]= data.negative
      
     

    })
  }
  
  getStudentRating(){
    Chart.register(...registerables);
    var numOfChild = 0
    var rating = 0
    const studentId = this.studentData.studentId
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
  getAllStudentJobApplications() {
    const studentId = this.studentData.studentId
    const studentJobApplicationRef = ref(getDatabase(),"Student Applications/" + studentId + "/")
    var studentJobApplicationObj:any = []
    onValue(studentJobApplicationRef, (snapshot) => {
      snapshot.forEach((item)=> {
        this.spinner.show()
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
                this.spinner.hide()
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

}
