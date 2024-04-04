import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addBook,
  deleteBook,
  setAuthor,
  setGenre,
  setTitle,
} from "../../redux/actions";
import { View, Text, Input, Button, FlatList } from "@gluestack-ui/themed";

const BookManagementScreen = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books);
  const title = useSelector((state) => state.title);
  const author = useSelector((state) => state.author);
  const genre = useSelector((state) => state.genre);

  const handleAddBook = () => {
    dispatch(addBook(title, author, genre));
    dispatch(setTitle(""));
    dispatch(setAuthor(""));
    dispatch(setGenre(""));
  };

  const handleDeleteBook = (id) => {
    dispatch(deleteBook(id));
  };

  const renderItem = ({ item }) => {
    if (!item) {
      return null;
    }
    console.log("Philasande", item);
    return (
      <TouchableOpacity onPress={() => handleDeleteBook(item.id)}>
        <View style={styles.listItem}>
          <Text style={styles.title}>{item.title || ""}</Text>
          <Text style={styles.subtitle}>
            {item.author + " - " + item.genre}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Input
        label="Title"
        placeholder="Enter title"
        value={title}
        onChangeText={(text) => dispatch(setTitle(text))}
      />
      <Input
        label="Author"
        placeholder="Enter author"
        value={author}
        onChangeText={(text) => dispatch(setAuthor(text))}
      />
      <Input
        label="Genre"
        placeholder="Enter genre"
        value={genre}
        onChangeText={(text) => dispatch(setGenre(text))}
      />
      <Button title="Add Book" onPress={handleAddBook} />
      <FlatList
        data={books || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
  },
});

export default BookManagementScreen;
