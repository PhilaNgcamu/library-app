import actionTypes from "./actionTypes";

const initialState = {
  books: [],
  borrowings: [],
  title: "",
  author: "",
  genre: "",
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
      console.log("Philasande", action.payload);
      console.log("Philasande Books", state.books);
      return {
        ...state,
        books: [...state.books, action.payload],
      };
    case actionTypes.UPDATE_BOOK:
      return {
        ...state,
        books: state.books.map((book) =>
          book.id === action.payload.id
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
