import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

/**
 * Generated class for the EditDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-data',
  templateUrl: 'edit-data.html',
})
export class EditDataPage {
  data = {date: "", type: "", description: "", amount: 0};
  rowid: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite, private toast: Toast) {
    this.rowid = this.navParams.get('rowid');
  }

  ionViewDidLoad() {
    this.getData();
  }

  // ionViewWillEnter() {
  //   this.getData();
  // }

  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql("SELECT * FROM expense WHERE rowid=?", [this.rowid])
      .then(res => {
        if(res.rows.length > 0) {
          this.data.date = res.rows.item(0).date;
          this.data.type = res.rows.item(0).type;
          this.data.description = res.rows.item(0).description;
          this.data.amount = res.rows.item(0).amount;
        }
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
    console.log('ionViewDidLoad EditDataPage');
  }

  updateData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql("UPDATE expense SET date=?, type=?, description=?, amount=? WHERE rowid=?", [this.data.date,this.data.type,this.data.description,this.data.amount,this.rowid])
      .then(res => {
        this.toast.show('Data Edited', '5000', 'center').subscribe(
          toast => {
            this.navCtrl.popToRoot();
          }
        );
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

}
