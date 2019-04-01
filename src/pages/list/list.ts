import { Component } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { NavController, NavParams } from 'ionic-angular';
import { User } from './../../models/user.model';
import { UserProvider } from './../../providers/user/user.provider';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  items: FirebaseListObservable<User[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider
  ) {

    this.items = this.userProvider.users;

    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }

  itemTapped(event, item) {
    console.log('item', item);
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });
  }
}
