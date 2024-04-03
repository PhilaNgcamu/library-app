import React from "react";
import { Provider } from "react-redux";
import BookManagementScreen from "./src/components/BookManagementScreen";
import store from "./redux/store";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

const App = () => {
  return (
    <Provider store={store}>
      <GluestackUIProvider config={config}>
        <BookManagementScreen />
      </GluestackUIProvider>
    </Provider>
  );
};

export default App;
