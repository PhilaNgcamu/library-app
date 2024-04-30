import actionTypes from "./actionTypes";

export const searchBook = (query) => {
  return async (dispatch) => {
    try {
      // Construct the Open Library API endpoint for searching the book title
      const encodedQuery = encodeURIComponent(query);
      console.log(encodedQuery);
      const endpoint = `https://openlibrary.org/search.json?q=${encodedQuery}`;

      // Make a GET request to the Open Library API
      const response = await fetch(endpoint);
      const data = await response.json();

      // Extract book details from the first search result, if available
      if (data.docs && data.docs.length > 0) {
        const book = data.docs[0];
        const { title, author_name, subject } = book;
        console.log(subject);

        // Check if author_name is available and get the first author
        const author =
          author_name && author_name.length > 0 ? author_name[0] : "";

        // Check if subject is available and get the first category
        const category = subject && subject.length > 0 ? subject[1] : "";

        // Generate a unique ID for the book (using the OLID)
        const id = book.key.replace("/works/", "");

        // Dispatch action to add the book to the Redux store
        dispatch(addBook(id, title, author, category));
      } else {
        console.log("Book not found");
      }
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
