import React from "react";
import { Provider } from "react-redux";
import BookManagementScreen from "./src/components/BookManagementScreen";
import store from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <BookManagementScreen />
    </Provider>
  );
};

export default App;
