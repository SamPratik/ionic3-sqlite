import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
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
    this.dataService.getBalance().then(result => {
      this.balance = result;
    });
  }

  ionViewWillEnter() {
    this.dataService.getData()
    .then(result => {
      this.expenses = result;
    });
    this.dataService.getBalance().then(result => {
      this.balance = result;
    });
  }



  deleteData(event, rowid) {
    this.dataService.pDeleteData(event, rowid).then(result => {
      this.balance = result;
    });
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
