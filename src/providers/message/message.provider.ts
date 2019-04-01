import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database-deprecated';
import { BaseProvider } from '../base/base.provider';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Message } from '../../models/messagem.model';
import 'rxjs/add/operator/map';



@Injectable()
export class MessageProvider extends BaseProvider {

  constructor(
    public db: AngularFireDatabase,
    public http: Http
  ) {
    super();
  }

  create(message: Message, listMessages: FirebaseListObservable<Message[]>) {
    return listMessages.push(message);
  }

  getMessages(userId1: string, userId2: string): FirebaseListObservable<Message[]> {
    return <FirebaseListObservable<Message[]>>this.db.list(`/messages/${userId1}-${userId2}`, {
      query: {
        orderByChild: 'timestamp',
        limitToLast: 30
      }
    }).catch(this.handleObservableError);
  }
}
