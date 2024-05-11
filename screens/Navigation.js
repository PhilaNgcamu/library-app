import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import BookManagementScreen from "./BookManagementScreen";
import QRCodeScannerScreen from "./BarcodeScannerScreen";
import ViewBookScreen from "./ViewBookScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

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

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#32a244",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#32a244",
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tab.Screen
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
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Scan QR Code"
        component={QRCodeScannerScreen}
        options={{
          tabBarLabel: "Add New Book",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const NavigationApp = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

export default NavigationApp;
