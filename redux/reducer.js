import actionTypes from "./actionTypes";

const initialState = {
  books: [],
};

const booksReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_BOOK:
      return {
        ...state,
        books: [...state.books, action.payload],
      };

    case actionTypes.INCREASE_BOOK_COUNT:
      return {
        ...state,
        books: state.books.map((book) =>
          book.id === action.payload.id
            ? { ...book, count: book.count + 1 }
            : book
        ),
      };
    case actionTypes.DECREASE_BOOK_COUNT:
      return {
        ...state,
        books: state.books.map((book) =>
          book.id === action.payload.id
            ? { ...book, count: book.count - 1 }
            : book
        ),
      };

    case actionTypes.DELETE_BOOK:
      return {
        ...state,
        books: state.books.filter((book) => book.id !== action.payload.id),
      };

    default:
      return state;
  }
};

export default booksReducer;
