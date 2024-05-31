import actionTypes from "./actionTypes";

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
          genre: categories ? categories[0] : "Unknown",
          coverUrl,
          description,
          pageCount: pageCount || "N/A",
          publishedDate,
          language,
          available: true,
          count: 1,
        };

        const existingBook = getState().books.books.find(
          (b) => b.id === isbn || (b.title === title && b.author === authors[0])
        );

        if (existingBook) {
          dispatch(increaseBookCount(isbn));
        } else {
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

export const updateBookAvailability = (bookId, count) => ({
  type: actionTypes.UPDATE_BOOK_AVAILABILITY,
  payload: { bookId, count },
});

export const storeBookIsbn = (isbn) => ({
  type: actionTypes.STORE_BOOK_ISBN,
  payload: isbn,
});

export const increaseBookCount = (id) => ({
  type: actionTypes.INCREASE_BOOK_COUNT,
  payload: { id },
});

export const decreaseBookCount = (id) => ({
  type: actionTypes.DECREASE_BOOK_COUNT,
  payload: { id },
});

export const deleteBook = (id) => ({
  type: actionTypes.DELETE_BOOK,
  payload: { id },
});

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
