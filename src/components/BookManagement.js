import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Entypo } from "@expo/vector-icons";
import {
  addBook,
  deleteBook,
  setAuthor,
  setGenre,
  setTitle,
} from "../../redux/actions";
import {
  View,
  Text,
  Button,
  FlatList,
  Input,
  InputField,
  ButtonText,
} from "@gluestack-ui/themed";

const BookManagement = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);
  const title = useSelector((state) => state.books.title);
  const author = useSelector((state) => state.books.author);
  const genre = useSelector((state) => state.books.genre);

  const handleAddBook = () => {
    if (!title.trim() || !author.trim() || !genre.trim()) {
      alert("Please enter all book details");
      return;
    }
    const id = "_" + Math.random().toString(36).substring(2, 9);
    dispatch(addBook(id, title, author, genre));
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

    return (
      <TouchableOpacity onPress={() => handleDeleteBook(item.id)}>
        <View style={styles.listItem}>
          <Text style={styles.title}>{item.title || ""}</Text>
          <Text style={styles.author}>{item.author || ""}</Text>
          <Text style={styles.genre}>{item.genre || ""}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Add Book</Text>
        <Input style={styles.input}>
          <InputField
            value={title}
            onChangeText={(text) => dispatch(setTitle(text))}
            placeholder="Title"
          />
        </Input>
        <Input style={styles.input}>
          <InputField
            value={author}
            onChangeText={(text) => dispatch(setAuthor(text))}
            placeholder="Author"
          />
        </Input>
        <Input style={styles.input}>
          <InputField
            value={genre}
            onChangeText={(text) => dispatch(setGenre(text))}
            placeholder="Genre"
          />
        </Input>
        <Button onPress={handleAddBook} style={styles.addButton}>
          <ButtonText>Add Book </ButtonText>
          <Entypo name="plus" size={15} color="#fff" />
        </Button>
      </View>
      <FlatList
        data={books}
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

  formContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    borderColor: "#32a244",
  },
  addButton: {
    alignSelf: "flex-end",
    backgroundColor: "#32a244",
  },
  listItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  author: {
    fontSize: 16,
  },
  genre: {
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default BookManagement;