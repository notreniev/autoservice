import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AngularFireModule } from 'angularfire2';
import { AuthProvider } from '../providers/auth/auth.provider';
import { BrowserModule } from '@angular/platform-browser';
import { CapitalizePipe } from '../pipes/capitalize/capitalize';
import { ChatPage } from '../pages/chat/chat';
import { ChatProvider } from '../providers/chat/chat.provider';
import { CustomLoggedHeaderComponent } from '../components/custom-logged-header/custom-logged-header';
import { ErrorHandler, NgModule } from '@angular/core';
import { HomePage } from '../pages/home/home';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ListPage } from '../pages/list/list';
import { MessageBoxComponent } from '../components/message-box/message-box';
import { MessageProvider } from '../providers/message/message.provider';
import { MyApp } from './app.component';
import { ProgressBarComponent } from './../components/progress-bar/progress-bar';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from './../pages/signup/signup';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { UserInfoComponent } from './../components/user-info/user-info';
import { UserMenuComponent } from './../components/user-menu/user-menu';
import { UserProfilePage } from './../pages/user-profile/user-profile';
import { UserProvider } from '../providers/user/user.provider';

const firebaseAppConfig: any = {
  apiKey: "AIzaSyDXQ5R3yYZQhkw_M7eaeSF7CNABmjpL-Tg",
  authDomain: "autoservice-0779.firebaseapp.com",
  databaseURL: "https://autoservice-0779.firebaseio.com",
  projectId: "autoservice-0779",
  storageBucket: "autoservice-0779.appspot.com",
  messagingSenderId: "433982455386"
};

@NgModule({
  declarations: [
    CapitalizePipe,
    ChatPage,
    CustomLoggedHeaderComponent,
    MyApp,
    HomePage,
    SigninPage,
    ListPage,
    SignupPage,
    MessageBoxComponent,
    ProgressBarComponent,
    UserInfoComponent,
    UserMenuComponent,
    UserProfilePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseAppConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ChatPage,
    HomePage,
    ListPage,
    MyApp,
    SigninPage,
    SignupPage,
    UserProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserProvider,
    AngularFireDatabase,
    AngularFireAuth,
    AuthProvider,
    ChatProvider,
    MessageProvider
  ]
})
export class AppModule { }
