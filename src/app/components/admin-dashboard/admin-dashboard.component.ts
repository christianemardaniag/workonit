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
  companyLabelsFive: any = []
  hiredPerMonthData: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  hiredPerYearData: any = {}
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
      this.numberOfRecruiter = snapshot.size
      snapshot.forEach((item) => {
        var data = item.val()
        if (data.status == 'activated') {
          this.studentApplication[data.id] = 0
          this.recruiterRating[data.id] = 0
          this.companyLabels[data.id] = data.companyName
          this.colors.push(this.getRandomColor())
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
                backgroundColor: '#cf542f'
              },]
            },
          });

          var lineChart2 = new Chart("lineChart2", {
            type: 'line',
            data: {
              labels: monthsLabels,
              datasets: [{
                label: "Number of Graduates Hired per Month",
                data: this.hiredPerMonthData,
                backgroundColor: '#cf542f'
              },]
            },
          });

          const dataChart = {
            labels: [
              "Hired",
              "Not Hired"
            ],
            datasets: [{
              label: 'Number of applicants',
              data: [this.hiredCount, this.notHiredCount],
              backgroundColor: ['rgba(255, 170, 40,1)', '#cf542f'],
              hoverOffset: 4
            }]
          };

          var pieChart = new Chart("pieChart", {
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
                  text: 'NUMBER OF HIRED APPLICANTS'
                }
              }
            }
          });

          var barChart2 = new Chart("ratingChart", {
            type: 'bar',
            data: {
              labels: this.barChartLabels,
              datasets: [{
                label: 'Number of Rating',
                data: this.ratingCountSorted,
                backgroundColor: this.colors,
                borderColor: [],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
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
                },
                title: {
                  display: true,
                  text: 'RATING OF EACH COMPANY'
                }
              }
            }
          });

          var pieChart2 = new Chart("pieChart-sideNav", {
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
                  text: 'NUMBER OF HIRED APPLICANTS'
                }
              }
            }
          });

          var barChart3 = new Chart("ratingChart-sideNav", {
            type: 'bar',
            data: {
              labels: this.barChartLabels,
              datasets: [{
                label: 'Number of Rating',
                data: this.recruiterRatingCount,
                backgroundColor: this.colors,
                borderColor: [],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
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
                },
                title: {
                  display: true,
                  text: 'RATING OF EACH COMPANY'
                }
              }
            }
          });
        })
      }).then(() => {
        var barChart = new Chart("barChart", {
          type: 'bar',
          data: {
            labels: this.companyLabelsFive,
            datasets: [{
              label: 'Number of Applicant',
              data: this.studentCountSortedFive,
              backgroundColor: this.colors,
              borderColor: [],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
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
              }
            }
          }
        });

        var barChart2 = new Chart("barChart-sideNav", {
          type: 'bar',
          data: {
            labels: this.companyLabelsFive,
            datasets: [{
              label: 'Number of Applicant',
              data: this.studentCountSortedFive,
              backgroundColor: this.colors,
              borderColor: [],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
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
              },
              title: {
                display: true,
                text: 'NUMBER OF APPLICATION PER COMPANY'
              }
            }
          }
        });
      })
    })
  }

  getRandomColor() {
    var colors = ['rgba(255, 170, 40,1)',
      '#cf542f'];
    const random = Math.floor(Math.random() * colors.length);
    return colors[random];
  }

  openBarChart() {
    this.dialogRef.open(AdminViewTopcompanyComponent, {
      width: "80%"
    })
  }
  
}
