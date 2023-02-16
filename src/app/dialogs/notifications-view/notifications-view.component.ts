import { Component, OnInit,Inject, NgZone } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getDatabase, ref, remove, update } from 'firebase/database';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { DbhelperService } from 'src/app/services/dbhelper.service';

@Component({
  selector: 'app-notifications-view',
  templateUrl: './notifications-view.component.html',
  styleUrls: ['./notifications-view.component.css']
})
export class NotificationsViewComponent implements OnInit {

  constructor(public db:DbhelperService,@Inject(MAT_DIALOG_DATA) public notificationData:any, public spinner:NgxSpinnerService, public toast:NgToastService, public dialogRef: MatDialog, private ngZone: NgZone, public router: Router) { }

  
  ngOnInit(): void {
    
    this.notificationData.sort(this.sortFunction)
  }
  sortFunction(a:any,b:any){  
    
    var dateA = new Date(a.date).getTime();
    var dateB = new Date(b.date).getTime();
    return dateA < dateB ? 1 : -1;  
}; 
  viewNotif(value:any){
    this.spinner.show();
    
    const currentUser = localStorage.getItem("currentUser") 
    const notifRef = ref(getDatabase(), "Notifications/" + currentUser + "/" + value.id)
    if(value.userType == "student"){
      update(notifRef, {
        status:"read"
      }).then(()=> {
        this.spinner.hide();
        this.ngZone.run(() => this.router.navigate(["StudentApplication"]));   
        this.dialogRef.closeAll();
      })
    }
    else {
      update(notifRef, {
        status:"read"
      }).then(()=> {
        this.spinner.hide();
        this.ngZone.run(() => this.router.navigate(["RecruiterApplicants"]));   
        this.dialogRef.closeAll();
      })
    }
 
   
    

  }
  deleteNotif(value:any){
    this.spinner.show();
    const currentUser = localStorage.getItem("currentUser")
    const notifRef = ref(getDatabase(), "Notifications/" + currentUser + "/" + value.id)
    remove(notifRef).then(()=> {
      this.spinner.hide();
      this.toast.success({ detail: "SUCCESS", summary: "Notification successfully deleted", duration: 3000 });
      this.dialogRef.closeAll();
    })
  }

}
