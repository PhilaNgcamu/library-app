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
import {
  View,
  Text,
  Button,
  FlatList,
  Input,
  InputField,
  ButtonText,
  ButtonIcon,
} from "@gluestack-ui/themed";

const BookManagementScreen = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books);
  const title = useSelector((state) => state.books.title);
  const author = useSelector((state) => state.books.author);
  const genre = useSelector((state) => state.books.genre);

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
    console.log("item", item);
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

  console.log(books);

  return (
    <View style={styles.container}>
      <Input
        variant="outline"
        size="md"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}
      >
        <InputField
          placeholder="Enter title"
          value={title}
          onChangeText={(text) => dispatch(setTitle(text))}
        />
      </Input>
      <Input
        variant="outline"
        size="md"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}
      >
        <InputField
          placeholder="Enter author"
          value={author}
          onChangeText={(text) => dispatch(setAuthor(text))}
        />
      </Input>
      <Input
        variant="outline"
        size="md"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}
      >
        <InputField
          placeholder="Enter genre"
          value={genre}
          onChangeText={(text) => dispatch(setGenre(text))}
        />
      </Input>
      <Button
        size="md"
        variant="solid"
        action="primary"
        isDisabled={false}
        isFocusVisible={false}
        onPress={handleAddBook}
      >
        <ButtonText>Add Book</ButtonText>
      </Button>

      <FlatList data={books} renderItem={renderItem} />
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
    borderBottomColor: "#000",
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
