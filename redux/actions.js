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

export const increaseBookCount = (id) => ({
  type: actionTypes.INCREASE_BOOK_COUNT,
  payload: { id },
});

export const deleteBook = (id) => ({
  type: actionTypes.DELETE_BOOK,
  payload: { id },
});

export const setEditingBookId = (id) => ({
  type: actionTypes.SET_EDITING_BOOK_ID,
  payload: { id },
});

export const borrowBook = (bookId) => ({
  type: actionTypes.BORROW_BOOK,
  payload: { bookId },
});

export const returnBook = (bookId) => ({
  type: actionTypes.RETURN_BOOK,
  payload: { bookId },
});

export const updateBookDetails = (bookId, title, author, genre) => ({
  type: actionTypes.UPDATE_BOOK_DETAILS,
  payload: { bookId, title, author, genre },
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
