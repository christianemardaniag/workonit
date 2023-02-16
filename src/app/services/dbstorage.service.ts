import { Injectable } from '@angular/core';
import { Storage, ref } from '@angular/fire/storage';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbstorageService {

  constructor(public storage: Storage) { }

  uploadProfilePicture(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(
      switchMap((result) => getDownloadURL(result.ref))
    );






  }
  uploadResume(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(
      switchMap((result) => getDownloadURL(result.ref))
    );
  }

  uploadAttachmentToStorage(image: File, path: string): Observable<string> {
    const storageRef = ref(this.storage, path);
    const uploadTask = from(uploadBytes(storageRef, image));
    return uploadTask.pipe(
      switchMap((result) => getDownloadURL(result.ref))
    );



  }
}
