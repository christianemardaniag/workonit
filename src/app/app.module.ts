import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { LoginComponent } from './components/login/login.component';
import { RouterModule } from '@angular/router';
import { NgToastModule } from 'ng-angular-popup';
import { NgxSpinner, NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HotToastModule } from '@ngneat/hot-toast';
import { RegisterComponent } from './components/register/register.component';
import { MatButtonModule } from "@angular/material/button"
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input"
import { MatFormFieldModule } from "@angular/material/form-field"
import { MatMenuModule } from "@angular/material/menu"
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatBadgeModule } from '@angular/material/badge';
import { FormsModule } from '@angular/forms';
import { DataPrivacyComponent } from './dialogs/data-privacy/data-privacy.component';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { StudentHomeComponent } from './components/student-home/student-home.component';
import { ForgotPasswordComponent } from './dialogs/forgot-password/forgot-password.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LogoutComponent } from './dialogs/logout/logout.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { StudentProfileEditComponent } from './components/student-profile-edit/student-profile-edit.component';
import { StudentAboutWorkonitComponent } from './components/student-about-workonit/student-about-workonit.component';
import { StudentAboutCictComponent } from './components/student-about-cict/student-about-cict.component';
import { StudentAboutDevelopersComponent } from './components/student-about-developers/student-about-developers.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminRecruiterComponent } from './components/admin-recruiter/admin-recruiter.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AdminAddRecruiterComponent } from './dialogs/admin-add-recruiter/admin-add-recruiter.component';
import { AdminEditRecruiterComponent } from './dialogs/admin-edit-recruiter/admin-edit-recruiter.component';
import { AdminDeactivateRecruiterComponent } from './dialogs/admin-deactivate-recruiter/admin-deactivate-recruiter.component';
import { AdminReactivateRecruiterComponent } from './dialogs/admin-reactivate-recruiter/admin-reactivate-recruiter.component';
import { AdminStudentComponent } from './components/admin-student/admin-student.component';
import { AdminAboutCictComponent } from './components/admin-about-cict/admin-about-cict.component';
import { AdminAboutDevelopersComponent } from './components/admin-about-developers/admin-about-developers.component';
import { AdminAboutWorkonitComponent } from './components/admin-about-workonit/admin-about-workonit.component';
import { AdminAboutWorkonitEditComponent } from './components/admin-about-workonit-edit/admin-about-workonit-edit.component';
import { AdminAboutCictEditComponent } from './components/admin-about-cict-edit/admin-about-cict-edit.component';
import { AdminAddDeveloperComponent } from './dialogs/admin-add-developer/admin-add-developer.component';
import { AdminViewDeveloperComponent } from './dialogs/admin-view-developer/admin-view-developer.component';
import { AdminRemoveDeveloperComponent } from './dialogs/admin-remove-developer/admin-remove-developer.component';
import { RecruiterLoginComponent } from './components/recruiter-login/recruiter-login.component';
import { RecruiterDashboardComponent } from './components/recruiter-dashboard/recruiter-dashboard.component';
import { RecruiterProfileComponent } from './components/recruiter-profile/recruiter-profile.component';
import { RecruiterProfileEditComponent } from './components/recruiter-profile-edit/recruiter-profile-edit.component';
import { RecruiterJobofferComponent } from './components/recruiter-joboffer/recruiter-joboffer.component';
import { MatCardModule } from '@angular/material/card';
import { RecruiterAddJobofferComponent } from './dialogs/recruiter-add-joboffer/recruiter-add-joboffer.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { RecruiterJoboffersViewComponent } from './dialogs/recruiter-joboffers-view/recruiter-joboffers-view.component';
import { RecruiterJobofferEditComponent } from './dialogs/recruiter-joboffer-edit/recruiter-joboffer-edit.component';
import { RecruiterJobofferArchiveComponent } from './dialogs/recruiter-joboffer-archive/recruiter-joboffer-archive.component';
import { RecruiterJobofferRestoreComponent } from './dialogs/recruiter-joboffer-restore/recruiter-joboffer-restore.component';
import { StudentJobofferViewComponent } from './dialogs/student-joboffer-view/student-joboffer-view.component';
import { StudentJobofferConfirmComponent } from './dialogs/student-joboffer-confirm/student-joboffer-confirm.component';
import { StudentJobapplicationsComponent } from './components/student-jobapplications/student-jobapplications.component';
import { StudentJobapplicationViewComponent } from './dialogs/student-jobapplication-view/student-jobapplication-view.component';
import { StudentJobapplicationCancelComponent } from './dialogs/student-jobapplication-cancel/student-jobapplication-cancel.component';
import { RecruiterApplicantsComponent } from './components/recruiter-applicants/recruiter-applicants.component';
import { RecruiterJobapplicantViewComponent } from './dialogs/recruiter-jobapplicant-view/recruiter-jobapplicant-view.component';
import { RecruiterJobapplicantConfirmComponent } from './dialogs/recruiter-jobapplicant-confirm/recruiter-jobapplicant-confirm.component';
import { RecruiterJobapplicantHireConfirmComponent } from './dialogs/recruiter-jobapplicant-hire-confirm/recruiter-jobapplicant-hire-confirm.component';
import { RecruiterApplicantHireRejectComponent } from './dialogs/recruiter-jobapplicant-hire-reject/recruiter-applicant-hire-reject.component';
import { RecruiterJobapplicantRejectComponent } from './dialogs/recruiter-jobapplicant-reject/recruiter-jobapplicant-reject.component';
import { NotificationsViewComponent } from './dialogs/notifications-view/notifications-view.component';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { StudentAddreviewComponent } from './dialogs/student-addreview/student-addreview.component';
import { StudentAddreviewConfirmComponent } from './dialogs/student-addreview-confirm/student-addreview-confirm.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { AdminViewStudentComponent } from './dialogs/admin-view-student/admin-view-student.component';
import {NgxPrintModule} from 'ngx-print';
import { StudentJobapplicationAcceptHireComponent } from './dialogs/student-jobapplication-accept-hire/student-jobapplication-accept-hire.component';
import { StudentJobapplicationRejectHireComponent } from './dialogs/student-jobapplication-reject-hire/student-jobapplication-reject-hire.component';
import { RecruiterAnnouncementViewComponent } from './dialogs/recruiter-announcement-view/recruiter-announcement-view.component';
import { RecruiterAnnouncementConfirmComponent } from './dialogs/recruiter-announcement-confirm/recruiter-announcement-confirm.component';
import { RecruiterAddreviewComponent } from './dialogs/recruiter-addreview/recruiter-addreview.component';
import { RecruiterAddreviewConfirmComponent } from './dialogs/recruiter-addreview-confirm/recruiter-addreview-confirm.component';
import { AdminViewTopcompanyComponent } from './dialogs/admin-view-topcompany/admin-view-topcompany.component';
import { StudentResumeViewComponent } from './dialogs/student-resume-view/student-resume-view.component';
import { AngularD3CloudModule } from 'angular-d3-cloud';
import { AdminViewRecruiterComponent } from './dialogs/admin-view-recruiter/admin-view-recruiter.component';
import { AdminViewRecruiterRatingComponent } from './dialogs/admin-view-recruiter-rating/admin-view-recruiter-rating.component'









@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DataPrivacyComponent,
    StudentHomeComponent,
    ForgotPasswordComponent,
    NavbarComponent,
    LogoutComponent,
    StudentProfileComponent,
    StudentProfileEditComponent,
    StudentAboutWorkonitComponent,
    StudentAboutCictComponent,
    StudentAboutDevelopersComponent,
    FooterComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    AdminRecruiterComponent,
    AdminAddRecruiterComponent,
    AdminEditRecruiterComponent,
    AdminDeactivateRecruiterComponent,
    AdminReactivateRecruiterComponent,
    AdminStudentComponent,
    AdminAboutCictComponent,
    AdminAboutDevelopersComponent,
    AdminAboutWorkonitComponent,
    AdminAboutWorkonitEditComponent,
    AdminAboutCictEditComponent,
    AdminAddDeveloperComponent,
    AdminViewDeveloperComponent,
    AdminRemoveDeveloperComponent,
    RecruiterLoginComponent,
    RecruiterDashboardComponent,
    RecruiterProfileComponent,
    RecruiterProfileEditComponent,
    RecruiterJobofferComponent,
    RecruiterAddJobofferComponent,
    RecruiterJoboffersViewComponent,
    RecruiterJobofferEditComponent,
    RecruiterJobofferArchiveComponent,
    RecruiterJobofferRestoreComponent,
    StudentJobofferViewComponent,
    StudentJobofferConfirmComponent,
    StudentJobapplicationsComponent,
    StudentJobapplicationViewComponent,
    StudentJobapplicationCancelComponent,
    RecruiterApplicantsComponent,
    RecruiterJobapplicantViewComponent,
    RecruiterJobapplicantConfirmComponent,
    RecruiterJobapplicantHireConfirmComponent,
    RecruiterApplicantHireRejectComponent,
    RecruiterJobapplicantRejectComponent,
    NotificationsViewComponent,
    StudentAddreviewComponent,
    StudentAddreviewConfirmComponent,
    AdminViewStudentComponent,
    StudentJobapplicationAcceptHireComponent,
    StudentJobapplicationRejectHireComponent,
    RecruiterAnnouncementViewComponent,
    RecruiterAnnouncementConfirmComponent,
    RecruiterAddreviewComponent,
    RecruiterAddreviewConfirmComponent,
    AdminViewTopcompanyComponent,
    StudentResumeViewComponent,
    AdminViewRecruiterComponent,
    AdminViewRecruiterRatingComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    RouterModule.forRoot([

      { path: "", component: LoginComponent },
      { path: "Register", component: RegisterComponent },
      { path: "StudentHome", component: StudentHomeComponent },
      { path: "Profile", component: StudentProfileComponent },
      { path: "StudentEditProfile", component: StudentProfileEditComponent },
      { path: "StudentApplication", component:StudentJobapplicationsComponent},
      { path: "AboutWorkOnIt", component: StudentAboutWorkonitComponent },
      { path: "AboutCICT", component: StudentAboutCictComponent },
      { path: "AboutDevelopers", component: StudentAboutDevelopersComponent },
      { path: "AdminLogin", component: AdminLoginComponent },
      { path: "AdminDashboard", component: AdminDashboardComponent },
      { path: "AdminRecruiter", component: AdminRecruiterComponent },
      { path: "AdminStudent", component: AdminStudentComponent },
      { path: "AdminAboutWorkOnIt", component: AdminAboutWorkonitComponent },
      { path: "AdminAboutCICT", component: AdminAboutCictComponent },
      { path: "AdminAboutDevelopers", component: AdminAboutDevelopersComponent },
      { path: "EditAboutWorkOnIt", component: AdminAboutWorkonitEditComponent },
      { path: "EditAboutCICT", component: AdminAboutCictEditComponent },
      { path: "RecruiterLogin", component: RecruiterLoginComponent },
      { path: "RecruiterDashboard", component: RecruiterDashboardComponent },
      { path: "RecruiterProfile", component: RecruiterProfileComponent },
      { path: "RecruiterEditProfile", component: RecruiterProfileEditComponent },
      { path: "RecruiterJobOffer", component: RecruiterJobofferComponent },
      { path: "RecruiterApplicants", component: RecruiterApplicantsComponent },
    ]),
    NgToastModule,
    FormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    HotToastModule.forRoot(),
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatSliderModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatBadgeModule,
    AngularFireDatabaseModule,
    MatButtonToggleModule,
    MatCardModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgxStarRatingModule,
    MatExpansionModule,
    MatSidenavModule,
    NgxPrintModule,
    AngularD3CloudModule



   
    
 
  


  ],

  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
