import actionTypes from "./actionTypes";

export const searchBook = (isbn, startIndex = 0, maxResults = 10) => {
  return async (dispatch) => {
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

        console.log(endpoint);

        const coverUrl = imageLinks ? imageLinks.thumbnail : null;

        dispatch(
          addBook(
            isbn,
            title,
            authors[0],
            categories[0],
            coverUrl,
            description,
            pageCount || 300,
            publishedDate,
            language
          )
        );
      } else {
        console.log("Book not found");
      }
    } catch (error) {
      console.error("Error searching book:", error);
    }
  };
};

export const addBook = (
  id,
  title,
  author,
  genre,
  coverUrl,
  description,
  pageCount,
  publishedDate,
  language
) => ({
  type: actionTypes.ADD_BOOK,
  payload: {
    id,
    title,
    author,
    genre,
    coverUrl,
    description,
    pageCount,
    publishedDate,
    language,
    available: true,
  },
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
