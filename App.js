import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

import NavigationApp from "./screens/Navigation";

const App = () => {
  return (
    <Provider store={store}>
      <GluestackUIProvider config={config}>
        <NavigationApp />
      </GluestackUIProvider>
    </Provider>
  );
};

export default App;
