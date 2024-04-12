import React, { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { Snackbar } from "react-native-paper";
import {
  addBook,
  deleteBook,
  setAuthor,
  setGenre,
  setTitle,
} from "../redux/actions";
import {
  View,
  Text,
  Button,
  FlatList,
  Input,
  InputField,
  ButtonText,
} from "@gluestack-ui/themed";

const BookManagementScreen = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);
  const title = useSelector((state) => state.books.title);
  const author = useSelector((state) => state.books.author);
  const genre = useSelector((state) => state.books.genre);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigation = useNavigation();

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

    setSnackbarMessage("Book added successfully!");
    setSnackbarVisible(true);
  };

  const handleDeleteBook = (id) => {
    dispatch(deleteBook(id));
  };

  const renderItem = ({ item }) => {
    if (!item) {
      return null;
    }

    const handleViewDetails = () => {
      navigation.navigate("Book Details", { bookId: item.id });
    };

    return (
      <TouchableOpacity onPress={handleViewDetails}>
        <View style={styles.listItem}>
          <Text style={styles.title}>{item.title || ""}</Text>
          <Text style={styles.author}>{item.author || ""}</Text>
          <Text style={styles.genre}>{item.genre || ""}</Text>
          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color="black"
            style={{
              marginLeft: "auto",
              position: "absolute",
              top: "50%",
              right: 10,
            }}
          />
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

      <Snackbar
        visible={snackbarVisible}
        style={{
          backgroundColor: "#32a244",
        }}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
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
    backgroundColor: "#ddd",
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

export default BookManagementScreen;
