import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import NavigationApp from "./screens/Navigation";
import { AuthProvider } from "./contexts/AuthContext";
import * as Notifications from "expo-notifications";

const App = () => {
  useEffect(() => {
    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }, []);

  return (
    <AuthProvider>
      <Provider store={store}>
        <NavigationApp />
      </Provider>
    </AuthProvider>
  );
};

export default App;
