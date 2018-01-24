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
  expenses = [];
  constructor(private sqlite: SQLite) {
    console.log('Hello DataProvider Provider');
  }

  getData(): Promise<Array<IExpense>> {
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
            this.expenses.push({
              rowid: res.rows.item(i).rowid,
              date: res.rows.item(i).date,
              type: res.rows.item(i).type,
              description: res.rows.item(i).description,
              amount: res.rows.item(i).amount
            });
          }
          resolve(this.expenses);
        })
        .catch(e => console.log(e));
      }).catch(e => console.log(e));
    });

  }
}
