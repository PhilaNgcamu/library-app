import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import BookManagementScreen from "./BookManagementScreen";
import QRCodeScannerScreen from "./BarcodeScannerScreen";
import ViewBookScreen from "./ViewBookScreen";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MBC Library"
        component={BookManagementScreen}
        options={{
          headerStyle: {
            backgroundColor: "#32a244",
            shadowColor: "transparent",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          animation: "slide_from_right",
        }}
      />

      <Stack.Screen name="View Book" component={ViewBookScreen} />
      <Stack.Screen name="Scan QR Code" component={QRCodeScannerScreen} />
    </Stack.Navigator>
  );
};

const NavigationApp = () => {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default NavigationApp;
