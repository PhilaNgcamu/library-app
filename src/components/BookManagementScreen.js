import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addBook,
  deleteBook,
  setAuthor,
  setGenre,
  setTitle,
} from "../../redux/actions";
import { Input, Button, List, ListItem } from "@gluestack-ui/themed";

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
    console.log("Philasander", item);
    return (
      <ListItem
        title={item.title || ""}
        subtitle={item.author + " - " + item.genre}
        rightContent={
          <TouchableOpacity onPress={() => handleDeleteBook(item.id)}>
            <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
        }
      />
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
      <List
        data={books || []} // Provide an empty array if books is undefined
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  deleteButton: {
    color: "red",
  },
});

export default BookManagementScreen;
