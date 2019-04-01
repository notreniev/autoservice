import * as firebase from 'firebase/app';
import { AuthProvider } from './../../providers/auth/auth.provider';
import { ChangeDetectorRef } from '@angular/core/src/change_detection/change_detector_ref';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from './../../models/user.model';
import { UserProvider } from './../../providers/user/user.provider';


@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  currentUser: User;
  canEdit: boolean = false;
  uploadProgress: number;
  private filePhoto: File;

  constructor(
    public authProvider: AuthProvider,
    //public cd: ChangeDetectorRef,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider
  ) {
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  ionViewDidLoad() {
    this.userProvider.currentUser
      .subscribe((user: User) => {
        console.log('usuario: ', user);
        this.currentUser = user;
      });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    
    if (this.filePhoto) {

      let uploadTask = this.userProvider.uploadPhoto(this.filePhoto, this.currentUser.$key);

      uploadTask.on('state_changed', (snapshot: firebase.storage.UploadTaskSnapshot) => {

        this.uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        //this.cd.detectChanges();

      }, (error: Error) => {
        // catch error
      });

      uploadTask.then((UploadTaskSnapshot: firebase.storage.UploadTaskSnapshot) => {
        this.editUser(uploadTask.snapshot.downloadURL);
      });

    } else {
      this.editUser();
    }

  }


  onPhoto(event): void {
    this.filePhoto = event.target.files[0];
  }

  private editUser(photoUrl?: string): void {
    this.userProvider
      .edit({
        nome: this.currentUser.nome,
        usuario: this.currentUser.usuario,
        photo: photoUrl || this.currentUser.photo || ''
      }).then(() => {
        this.canEdit = false;
        this.filePhoto = undefined;
        this.uploadProgress = 0;
        //this.cd.detectChanges();
      })
  }

}
