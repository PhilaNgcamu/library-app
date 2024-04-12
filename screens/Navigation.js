import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import BookDetailsScreen from "./BookDetailsScreen";
import BookManagementScreen from "./BookManagementScreen";
import EditBookScreen from "./EditBookScreen";

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
      <Stack.Screen name="Book Details" component={BookDetailsScreen} />
      <Stack.Screen name="Edit Book" component={EditBookScreen} />
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
