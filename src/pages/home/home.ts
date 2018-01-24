import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { AddDataPage } from '../add-data/add-data';
import { EditDataPage } from '../edit-data/edit-data';
import { DataProvider } from '../../providers/data/data';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  expenses = [];
  totalIncome = 0;
  totalExpense = 0;
  balance = 0;
  constructor(public navCtrl: NavController, private sqlite: SQLite, private dataService: DataProvider) {

  }

  ionViewDidLoad() {
    this.dataService.getData()
    .then(result => {
      this.expenses = result;
    });
    this.getBalance();
  }

  ionViewWillEnter() {
    this.dataService.getData()
    .then(result => {
      this.expenses = result;
    });
    this.getBalance();
  }



  deleteData(event, rowid) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql("DELETE FROM expense WHERE rowid=?",[rowid])
      .then(() => {
        event.target.parentElement.parentElement.parentElement.style.display = 'none';
        this.getBalance();
      })
    }).catch(e => console.log(e));
  }



  getBalance() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT SUM(amount) AS totalIncome FROM expense WHERE type="Income"', {})
      .then(res => {
        if(res.rows.length > 0) {
          this.totalIncome = parseInt(res.rows.item(0).totalIncome);
          this.balance = this.totalIncome - this.totalExpense;
        }
      }).catch(e => console.log(e));
      db.executeSql("SELECT SUM(amount) AS totalExpense FROM expense WHERE type='Expense'", {})
      .then(res => {
        if(res.rows.length > 0) {
          this.totalExpense = parseInt(res.rows.item(0).totalExpense);
          this.balance = this.totalIncome - this.totalExpense;
        }
      }).catch(e => console.log(e));
    })
  }

  addData() {
    this.navCtrl.push(AddDataPage);
  }

  editData(rowid) {
    this.navCtrl.push(EditDataPage, {
      rowid: rowid
    });
  }

}
