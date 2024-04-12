import { Button, ButtonText } from "@gluestack-ui/themed";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const BookDetailsScreen = ({ route, navigation }) => {
  const { bookId } = route.params;

  const book = useSelector((state) =>
    state.books.books.find((book) => book.id === bookId)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Details</Text>
      {book ? (
        <View>
          <Text style={styles.label}>Title:</Text>
          <Text style={styles.text}>{book.title}</Text>

          <Text style={styles.label}>Author:</Text>
          <Text style={styles.text}>{book.author}</Text>

          <Text style={styles.label}>Genre:</Text>
          <Text style={styles.text}>{book.genre}</Text>
        </View>
      ) : (
        <Text style={styles.text}>Book details not found.</Text>
      )}

      <Button bgColor="#32a244" onPress={() => navigation.goBack()}>
        <ButtonText>Go Back</ButtonText>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default BookDetailsScreen;
