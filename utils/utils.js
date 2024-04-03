import { SQLite } from "expo-sqlite";

const db = SQLite.openDatabase("bookbuddy.db");

const initialiseDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, genre TEXT, available INTEGER)"
    );
  });

  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS borrowings (id INTEGER PRIMARY KEY AUTOINCREMENT, book_id INTEGER, borrower_name TEXT, contact_info TEXT, date_borrowed TEXT, date_returned TEXT, status TEXT, FOREIGN KEY (book_id) REFERENCES books(id))"
    );
  });
};

export { db, initialiseDatabase };
