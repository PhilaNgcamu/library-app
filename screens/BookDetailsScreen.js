// BookDetailsScreen.js

import React from "react";
import { View, Text } from "react-native";

const BookDetailsScreen = ({ route }) => {
  // Extract the book ID from the navigation parameters
  const { bookId } = route.params;

  // Here, you can fetch the book details from your Redux store or any other data source

  return (
    <View>
      <Text>Book Details Screen</Text>
      <Text>Book ID: {bookId}</Text>
    </View>
  );
};

export default BookDetailsScreen;
