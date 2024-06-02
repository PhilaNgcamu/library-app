import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import BookManagementScreen from "./BookManagementScreen";
import QRCodeScannerScreen from "./BarcodeScannerScreen";
import ViewBookScreen from "./ViewBookScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import BorrowingDetailsScreen from "./BorrowingDetailsScreen";
import UsersScreen from "./UsersScreen";
import GenreScreen from "./GenreScreen";

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={BookManagementScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Book Details" component={ViewBookScreen} />
      <Stack.Screen name="Scan Barcode" component={QRCodeScannerScreen} />
      <Stack.Screen
        name="Borrowing Details"
        component={BorrowingDetailsScreen}
      />
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
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#32a244",
          borderTopWidth: 0.5,
          height: 60,
          paddingBottom: 10,
          paddingHorizontal: 10,
          paddingVertical: 5,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="MBC Library"
        component={StackNavigator}
        options={{
          headerStyle: {
            backgroundColor: "#32a244",
            shadowColor: "transparent",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarLabel: "Books",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Users"
        component={UsersScreen}
        options={{
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarLabel: "Users",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={GenreScreen}
        options={{
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarLabel: "Categories",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="category" color={color} size={size} />
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
