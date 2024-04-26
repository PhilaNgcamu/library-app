import actionTypes from "./actionTypes";

export const searchBook = (query) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
      );
      const data = await response.json();
      console.log(JSON.stringify(data, null, 2));

      dispatch(addBook(data[0]));
    } catch (error) {
      console.error("Error searching book:", error);
    }
  };
};

export const addBook = (id, title, author, genre) => ({
  type: actionTypes.ADD_BOOK,
  payload: { id, title, author, genre },
});

export const setEditingBookId = (id) => ({
  type: actionTypes.SET_EDITING_BOOK_ID,
  payload: { id },
});

export const updateBookDetails = (bookId, title, author, genre) => ({
  type: actionTypes.UPDATE_BOOK_DETAILS,
  payload: { bookId, title, author, genre },
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
