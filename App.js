import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import NavigationApp from "./screens/Navigation";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <NavigationApp />
      </Provider>
    </AuthProvider>
  );
};

export default App;
