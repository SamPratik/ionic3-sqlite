import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

interface IExpense {
  rowid: number;
  date: string;
  type: string;
  description: string;
  amount: number
}
/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {
  // expenses = [];
  constructor(private sqlite: SQLite, private db: SQLiteObject) {
    console.log('Hello DataProvider Provider');
  }

  getData(): Promise<Array<IExpense>> {
    let expenses = [];
    return new Promise(resolve => {
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(
          'CREATE TABLE IF NOT EXISTS expense(rowid INTEGER PRIMARY KEY, date TEXT, type TEXT, description TEXT, amount INT)',
          {}
        )
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
        db.executeSql('SELECT * FROM expense ORDER BY rowid DESC', {})
        .then(res => {
          for(var i=0; i<res.rows.length; i++) {
            expenses.push({
              rowid: res.rows.item(i).rowid,
              date: res.rows.item(i).date,
              type: res.rows.item(i).type,
              description: res.rows.item(i).description,
              amount: res.rows.item(i).amount
            });
          }
          resolve(expenses);
        })
        .catch(e => console.log(e));
      }).catch(e => console.log(e));
    });

  }

  getBalance(): Promise<number> {
    let balance = 0;
    let totalIncome = 0;
    let totalExpense = 0;
    return new Promise(resolve => {
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.calcTotalIncome()
        .then(result => {
          db.executeSql("SELECT SUM(amount) AS totalExpense FROM expense WHERE type='Expense'", {})
          .then(res => {
            if(res.rows.length > 0) {
              totalExpense = parseInt(res.rows.item(0).totalExpense);
              balance = result - totalExpense;
              resolve(balance);
            } else {
              resolve(balance);
            }
          }, err => {
            console.log(err);
          });
        }, err => {
          console.log(err);
        });
        // resolve(balance);
      }, err => {
        console.log(err);
      });
    });
  }

  calcTotalIncome(): Promise<number> {
    let totalIncome = 0;
    return new Promise(resolve => {
      this.db.executeSql('SELECT SUM(amount) AS totalIncome FROM expense WHERE type="Income"', {})
      .then(res => {
        if(res.rows.length > 0) {
          totalIncome = parseInt(res.rows.item(0).totalIncome);
          resolve(totalIncome);
        } else {
          resolve(totalIncome);
        }
      }, err => {
        console.log(err);
      });
    });
  }
}
