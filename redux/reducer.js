import actionTypes from "./actionTypes";

const initialState = {
  books: [],
  borrowings: [],
  title: "",
  author: "",
  genre: "",
  editingBookId: null,
};

const booksReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_TITLE:
      return {
        ...state,
        title: action.payload.title,
      };
    case actionTypes.SET_AUTHOR:
      return {
        ...state,
        author: action.payload.author,
      };
    case actionTypes.SET_GENRE:
      return {
        ...state,
        genre: action.payload.genre,
      };
    case actionTypes.ADD_BOOK:
      console.log(action.payload);
      // If the action.payload is an array, it means it's the data from the Google Books API
      // We'll handle it accordingly
      if (Array.isArray(action.payload)) {
        const booksToAdd = action.payload.map((book) => ({
          id: book.id,
          title: book.volumeInfo.title,
          author: book.volumeInfo.authors
            ? book.volumeInfo.authors.join(", ")
            : "Unknown",
          genre: book.volumeInfo.categories
            ? book.volumeInfo.categories.join(", ")
            : "Unknown",
        }));
        return {
          ...state,
          books: [...state.books, ...booksToAdd],
        };
      }
      // If the action.payload is a single book object, it means it's added directly
      // We'll handle it the same way as before
      return {
        ...state,
        books: [...state.books, action.payload],
      };

    case actionTypes.SET_EDITING_BOOK_ID:
      return {
        ...state,
        editingBookId: action.payload,
      };
    case actionTypes.UPDATE_BOOK_DETAILS:
      return {
        ...state,
        books: state.books.map((book) =>
          book.id === action.payload.bookId
            ? {
                ...book,
                title: action.payload.title,
                author: action.payload.author,
                genre: action.payload.genre,
              }
            : book
        ),
      };
    case actionTypes.DELETE_BOOK:
      return {
        ...state,
        books: state.books.filter((book) => book.id !== action.payload.id),
      };
    case actionTypes.GET_ALL_BOOKS:
      return {
        ...state,
        books: action.payload,
      };
    case actionTypes.GET_ALL_BORROWINGS:
      return {
        ...state,
        borrowings: action.payload,
      };
    default:
      return state;
  }
};

export default booksReducer;
