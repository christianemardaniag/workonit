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
  selector: 'app-admin-view-topcompany',
  templateUrl: './admin-view-topcompany.component.html',
  styleUrls: ['./admin-view-topcompany.component.css']
})
export class AdminViewTopcompanyComponent implements OnInit{
  hiredCount: any;
  notHiredCount: any;
  rating:any;
  constructor( public db: DbhelperService, public dialogRef: MatDialog, public spinner:NgxSpinnerService, public router:Router) { }

  ngOnInit(): void {
   
    this.getGraphs()
  }
  barChartLabels:any = [];
  studentApplication: any = [];
  studentCount:any =[];
  colors:any = []
  recruiterRating:any = [];
  recruiterRatingCount:any =[];
  numberOfStudent = 0
  numberOfRecruiter = 0
  sideNavOpened = false;
  checkAuth: boolean = false;
  user: any;
  notifNumber:any;
  notifData:any = []
  notifCounter = 0
  studentCountSorted:any = []
  studentCountSortedFive:any = []
  companyLabels:any = []
  companyLabelsFive:any = []

 
  
  getGraphs(){
    Chart.register(...registerables);
    const recruiterRef = ref(getDatabase(), "Recruiters/")
    const studentApplication = ref(getDatabase(),"Student Applications/")
    const studentRef = ref(getDatabase(),"Students/")
    get(recruiterRef).then((snapshot)=> {
      this.numberOfRecruiter = snapshot.size
      snapshot.forEach((item)=> {
        var data = item.val()

        if(data.status == 'activated'){
         
          
          this.studentApplication[data.id] = 0
          this.recruiterRating[data.id] = 0
          this.companyLabels[data.id] = data.companyName 
          this.colors.push(this.getRandomColor())
        }
        var numOfChild = 0
        var rating = 0
        var recruiterStatusRef = ref(getDatabase(),"Recruiters/" + data.id +"/rating/")
        get(recruiterStatusRef).then((snapshot)=> {
          numOfChild = snapshot.size
         
         snapshot.forEach((item)=> {
           
           const recruiterRatingRef2 = ref(getDatabase(),"Recruiters/" + data.id +"/rating/"+item.key +"/" )
           get(recruiterRatingRef2).then((snapshot)=> {
               snapshot.forEach((item)=> {
                   var data = item.val()
                   rating += data.rating
                  
 
               })
              
           }).then(()=> {
            Object.entries(this.studentApplication).forEach(([key, value]) => {
              if(data.id == key){
                this.recruiterRating[key] = rating/numOfChild
              }
              this.recruiterRatingCount = Object.values(this.recruiterRating);
              
           });
           
               
            
           })
         })
       
      
       })

      })

      
      
    }).then(()=> {
      get(studentApplication).then((snapshot)=> {
        snapshot.forEach((item)=> {
          item.forEach((item2)=> {
            var data = item2.val()
            Object.entries(this.studentApplication).forEach(([key, value]) => {
              if(data.recruiterId == key){
                this.studentApplication[key] +=1
           
              }
           });
          })
        })
        var sample = Object.entries(this.studentApplication).sort((a:any,b:any) => {
          var aVar:any, bVar:any
          aVar = Object.values(a)[1]
          bVar = Object.values(b)[1]
          return bVar - aVar
        
        })
        
        sample.forEach((items)=>{
          this.barChartLabels.push(this.companyLabels[items[0]])
        })
        
        this.studentCount = Object.values(this.studentApplication);
        this.studentCountSorted = this.studentCount.sort((n1:number,n2:number) => n2 - n1);
    
        

        
        


        
       
        
      }).then(()=> {
        get(studentRef).then((snapshot)=> {
           this.hiredCount = 0
           this.notHiredCount = 0
           this.numberOfStudent = snapshot.size
          snapshot.forEach((item)=>{
            var data = item.val()
            
            if(data.hired == true){
              this.hiredCount++
            }
            else{
              this.notHiredCount++
            }
            
          })
          
        }).then(()=> {
         
      
        })
        
     
      }).then(()=> {
        
        
        var barChart = new Chart("barChartModal", {
          type: 'bar',
          data: {
            labels: this.barChartLabels,
            datasets: [{
              label: 'Number of Applicant',
              data: this.studentCountSorted,
              backgroundColor: this.colors,
              borderColor: [
               
              ],
              borderWidth: 1,
    
           
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
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
                text: 'NUMBER OF APPLICATION PER COMPANY'
              },
    
            },
    
    
          }
        });

       
        
        
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
