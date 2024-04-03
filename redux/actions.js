import actionTypes from "./actionTypes";

export const addBook = (title, author, genre) => ({
  type: actionTypes.ADD_BOOK,
  payload: { title, author, genre },
});

export const updateBook = (id, title, author, genre) => ({
  type: actionTypes.UPDATE_BOOK,
  payload: { id, title, author, genre },
});

export const deleteBook = (id) => ({
  type: actionTypes.DELETE_BOOK,
  payload: { id },
});

export const getAllBooks = () => ({
  type: actionTypes.GET_ALL_BOOKS,
});

export const getAllBorrowings = () => ({
  type: actionTypes.GET_ALL_BORROWINGS,
});

export const setTitle = (title) => ({
  type: actionTypes.SET_TITLE,
  payload: { title },
});

export const setAuthor = (author) => ({
  type: actionTypes.SET_AUTHOR,
  payload: { author },
});

export const setGenre = (genre) => ({
  type: actionTypes.SET_GENRE,
  payload: { genre },
});
