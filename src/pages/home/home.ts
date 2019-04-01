import * as firebase from 'firebase/app';
import { AuthProvider } from '../../providers/auth/auth.provider';
import { Chat } from '../../models/chat.model';
import { ChatPage } from '../chat/chat';
import { ChatProvider } from '../../providers/chat/chat.provider';
import { Component } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { MenuController, NavController } from 'ionic-angular';
import { SignupPage } from './../signup/signup';
import { User } from './../../models/user.model';
import { UserProvider } from './../../providers/user/user.provider';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  users: FirebaseListObservable<User[]>;
  chats: FirebaseListObservable<Chat[]>;
  view: string = "chats";

  constructor(
    public authProvider: AuthProvider,
    public chatProvider: ChatProvider,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public userProvider: UserProvider
  ) {

  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  ionViewDidLoad() {
    this.chats = this.chatProvider.chats;
    this.users = this.userProvider.users;

    this.menuCtrl.enable(true, 'user-menu');
  }

  filterItems(event: any): void {
    let searchTerm: string = event.target.value;

    this.chats = this.chatProvider.chats;
    this.users = this.userProvider.users;

    if (searchTerm) {

      switch (this.view) {

        case 'chats':
          this.chats = <FirebaseListObservable<Chat[]>>this.chats
            .map((chats: Chat[]) => {
              return chats.filter((chat: Chat) => {
                return (chat.title.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) > -1)
              })
            });
          break;

        case 'users':
          this.users = <FirebaseListObservable<User[]>>this.users
            .map((users: User[]) => {
              return users.filter((user: User) => {
                return (user.nome.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
              })
            });
          break;

      }

    }

  }

  onChatCreate(recipientUser: User): void {
    console.log('recipientUser: ', recipientUser);
    this.userProvider.currentUser
      .first()
      .subscribe((currentUser: User) => {
        console.log('currentUser: ', currentUser);
        this.chatProvider.getDeepChat(currentUser.$key, recipientUser.$key)
          .first()
          .subscribe((chat: Chat) => {

            if (chat.hasOwnProperty('$value')) {

              let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;

              let chat1 = new Chat('', timestamp, recipientUser.nome, '');
              this.chatProvider.create(chat1, currentUser.$key, recipientUser.$key);

              let chat2 = new Chat('', timestamp, currentUser.nome, '');
              this.chatProvider.create(chat2, recipientUser.$key, currentUser.$key);
            }

          });
      });

    this.navCtrl.push(ChatPage, {
      recipientUser: recipientUser
    });
  }

  onChatOpen(chat: Chat): void {

    let recipientUserId: string = chat.$key;

    this.userProvider.get(recipientUserId)
      .first()
      .subscribe((user: User) => {

        this.navCtrl.push(ChatPage, {
          recipientUser: user
        });

      });

  }

  login() {
    this.navCtrl.push(SignupPage);
  }

}
