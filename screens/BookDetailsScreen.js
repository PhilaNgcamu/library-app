import { Button, ButtonText } from "@gluestack-ui/themed";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { setEditingBookId } from "../redux/actions";

const BookDetailsScreen = ({ route }) => {
  const { bookId } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const book = useSelector((state) =>
    state.books.books.find((book) => book.id === bookId)
  );

  const handleEditBook = () => {
    // Dispatch action to set the editing book ID in Redux store
    dispatch(setEditingBookId(bookId));
    // Navigate to the edit screen
    navigation.navigate("Edit Book", { bookId });
  };

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

      <Button bgColor="#32a244" onPress={handleEditBook}>
        <ButtonText>Edit Book</ButtonText>
        <Entypo name="edit" size={15} color="#fff" />
      </Button>

      <Button
        bgColor="#32a244"
        onPress={() => navigation.goBack()}
        style={{ marginTop: 20 }}
      >
        <ButtonText>Go Back</ButtonText>
        <Entypo name="back" size={15} color="#fff" />
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
