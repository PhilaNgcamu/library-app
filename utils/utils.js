import { SQLite } from "expo-sqlite";

const db = SQLite.openDatabase("bookbuddy.db");

export const initDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, author TEXT, genre TEXT)"
    );
  });
};

export default db;
