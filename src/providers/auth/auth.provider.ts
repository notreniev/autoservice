import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { BaseProvider } from '../base/base.provider';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthProvider extends BaseProvider {

  constructor(
    public afa: AngularFireAuth,
    public http: Http
  ) {
    super();
  }

  createAuthUser(user: { email: string, password: string }) {
    return this.afa.auth.createUserWithEmailAndPassword(user.email, user.password)
      .catch(this.handlePromiseError);
  }

  signinWithEmail(user: { email: string, senha: string }) {
    return this.afa.auth.signInWithEmailAndPassword(user.email, user.senha)
      .then((authUser: firebase.User) => {
        return authUser != null;
      }).catch(this.handlePromiseError);
  }

  logout() {
    return this.afa.auth.signOut();
  }

  get authenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.afa
        .authState
        .first()
        .subscribe((authUser: firebase.User) => {
          (authUser) ? resolve(true) : reject(false);
        });
    });
  }

}
