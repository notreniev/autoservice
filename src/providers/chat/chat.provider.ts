import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { BaseProvider } from '../base/base.provider';
import { Chat } from '../../models/chat.model';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatProvider extends BaseProvider {

  chats: FirebaseListObservable<Chat[]>;

  constructor(
    public af: AngularFireAuth,
    public http: Http,
    public db: AngularFireDatabase
  ) {
    super();
    this.setChats();
  }

  private setChats(): void {
    this.af.authState
      .subscribe((authState: firebase.User) => {
        if (authState) {
          this.chats = <FirebaseListObservable<Chat[]>>this.db.list(`/chats/${authState.uid}`, {
            query: {
              orderByChild: 'timestamp'
            }
          }).map((chats: Chat[]) => {
            return chats.reverse();
          });
        }
      })
  }

  create(chat: Chat, userId1: string, userId2: string) {
    return this.db.object(`/chats/${userId1}/${userId2}`)
      .set(chat)
      .catch(this.handlePromiseError);
  }

  getDeepChat(userId1: string, userId2: string): FirebaseObjectObservable<Chat> {
    return <FirebaseObjectObservable<Chat>>this.db.object(`/chats/${userId1}/${userId2}`)
      .catch(this.handleObservableError);
  }

  updatePhoto(chat: FirebaseObjectObservable<Chat>, chatPhoto: string, recipientUserPhoto: string) {
    if (chatPhoto != recipientUserPhoto) {
      return chat.update({
        photo: recipientUserPhoto
      }).then(() => {
        return true;
      }).catch(this.handlePromiseError);
    }
    return Promise.resolve(false);
  }
}
