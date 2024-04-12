import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { updateBookDetails } from "../redux/actions";

const EditBookScreen = ({ navigation, route }) => {
  const { bookId } = route.params;
  const dispatch = useDispatch();

  const book = useSelector((state) =>
    state.books.books.find((book) => book.id === bookId)
  );

  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [genre, setGenre] = useState(book.genre);

  const handleUpdateBook = () => {
    dispatch(updateBookDetails(bookId, title, author, genre));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Book</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
      />
      <TextInput
        style={styles.input}
        value={author}
        onChangeText={setAuthor}
        placeholder="Author"
      />
      <TextInput
        style={styles.input}
        value={genre}
        onChangeText={setGenre}
        placeholder="Genre"
      />
      <Button bgColor="#32a244" onPress={handleUpdateBook}>
        <ButtonText>Update Book</ButtonText>
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
  input: {
    height: 40,
    borderColor: "#32a244",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default EditBookScreen;
