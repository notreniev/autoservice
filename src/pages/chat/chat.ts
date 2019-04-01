import * as firebase from 'firebase/app';
import { AuthProvider } from '../../providers/auth/auth.provider';
import { Chat } from '../../models/chat.model';
import { ChatProvider } from '../../providers/chat/chat.provider';
import { Component, ViewChild } from '@angular/core';
import {
  Content,
  IonicPage,
  NavController,
  NavParams
  } from 'ionic-angular';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Message } from '../../models/messagem.model';
import { MessageProvider } from '../../providers/message/message.provider';
import { User } from '../../models/user.model';
import { UserProvider } from '../../providers/user/user.provider';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;
  messages: FirebaseListObservable<Message[]>;
  pageTitle: string;
  sender: User;
  recipient: User;
  private chat1: FirebaseObjectObservable<Chat>;
  private chat2: FirebaseObjectObservable<Chat>;

  constructor(
    public authProvider: AuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public chatProvider: ChatProvider,
    public messageProvider: MessageProvider
  ) {
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  ionViewDidLoad() {

    this.recipient = this.navParams.get('recipientUser');
    this.pageTitle = this.recipient.nome;

    this.userProvider.currentUser
      .first()
      .subscribe((currentUser: User) => {
        this.sender = currentUser;

        this.chat1 = this.chatProvider.getDeepChat(this.sender.$key, this.recipient.$key);
        this.chat2 = this.chatProvider.getDeepChat(this.recipient.$key, this.sender.$key);

        if (this.recipient.photo) {
          this.chat1
            .first()
            .subscribe((chat: Chat) => {
              this.chatProvider.updatePhoto(this.chat1, chat.photo, this.recipient.photo);
            });
        }

        let doSubscription = () => {
          this.messages
            .subscribe((messages: Message[]) => {
              this.scrollToBottom();
            });
        };

        this.messages = this.messageProvider
          .getMessages(this.sender.$key, this.recipient.$key);

        this.messages
          .first()
          .subscribe((messages: Message[]) => {

            if (messages.length === 0) {

              this.messages = this.messageProvider
                .getMessages(this.recipient.$key, this.sender.$key);

              doSubscription();

            } else {
              doSubscription();
            }

          });
      });
  }

  sendMessage(newMessage: string): void {

    if (newMessage) {

      let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;

      this.messageProvider.create(
        new Message(
          this.sender.$key,
          newMessage,
          currentTimestamp
        ),
        this.messages
      ).then(() => {

        this.chat1
          .update({
            lastMessage: newMessage,
            timestamp: currentTimestamp
          });

        this.chat2
          .update({
            lastMessage: newMessage,
            timestamp: currentTimestamp
          });
      });
    }
  }

  private scrollToBottom(duration?: number): void {
    setTimeout(() => {
      if (this.content) {
        this.content.scrollToBottom(duration || 300);
      }
    }, 50);
  }

}
