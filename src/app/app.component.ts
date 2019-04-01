import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../providers/auth/auth.provider';
import { Component, ViewChild } from '@angular/core';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { Nav, Platform } from 'ionic-angular';
import { SigninPage } from '../pages/signin/signin';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { User } from './../models/user.model';
import { UserProvider } from './../providers/user/user.provider';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = SigninPage;
  currentUser: User;
  pages: Array<{ title: string, component: any }>;

  constructor(
    public authProvider: AuthProvider,
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public userProvider: UserProvider
  ) {

    authProvider
    .afa
    .authState
    .subscribe((authUser: firebase.User) => {

      if (authUser) {

        this.rootPage = HomePage;

        userProvider.currentUser
          .subscribe((user: User) => {
            this.currentUser = user;
          });

      } else {

        this.rootPage = SigninPage;

      }

    });

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout(): any {
    this.authProvider.logout().then((res) => {
      this.nav.setRoot(SigninPage);
    }).catch((err) => {
      console.log(err);
    });
  }
}
