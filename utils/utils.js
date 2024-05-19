import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("books.db");

export const createTables = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        author TEXT,
        genre TEXT,
        description TEXT,
        pageCount INTEGER,
        publishedDate TEXT,
        language TEXT,
        coverUrl TEXT,
        available BOOLEAN
      );`
    );
  });
};

export const addBookToDB = (book) => {
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO books (title, author, genre, description, pageCount, publishedDate, language, coverUrl, available) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        book.title,
        book.author,
        book.genre,
        book.description,
        book.pageCount,
        book.publishedDate,
        book.language,
        book.coverUrl,
        book.available,
      ]
    );
  });
};

export const deleteBookFromDB = (id) => {
  db.transaction((tx) => {
    tx.executeSql(`DELETE FROM books WHERE id = ?;`, [id]);
  });
};

export const fetchBooksFromDB = (callback) => {
  db.transaction((tx) => {
    tx.executeSql(`SELECT * FROM books;`, [], (_, { rows: { _array } }) => {
      callback(_array);
    });
  });
};
