import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { DbhelperService } from 'src/app/services/dbhelper.service';
import { DbstorageService } from 'src/app/services/dbstorage.service';
import { concatMap } from 'rxjs';
import { AdminRemoveDeveloperComponent } from '../admin-remove-developer/admin-remove-developer.component';

@Component({
  selector: 'app-admin-view-developer',
  templateUrl: './admin-view-developer.component.html',
  styleUrls: ['./admin-view-developer.component.css']
})
export class AdminViewDeveloperComponent implements OnInit {

  constructor(public db: DbhelperService, @Inject(MAT_DIALOG_DATA) public editDeveloperData: any, public dbstorage: DbstorageService, public toast: HotToastService, public dialogRef: MatDialog) { }
  developer: any = {};
  ngOnInit(): void {
    this.developer = this.editDeveloperData;
  }

  uploadImage(event: any) {

    this.dbstorage.uploadProfilePicture(event.target.files[0], `images/Developers/${this.developer.id}`).pipe(
      this.toast.observe({
        loading: "Image is being uploaded...",
        success: "Image uploaded!",
        error: "There was  an error uploading"
      }), concatMap((photoURL) => this.db.updateDeveloperImage(photoURL, this.developer.id))
    ).subscribe();
  }

  editDeveloper(value: any) {
    this.db.updateDeveloper(value.developerName, value.id);
  }
  openRemoveDeveloperDialog() {
    this.dialogRef.open(AdminRemoveDeveloperComponent, {
      data: this.developer
    })
  }

}
