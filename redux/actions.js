import { ref, set, get, update, push, remove } from "firebase/database";
import actionTypes from "./actionTypes";
import { database } from "../services/firebase/config";

export const searchBook = (isbn, startIndex = 0, maxResults = 10) => {
  return async (dispatch, getState) => {
    try {
      console.log("Searching for ISBN:", isbn);
      const endpoint = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&startIndex=${startIndex}&maxResults=${maxResults}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        dispatch(
          setSnackbarMessage(
            "Book not found in database. Please try a different ISBN."
          )
        );
        dispatch(setSnackbarVisible(true));
        return null;
      }

      // Book found in Google Books API
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

      // Check if book with same title and author exists
      const existingBooks = getState().books.books;
      const duplicateBook = existingBooks.find(
        (book) =>
          book.title.toLowerCase() === (title || "").toLowerCase() &&
          book.author.toLowerCase() ===
            (authors ? authors[0] : "").toLowerCase()
      );

      if (duplicateBook) {
        // Increment count of existing book
        const booksRef = ref(database, "books");
        const bookRef = ref(database, `books/${duplicateBook.firebaseId}`);
        await update(bookRef, {
          count: duplicateBook.count + 1,
          lastUpdated: new Date().toISOString(),
        });

        dispatch({
          type: actionTypes.INCREASE_BOOK_COUNT,
          payload: { id: duplicateBook.id },
        });

        dispatch(setSnackbarMessage("Book count increased"));
        dispatch(setSnackbarVisible(true));

        return duplicateBook.id;
      }

      // If no duplicate found, create new book
      const book = {
        id: isbn,
        title: title || "Unknown Title",
        author: authors ? authors[0] : "Unknown Author",
        genre: categories ? categories[0] : "Uncategorized",
        coverUrl: imageLinks ? imageLinks.thumbnail : null,
        description: description || "No description available",
        pageCount: pageCount || "N/A",
        publishedDate,
        language,
        available: true,
        count: 1,
        lastUpdated: new Date().toISOString(),
      };

      // Update Firebase database
      const booksRef = ref(database, "books");
      const newBookRef = push(booksRef);
      await set(newBookRef, book);

      // Update Redux store
      dispatch({
        type: actionTypes.ADD_BOOK,
        payload: { ...book, firebaseId: newBookRef.key },
      });

      dispatch(setSnackbarMessage("New book added"));
      dispatch(setSnackbarVisible(true));

      return isbn;
    } catch (error) {
      console.error("Error searching book:", error);
      dispatch(setSnackbarMessage("Error searching book. Please try again."));
      dispatch(setSnackbarVisible(true));
      return null;
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
      console.log("Fetching books...");
      const booksRef = ref(database, "books");
      const snapshot = await get(booksRef);

      if (snapshot.exists()) {
        const booksData = snapshot.val();
        const booksArray = Object.entries(booksData).map(([key, value]) => ({
          ...value,
          firebaseId: key,
        }));

        dispatch({
          type: actionTypes.SET_BOOKS,
          payload: booksArray,
        });

        console.log(`Fetched ${booksArray.length} books successfully`);
        return booksArray;
      } else {
        console.log("No books found in database");
        dispatch({
          type: actionTypes.SET_BOOKS,
          payload: [],
        });
        return [];
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  };
};

export const updateBookCount = (bookId, newCount) => {
  return async (dispatch) => {
    try {
      // Update Firebase
      const bookRef = ref(database, `books/${bookId}`);
      await update(bookRef, {
        count: newCount,
        lastUpdated: new Date().toISOString(),
      });

      // Update Redux store
      dispatch({
        type: actionTypes.UPDATE_BOOK_AVAILABILITY,
        payload: { bookId, count: newCount },
      });
    } catch (error) {
      console.error("Error updating book count:", error);
      dispatch(setSnackbarMessage("Error updating book count"));
      dispatch(setSnackbarVisible(true));
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

export const deleteBook = (bookId) => {
  return async (dispatch) => {
    try {
      // Delete from Firebase
      const bookRef = ref(database, `books/${bookId}`);
      await remove(bookRef);

      // Update Redux store
      dispatch({
        type: actionTypes.DELETE_BOOK,
        payload: { id: bookId },
      });

      dispatch(setSnackbarMessage("Book deleted successfully"));
      dispatch(setSnackbarVisible(true));
    } catch (error) {
      console.error("Error deleting book:", error);
      dispatch(setSnackbarMessage("Error deleting book"));
      dispatch(setSnackbarVisible(true));
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

export const borrowBook = (bookData) => {
  return async (dispatch, getState) => {
    try {
      // Check if book is still available
      const currentBook = getState().books.books.find(
        (book) => book.id === bookData.book.id
      );

      if (!currentBook || currentBook.count <= 0) {
        return {
          success: false,
          error: "Book is no longer available",
        };
      }

      const borrowDate = new Date();
      const returnDate = new Date(borrowDate);
      returnDate.setDate(borrowDate.getDate() + 28);

      const borrowedBook = {
        ...bookData,
        borrowedDate: borrowDate.toISOString(),
        returnDate: returnDate.toISOString(),
        status: "borrowed",
        bookId: currentBook.id,
      };

      // Add to Firebase
      const borrowedBooksRef = ref(database, "borrowedBooks");
      const newBorrowRef = await push(borrowedBooksRef, borrowedBook);

      // Update book count and availability in Firebase
      const bookRef = ref(database, `books/${currentBook.firebaseId}`);
      const newCount = currentBook.count - 1;
      await update(bookRef, {
        count: newCount,
        available: newCount > 0,
        lastBorrowed: borrowDate.toISOString(),
      });

      // Update Redux store - decrease book count
      dispatch({
        type: actionTypes.DECREASE_BOOK_COUNT,
        payload: {
          id: currentBook.id,
          count: newCount,
        },
      });

      // Add borrowed book to store
      dispatch({
        type: actionTypes.UPDATE_BORROWED_BOOKS,
        payload: {
          ...borrowedBook,
          id: newBorrowRef.key,
        },
      });

      return { success: true };
    } catch (error) {
      console.error("Error borrowing book:", error);
      return { success: false, error: error.message };
    }
  };
};
