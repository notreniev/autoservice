import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { BaseProvider } from '../base/base.provider';
import { FirebaseApp } from 'angularfire2';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user.model';
import 'rxjs/add/operator/map';
import 'firebase/storage';


@Injectable()
export class UserProvider extends BaseProvider {

  users: FirebaseListObservable<User[]>;
  currentUser: FirebaseObjectObservable<User>;

  constructor(
    public http: Http,
    public af: AngularFireAuth,
    public db: AngularFireDatabase,
    public firebaseApp: FirebaseApp
  ) {
    super();
    this.listenAuthState();

  }

  private setUsers(uidToExclude: string): void {
    this.users = <FirebaseListObservable<User[]>>this.db.list(`/users`, {
      query: {
        orderByChild: 'nome'
      }
    }).map((users: User[]) => {
      return users.filter((user: User) => user.$key !== uidToExclude);
    });
  }

  private listenAuthState(): void {
    this.af.authState
      .subscribe((authUser: firebase.User) => {
        if (authUser) {
          console.log('Auth state alterado!');
          this.currentUser = this.db.object(`/users/${authUser.uid}`);
          this.setUsers(authUser.uid);
        }
      })
  }

  create(user: User, uuid: string) {
    return this.db.object(`/users/${uuid}`)
      .set(user)
      .catch(this.handlePromiseError);
  }

  edit(user: { nome: string, usuario: string, photo: string }) {
    return this.currentUser
      .update(user)
      .catch(this.handlePromiseError);
  }

  userExists(username: string): Observable<boolean> {
    return this.db.list(`/users/`, {
      query: {
        orderByChild: `usuario`,
        equalTo: username
      }
    }).map((users: User[]) => {
      return users.length > 0;
    }).catch(this.handleObservableError);
  }

  get(userId: string): FirebaseObjectObservable<User> {
    return <FirebaseObjectObservable<User>>this.db.object(`/users/${userId}`)
      .catch(this.handleObservableError);
  }

  uploadPhoto(file: File, userId: string): firebase.storage.UploadTask {
    return this.firebaseApp
      .storage()
      .ref()
      .child(`/users/${userId}`)
      .put(file);
  }
}
