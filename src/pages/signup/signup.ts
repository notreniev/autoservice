import {
  AlertController,
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  NavParams
} from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth.provider';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProvider } from './../../providers/user/user.provider';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  signupForm: FormGroup;

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

    this.signupForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  onSubmit(): void {

    let loading = this.showLoading();
    let formUser = this.signupForm.value;
    let username = formUser.usuario;

    this.userProvider.userExists(username)
      .first()
      .subscribe((userExists: boolean) => {
        if (!userExists) {
          this.authProvider.createAuthUser({
            email: formUser.email,
            password: formUser.senha
          })
            .then((authState: any) => {
              delete formUser.senha;
              let uuid: string = authState.uid;

              this.userProvider.create(formUser, uuid)
                .then(() => {
                  console.log('usuário cadastrado!');
                  loading.dismiss();
                })
                .catch((error: any) => {
                  console.log('error: ', error);
                  loading.dismiss();
                  this.showAlert(error);
                });
            })
            .catch((error: any) => {
              console.log('error: ', error);
              loading.dismiss();
              this.showAlert(error);
            });
        } else {
          this.showAlert(`O usuário ${username} já está sendo usado em outra conta.`);
          loading.dismiss();
        }
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
