import {
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  NavParams
  } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../../providers/auth/auth.provider';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { UserProvider } from '../../providers/user/user.provider';

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  signinForm: FormGroup;

  constructor(
    public authState: AngularFireAuth,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public userProvider: UserProvider
  ) {

    let emailRegex = /^([0-9,a-z,A-Z]+)([.,_,-]([0-9,a-z,A-Z]+))*[@]([0-9,a-z,A-Z]+)([.,_,-]([0-9,a-z,A-Z]+))*[.]([a-z,A-Z]){2,3}([0-9,a-z,A-Z])?$/;

    this.signinForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    let loading = this.showLoading();
    let formUser = this.signinForm.value;

    this.authProvider.signinWithEmail(formUser)
      .then((res) => {
        console.log('resultado do login: ', res);
        loading.dismiss();
        this.navCtrl.push(HomePage);
      }).catch((error: any) => {
        console.log('erro: ', error);
        loading.dismiss();
        this.showAlert(error);
      });

  }

  onSignup(): void {
    this.navCtrl.push(SignupPage);
  }

  onHomePage(): void {
    this.navCtrl.push(HomePage)
    .then((hasAccess: boolean) => {
      console.log('authorizado?: ', hasAccess);
    }).catch(err => {
      console.log('nào authorizado');
    });
  }

  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: "Aguarde..."
    });

    loading.present();

    return loading;
  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }
}
