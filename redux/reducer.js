import actionTypes from "./actionTypes";

const initialState = {
  books: [],
  scanned: false,
  hasPermission: null,
  cameraKey: 0,
  storedIsbns: [],
  bookNotFound: false,
  modalVisible: false,
};

const booksReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_BOOK:
      return {
        ...state,
        books: [...state.books, action.payload],
      };

    case actionTypes.UPDATE_BOOK_AVAILABILITY:
      return {
        ...state,
        books: state.books.map((book) =>
          book.id === action.payload.bookId
            ? { ...book, count: action.payload.count }
            : book
        ),
      };

    case actionTypes.STORE_BOOK_ISBN:
      return {
        ...state,
        storedIsbns: [...state.storedIsbns, action.payload],
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

    case actionTypes.SET_SCANNED:
      return {
        ...state,
        scanned: true,
      };

    case actionTypes.RESET_SCANNED:
      return {
        ...state,
        scanned: false,
      };

    case actionTypes.SET_HAS_PERMISSION:
      return {
        ...state,
        hasPermission: action.payload,
      };

    case actionTypes.INCREMENT_CAMERA_KEY:
      return {
        ...state,
        cameraKey: state.cameraKey + 1,
      };

    case actionTypes.SCAN_MODAL_VISIBLE:
      return {
        ...state,
        modalVisible: !state.modalVisible,
      };

    default:
      return state;
  }
};

export default booksReducer;
