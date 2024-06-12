import { ref, set, get, update } from "firebase/database";
import actionTypes from "./actionTypes";
import { database } from "../backend/firestoreConfig";

export const searchBook = (isbn, startIndex = 0, maxResults = 10) => {
  return async (dispatch, getState) => {
    try {
      const endpoint = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&startIndex=${startIndex}&maxResults=${maxResults}`;
      console.log(endpoint);

      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const bookInfo = data.items[0].volumeInfo;
        const {
          title,
          authors,
          categories,
          imageLinks,
          description,
          pageCount,
          publishedDate,
          language,
        } = bookInfo;

        const coverUrl = imageLinks ? imageLinks.thumbnail : null;

        const book = {
          id: isbn,
          title,
          author: authors ? authors[0] : "Unknown",
          genre: categories ? categories[0] : "Others",
          coverUrl,
          description,
          pageCount: pageCount || "N/A",
          publishedDate,
          language,
          available: true,
          count: 1,
        };

        const existingBook = getState().books.books.find(
          (b) => b.title === title && b.author === book.author
        );

        if (existingBook) {
          const newCount = existingBook.count + 1;
          const bookRef = ref(database, `books/${existingBook.id}`);
          await update(bookRef, { count: newCount, available: true });
          dispatch({
            type: actionTypes.INCREASE_BOOK_COUNT,
            payload: { id: existingBook.id },
          });
          dispatch(storeBookIsbn(isbn));
          dispatch(addBook(book));
        } else {
          const bookRef = ref(database, `books/${isbn}`);
          await set(bookRef, book);
          dispatch(storeBookIsbn(isbn));
          dispatch(addBook(book));
        }
      } else {
        console.log("Book not found");
      }
    } catch (error) {
      console.error("Error searching book:", error);
    }
  };
};

export const addBook = (book) => ({
  type: actionTypes.ADD_BOOK,
  payload: book,
});

export const fetchBooks = () => {
  return async (dispatch) => {
    try {
      const booksRef = ref(database, "books");
      const snapshot = await get(booksRef);

      if (snapshot.exists()) {
        const books = snapshot.val();
        const booksArray = Object.keys(books).map((key) => ({
          id: key,
          ...books[key],
        }));

        dispatch({
          type: actionTypes.SET_BOOKS,
          payload: booksArray,
        });
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };
};

export const updateBookAvailability = (bookId, count) => {
  return async (dispatch) => {
    try {
      const bookRef = ref(database, `books/${bookId}`);
      await update(bookRef, { count });
      dispatch({
        type: actionTypes.UPDATE_BOOK_AVAILABILITY,
        payload: { bookId, count },
      });
    } catch (error) {
      console.error("Error updating book availability:", error);
    }
  };
};

export const storeBookIsbn = (isbn) => ({
  type: actionTypes.STORE_BOOK_ISBN,
  payload: isbn,
});

export const increaseBookCount = (id) => {
  return async (dispatch, getState) => {
    try {
      const book = getState().books.books.find((b) => b.id === id);
      if (book) {
        const newCount = book.count + 1;
        const bookRef = ref(database, `books/${id}`);
        await update(bookRef, { count: newCount, available: true });
        dispatch({
          type: actionTypes.INCREASE_BOOK_COUNT,
          payload: { id },
        });
      }
    } catch (error) {
      console.error("Error increasing book count:", error);
    }
  };
};

export const decreaseBookCount = (id) => {
  return async (dispatch, getState) => {
    try {
      const book = getState().books.books.find((b) => b.id === id);
      if (book && book.count > 0) {
        const newCount = book.count - 1;
        const available = newCount > 0;
        const bookRef = ref(database, `books/${id}`);
        await update(bookRef, { count: newCount, available });
        dispatch({
          type: actionTypes.DECREASE_BOOK_COUNT,
          payload: { id },
        });
      }
    } catch (error) {
      console.error("Error decreasing book count:", error);
    }
  };
};

export const deleteBook = (id) => {
  return async (dispatch) => {
    try {
      const bookRef = ref(database, `books/${id}`);
      await set(bookRef, null);
      dispatch({
        type: actionTypes.DELETE_BOOK,
        payload: { id },
      });
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };
};

export const setScanned = () => ({
  type: actionTypes.SET_SCANNED,
});

export const resetScanned = () => ({
  type: actionTypes.RESET_SCANNED,
});

export const setHasPermission = (hasPermission) => ({
  type: actionTypes.SET_HAS_PERMISSION,
  payload: hasPermission,
});

export const incrementCameraKey = () => ({
  type: actionTypes.INCREMENT_CAMERA_KEY,
});

export const isScanModalVisible = () => ({
  type: actionTypes.SCAN_MODAL_VISIBLE,
});

export const sortByKey = (key) => ({
  type: actionTypes.SORT_BY,
  payload: key,
});

export const filterByKey = (key) => ({
  type: actionTypes.FILTER_BY,
  payload: key,
});

export const searchQueryKeyword = (query) => ({
  type: actionTypes.SEARCH_QUERY,
  payload: query,
});

export const showNoBooksModal = () => ({
  type: actionTypes.SHOW_NO_BOOKS_MODAL,
});

export const setSnackbarVisible = (visible) => ({
  type: actionTypes.SET_SNACKBAR_VISIBLE,
  payload: visible,
});

export const setSnackbarMessage = (message) => ({
  type: actionTypes.SET_SNACKBAR_MESSAGE,
  payload: message,
});

export const setDropdownVisible = (visible) => ({
  type: actionTypes.SET_DROPDOWN_VISIBLE,
  payload: visible,
});

export const setSelectedBook = (book) => ({
  type: actionTypes.SET_SELECTED_BOOK,
  payload: book,
});
