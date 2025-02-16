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
import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";
import { useAuth } from "../contexts/AuthContext";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ForgotPasswordScreen from "./ForgotPasswordScreen";

const Stack = createStackNavigator();

const StackNavigator = () => {
  const { logout } = useAuth();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={BookManagementScreen}
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#32a244",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen name="Book Details" component={ViewBookScreen} />
      <Stack.Screen name="Scan Bookcode" component={QRCodeScannerScreen} />
      <Stack.Screen
        name="Borrowing Details"
        component={BorrowingDetailsScreen}
      />
    </Stack.Navigator>
  );
};

const UsersStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Users List"
        component={UsersScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Borrowing Details"
        component={BorrowingDetailsScreen}
      />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { logout, userRole } = useAuth();

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
          headerRight: () => (
            <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
              <Ionicons name="log-out-outline" size={24} color="#fff" />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "#32a244",
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
        name="Categories"
        component={GenreScreen}
        options={{
          headerStyle: {
            backgroundColor: "#32a244",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarLabel: "Categories",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="category" color={color} size={size} />
          ),
        }}
      />

      {userRole === "admin" && (
        <>
          <Tab.Screen
            name="Book Users"
            component={UsersStackNavigator}
            options={{
              headerStyle: {
                backgroundColor: "#32a244",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              tabBarLabel: "Users",
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="account"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

const AuthStack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
    </AuthStack.Navigator>
  );
};

const NavigationApp = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {user ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default NavigationApp;
