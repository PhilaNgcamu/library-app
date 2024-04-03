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

const addBook = (title, author, genre, available) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT INTO books (title, author, genre, available) VALUES (?, ?, ?, ?)",
          [title, author, genre, available],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              resolve("Book added successfully");
            } else {
              reject(new Error("Failed to add book"));
            }
          },
          (_, error) => reject(error)
        );
      },
      (error) => reject(error)
    );
  });
};

const getAllBooks = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT * FROM books",
          [],
          (_, { rows }) => resolve(rows._array),
          (_, error) => reject(error)
        );
      },
      (error) => reject(error)
    );
  });
};

const updateBook = (id, title, author, genre, available) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "UPDATE books SET title = ?, author = ?, genre = ?, available = ? WHERE id = ?",
          [title, author, genre, available, id],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              resolve("Book updated successfully");
            } else {
              reject(new Error("Failed to update book"));
            }
          },
          (_, error) => reject(error)
        );
      },
      (error) => reject(error)
    );
  });
};

const deleteBook = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "DELETE FROM books WHERE id = ?",
          [id],
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) {
              resolve("Book deleted successfully");
            } else {
              reject(new Error("Failed to delete book"));
            }
          },
          (_, error) => reject(error)
        );
      },
      (error) => reject(error)
    );
  });
};

export { db, initialiseDatabase };
