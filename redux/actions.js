import { ref, set, get, update, push, remove } from "firebase/database";
import actionTypes from "./actionTypes";
import { database } from "../services/firebase/config";

export const searchBook = (isbn, startIndex = 0, maxResults = 10) => {
  console.log("searchBook action creator called with ISBN:", isbn);
  return async (dispatch, getState) => {
    try {
      console.log("searchBook thunk executing");
      const endpoint = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=AIzaSyDt1fKruEU3J5Z0j8gWuy3sziVtqCMuf1M`;
      console.log("Searching ISBN:", endpoint);

      const response = await fetch(endpoint);
      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        // Create a manual entry if book not found in Google Books
        const book = {
          id: isbn,
          title: "Manual Entry",
          author: "Unknown Author",
          genre: "Uncategorized",
          coverUrl: null,
          description: "No description available",
          pageCount: "N/A",
          publishedDate: new Date().toISOString(),
          language: "unknown",
          available: true,
          count: 1,
          isManualEntry: true,
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

        dispatch(
          setSnackbarMessage(
            "Book not found in Google Books. Created manual entry."
          )
        );
        dispatch(setSnackbarVisible(true));

        return isbn;
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

      console.log("Book Info:", bookInfo);

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
      const booksRef = ref(database, "books");
      const snapshot = await get(booksRef);

      console.log("Snapshot:", snapshot);

      if (snapshot.exists()) {
        const books = snapshot.val();
        const booksArray = Object.keys(books).map((key) => ({
          id: key,
          ...books[key],
        }));

        console.log("Books Array:", booksArray);

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
        bookInfo: {
          title: currentBook.title,
          author: currentBook.author,
          isbn: currentBook.id,
          genre: currentBook.genre,
          coverUrl: currentBook.coverUrl,
        },
        borrowingDetails: {
          borrowedBy: bookData.memberName + " " + bookData.memberSurname,
          borrowedAt: borrowDate.toISOString(),
          dueDate: returnDate.toISOString(),
          location: bookData.location || "Main Library",
          notes: bookData.notes || "",
        },
      };

      // Add to Firebase
      const borrowedBooksRef = ref(database, "borrowedBooks");
      await push(borrowedBooksRef, borrowedBook);

      // Update book count in Firebase
      const bookRef = ref(database, `books/${bookData.book.id}`);
      await update(bookRef, {
        count: currentBook.count - 1,
        available: currentBook.count - 1 > 0,
        lastBorrowed: borrowDate.toISOString(),
        currentBorrower: borrowedBook.studentInfo,
      });

      // Update Redux store
      dispatch({
        type: actionTypes.BORROW_BOOK,
        payload: borrowedBook,
      });

      dispatch(updateBookCount(bookData.book.id, currentBook.count - 1));
      dispatch(setSnackbarMessage("Book borrowed successfully"));
      dispatch(setSnackbarVisible(true));
      return { success: true };
    } catch (error) {
      console.error("Error borrowing book:", error);
      dispatch(setSnackbarMessage("Error borrowing book"));
      dispatch(setSnackbarVisible(true));
      return { success: false, error: error.message };
    }
  };
};

export const setReturnDate = (date) => ({
  type: actionTypes.SET_RETURN_DATE,
  payload: date,
});
