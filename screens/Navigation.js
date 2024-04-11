import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import BookManagement from "../src/components/BookManagement";
import BookDetailsScreen from "./BookDetailsScreen";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MBC Library"
        component={BookManagement}
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
      <Stack.Screen name="BookDetailsScreen" component={BookDetailsScreen} />
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
