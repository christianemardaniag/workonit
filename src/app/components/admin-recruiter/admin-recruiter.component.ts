import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { get } from '@angular/fire/database';
import { getDatabase, onValue, ref } from 'firebase/database';
import { getAuth } from '@angular/fire/auth';
import { LogoutComponent } from 'src/app/dialogs/logout/logout.component';
import { AdminAddRecruiterComponent } from 'src/app/dialogs/admin-add-recruiter/admin-add-recruiter.component';
import { AdminEditRecruiterComponent } from 'src/app/dialogs/admin-edit-recruiter/admin-edit-recruiter.component';
import { AdminDeactivateRecruiterComponent } from 'src/app/dialogs/admin-deactivate-recruiter/admin-deactivate-recruiter.component';
import { AdminReactivateRecruiterComponent } from 'src/app/dialogs/admin-reactivate-recruiter/admin-reactivate-recruiter.component';
import { NotificationsViewComponent } from 'src/app/dialogs/notifications-view/notifications-view.component';
import { Router } from '@angular/router';
import { AdminViewRecruiterComponent } from 'src/app/dialogs/admin-view-recruiter/admin-view-recruiter.component';

@Component({
  selector: 'app-admin-recruiter',
  templateUrl: './admin-recruiter.component.html',
  styleUrls: ['./admin-recruiter.component.css']
})
export class AdminRecruiterComponent implements OnInit {
  displayedColumns: string[] = ['companyName', "id", 'recruiterName', 'email', 'dateAdded', 'actions'];
  dataSource!: MatTableDataSource<any>;

  dataSource2!: MatTableDataSource<any>;
  dataSource3!: MatTableDataSource<any>;

  dataSource4!: MatTableDataSource<any>;


  @ViewChild("sort1") sort!: MatSort;

  @ViewChild("sort2") sort2!: MatSort;

  @ViewChild("sort3") sort3!: MatSort;

  @ViewChild("sort4") sort4!: MatSort;
  @ViewChild("activeTable", { static: false }) paginator!: MatPaginator;
  @ViewChild("archivedTable", { static: false }) paginator2!: MatPaginator;
  @ViewChild("activeTable2", { static: false }) paginator3!: MatPaginator;
  @ViewChild("archivedTable2", { static: false }) paginator4!: MatPaginator;
  tableStatus:any;
  constructor(public db: DbhelperService, public dialogRef: MatDialog,public router:Router) { }

  ngOnInit(): void {
    this.tableStatus = false
    this.getNotification()
    this.checkIfAuth()
    this.db.getAllEvaluator().subscribe({
      next: (res) => {


        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource3 = new MatTableDataSource(res);
        this.dataSource3.paginator = this.paginator3;
        this.dataSource3.sort = this.sort3;




      }
    });

    this.db.getAllEvaluatorDeactive().subscribe({
      next: (res) => {


        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
        this.dataSource4 = new MatTableDataSource(res);
        this.dataSource4.paginator = this.paginator4;
        this.dataSource4.sort = this.sort4;




      }
    });



  }
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



  activeButton() {

    
   
    this.db.getAllEvaluator().subscribe({
      next: (res) => {

        
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource3 = new MatTableDataSource(res);
        this.dataSource3.paginator = this.paginator3;
        this.dataSource3.sort = this.sort3;
        this.tableStatus = false;


      }
    });
  }
  archivedButton() {

    this.db.getAllEvaluatorDeactive().subscribe({
      next: (res) => {


        this.dataSource2 = new MatTableDataSource(res);
        this.dataSource2.paginator = this.paginator2;
        this.dataSource2.sort = this.sort2;
        this.dataSource4 = new MatTableDataSource(res);
        this.dataSource4.paginator = this.paginator4;
        this.dataSource4.sort = this.sort4;
        this.tableStatus = true;



      }
    });
  }

  addDialog() {
    this.dialogRef.open(AdminAddRecruiterComponent, {
      width: "80%"
    });
  }
  editDialog(row: any) {
    this.dialogRef.open(AdminEditRecruiterComponent, { data: row, width: "80%" });


  }
  deleteDialog(row: any) {
    this.dialogRef.open(AdminDeactivateRecruiterComponent, { data: row });
  }

  reactiveDialog(row: any) {
    this.dialogRef.open(AdminReactivateRecruiterComponent, { data: row });
  }
  
  viewDialog(row: any) {
    this.dialogRef.open(AdminViewRecruiterComponent, { data: row ,width:"80%"});
  }




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }
  applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();

    if (this.dataSource3.paginator) {
      this.dataSource3.paginator.firstPage();
    }
  }
  applyFilter4(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource4.filter = filterValue.trim().toLowerCase();

    if (this.dataSource4.paginator) {
      this.dataSource4.paginator.firstPage();
    }
  }


}
