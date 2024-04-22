import { createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import logger from "redux-logger";
import booksReducer from "./reducer";

const rootReducer = combineReducers({
  books: booksReducer,
});

const store = createStore(rootReducer, applyMiddleware(logger, thunk));

export default store;
