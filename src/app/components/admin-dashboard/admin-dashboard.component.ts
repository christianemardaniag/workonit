import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js'
import { getAuth } from 'firebase/auth';
import { get, getDatabase, onValue, ref } from 'firebase/database';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminViewTopcompanyComponent } from 'src/app/dialogs/admin-view-topcompany/admin-view-topcompany.component';
import { LogoutComponent } from 'src/app/dialogs/logout/logout.component';
import { NotificationsViewComponent } from 'src/app/dialogs/notifications-view/notifications-view.component';
import { DbhelperService } from 'src/app/services/dbhelper.service';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  hiredCount: any;
  notHiredCount: any;
  rating: any;
  constructor(public db: DbhelperService, public dialogRef: MatDialog, public spinner: NgxSpinnerService, public router: Router) { }

  ngOnInit(): void {
    this.getGraphs()
    this.getNotification()
    this.checkIfAuth()
  }
  barChartLabels: any = [];
  studentApplication: any = [];
  studentApplication2: any = [];
  studentCount: any = [];
  colors: any = []
  recruiterRating: any = [];
  recruiterRatingCount: any = [];
  numberOfStudent = 0
  numberOfRecruiter = 0
  sideNavOpened = false;
  checkAuth: boolean = false;
  user: any;
  notifNumber: any;
  notifData: any = []
  notifCounter = 0
  studentCountSorted: any = []
  studentCountSortedFive: any = []
  ratingCountSorted: any = []
  ratingCountSortedFive: any = []
  companyLabels: any = []
  perCompany: any = [];
  companyLabelsFive: any = []
  hiredPerMonthData: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  hiredPerYearData: any = {}
  pieChart: any;
  sideNavClose() {
    this.sideNavOpened = false;
  }

  childEvent(clicked: boolean) {
    this.sideNavOpened = clicked;

  }
  getNotification() {
    const currentUser = localStorage.getItem("currentUser") || '{}'
    const notifRef = ref(getDatabase(), "Notifications/" + currentUser)
    const studentRef = ref(getDatabase(), "Students/")
    get(studentRef).then((snapshot) => {
      if (snapshot.hasChild(currentUser)) {
        onValue(notifRef, (snapshot) => {
          this.notifCounter = 0
          this.notifData = []
          snapshot.forEach((item) => {
            var data = item.val()
            if (data.status == "unread") {
              this.notifCounter++
            }
            data["userType"] = "student"
            this.notifData.push(data)
          })
        })
      }
      else {
        onValue(notifRef, (snapshot) => {
          this.notifCounter = 0
          this.notifData = []
          snapshot.forEach((item) => {
            var data = item.val()
            if (data.status == "unread") {
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
  openNotif() {
    this.dialogRef.open(NotificationsViewComponent, {
      width: "80%",
      data: this.notifData
    })
  }
  goToHome() {
    var currentUser = localStorage.getItem('currentUser') as string;
    if (this.user == "admin" && currentUser) {
      this.router.navigate(["AdminDashboard"]);
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
  goToAboutTheDevelopers() {
    this.router.navigate(["AboutDevelopers"])
  }

  getGraphs() {
    Chart.register(...registerables);
    const recruiterRef = ref(getDatabase(), "Recruiters/")
    const studentApplication = ref(getDatabase(), "Student Applications/")
    const studentRef = ref(getDatabase(), "Students/")

    get(recruiterRef).then((snapshot) => {
      snapshot.forEach(rec => {
        var recruiter = rec.val()
        if (recruiter.status == 'activated') {
          let details = {
            recruiterID: recruiter.id,
            companyName: recruiter.companyName,
            count: [0, 0, 0, 0] // hired, processing, pending, confirmation
          };
          this.perCompany.push(details);
        }
      });
    }).then(() => {
      get(studentApplication).then((snapshot) => {
        snapshot.forEach((item) => {
          item.forEach(studApp => {
            var studentApp = studApp.val();
            const index = this.perCompany.findIndex((obj) => obj.recruiterID === studentApp.recruiterId);
            switch (studentApp.status) {
              case "Hired":
                this.perCompany[index].count[0]++;
                break;
              case "Processing":
                this.perCompany[index].count[1]++;
                break;
              case "Pending":
                this.perCompany[index].count[2]++;
                break;
              case "Confirmation":
                this.perCompany[index].count[3]++;
                break;

              default:
                break;
            }
          });
          this.onCompanyChange(0);
        });
      });
    })

    this.pieChart = new Chart("pieChart", {
      type: 'pie',
      data: {
        labels: ["Hired", "Processing", "Pending", "Confirmation"],
        datasets: [{
          data: [0, 0, 0, 0],
          backgroundColor: ['#003049', '#f77f00', "#d62828", "#fcbf49"],
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom"
          },
        }
      }
    });

    get(recruiterRef).then((snapshot) => {
      this.numberOfRecruiter = snapshot.size
      snapshot.forEach((item) => {
        var data = item.val()
        if (data.status == 'activated') {
          this.studentApplication[data.id] = 0
          this.recruiterRating[data.id] = 0
          this.companyLabels[data.id] = data.companyName
        }
        var numOfChild = 0
        var rating = 0
        var recruiterStatusRef = ref(getDatabase(), "Recruiters/" + data.id + "/rating/")
        get(recruiterStatusRef).then((snapshot) => {
          numOfChild = snapshot.size
          snapshot.forEach((item) => {
            const recruiterRatingRef2 = ref(getDatabase(), "Recruiters/" + data.id + "/rating/" + item.key + "/")
            get(recruiterRatingRef2).then((snapshot) => {
              snapshot.forEach((item) => {
                var data = item.val()
                rating += data.rating
              })
            }).then(() => {
              Object.entries(this.studentApplication).forEach(([key, value]) => {
                if (data.id == key) {
                  this.recruiterRating[key] = rating / numOfChild
                }
                this.recruiterRatingCount = Object.values(this.recruiterRating);
                this.ratingCountSorted = this.recruiterRatingCount.sort((n1: number, n2: number) => n2 - n1);
              });
            })
          })
        })
      })
    }).then(() => {
      get(studentApplication).then((snapshot) => {
        snapshot.forEach((item) => {
          item.forEach((item2) => {
            var data = item2.val()
            Object.entries(this.studentApplication).forEach(([key, value]) => {
              if (data.recruiterId == key) {
                this.studentApplication[key] += 1
              }
            });
          })
        })

        var sample = Object.entries(this.studentApplication).sort((a: any, b: any) => {
          var aVar: any, bVar: any
          aVar = Object.values(a)[1]
          bVar = Object.values(b)[1]
          return bVar - aVar
        })
        sample.forEach((items) => {
          this.barChartLabels.push(this.companyLabels[items[0]])
        })
        this.studentCount = Object.values(this.studentApplication);
        this.studentCountSorted = this.studentCount.sort((n1: number, n2: number) => n2 - n1);
        this.studentCountSortedFive = this.studentCountSorted.slice(0, 5)
        this.companyLabelsFive = this.barChartLabels.slice(0, 5)
      }).then(() => {
        get(studentRef).then((snapshot) => {
          this.hiredCount = 0
          this.notHiredCount = 0
          this.numberOfStudent = snapshot.size
          snapshot.forEach((item) => {
            var data = item.val()
            if (data.hiredDate) {
              var hiredDate = new Date(data.hiredDate)
              this.hiredPerMonthData[hiredDate.getMonth()] += 1
            }
            if (data.hired) {
              this.hiredCount++
            }
            else {
              this.notHiredCount++
            }
          })
        }).then(() => {
          const monthsLabels = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
          var lineChartData = {
            labels: monthsLabels
          }
          var lineChart = new Chart("lineChart", {
            type: 'line',
            data: {
              labels: monthsLabels,
              datasets: [{
                label: "Number of Graduates Hired per Month",
                data: this.hiredPerMonthData,
                backgroundColor: '#cf542f',
                tension: 0.4
              },]
            },
          });

          var barChart = new Chart("barChart", {
            type: 'bar',
            data: {
              labels: this.companyLabelsFive,
              datasets: [{
                label: 'Number of Applicant',
                data: this.studentCountSortedFive,
                backgroundColor: ['#003049', '#f77f00', "#d62828", "#fcbf49", "#eae2b7"],
              }]
            },
            options: {
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
                }
              }
            }
          });
        })
      })
    })
  }

  onCompanyChange(company: any) {
    this.pieChart.data.datasets[0].data = this.perCompany[company].count;
    this.pieChart.update();
  }
}
