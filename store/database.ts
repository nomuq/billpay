import * as SQLite from "expo-sqlite";

class Database {
  private db: SQLite.WebSQLDatabase;

  constructor() {
    this.db = SQLite.openDatabase("billpay.db");
  }

  // singleton instance
  private static instance: Database;

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  init() {
    return this.runQuery(
      "CREATE TABLE IF NOT EXISTS billpay (id INTEGER PRIMARY KEY NOT NULL, type TEXT NOT NULL, name TEXT NOT NULL, amount INTEGER NOT NULL, date TEXT NOT NULL, paid INTEGER NOT NULL, note TEXT);"
    );
  }

  removeBill(id: number) {
    return this.runQuery("DELETE FROM billpay WHERE id = ?", [id]);
  }

  // get total amount of unpaid bills
  async getTotalUnpaidAmount() {
    const result = await this.runQuery(
      "SELECT SUM(amount) AS total FROM billpay WHERE paid = 0"
    );
    return result.rows._array[0].total ?? 0;
  }

  // get total amount of paid bills
  async getTotalPaidAmount() {
    const result = await this.runQuery(
      "SELECT SUM(amount) AS total FROM billpay WHERE paid = 1"
    );
    return result.rows._array[0].total ?? 0;
  }

  // paid bills
  async getPaidBills() {
    const result = await this.runQuery("SELECT * FROM billpay WHERE paid = 1");
    return result.rows._array;
  }

  // pay bill
  payBill(id: number) {
    return this.runQuery("UPDATE billpay SET paid = 1 WHERE id = ?", [id]);
  }

  // remove all bills
  removeAllBills() {
    return this.runQuery("DELETE FROM billpay");
  }

  addBill(bill: InputBill) {
    return this.runQuery(
      "INSERT INTO billpay (type, name, amount, date, paid, note) VALUES (?, ?, ?, ?, ?, ?)",
      [bill.type, bill.name, bill.amount, bill.date, bill.paid, bill.note]
    );
  }

  async getBills() {
    const result = await this.runQuery("SELECT * FROM billpay");
    return result.rows._array as Bill[];
  }

  private runQuery(sql: string, args?: (string | number)[] | undefined) {
    return new Promise<any>((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          tx.executeSql(sql, args, (tx, results) => {
            resolve(results);
          });
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
}

export interface InputBill {
  type: BillType;
  name: string;
  amount: number;
  date: string;
  paid: number;
  note: string;
}

export enum BillType {
  "Electricity",
  "Water",
  "Gas",
  "Internet",
  "Phone",
  "Cable",
  "Rent",
  "Loan",
  "Other",
}

export interface Bill {
  id: number;
  type: BillType;
  name: string;
  amount: number;
  date: string;
  paid: number;
  note: string;
}

export default Database;
