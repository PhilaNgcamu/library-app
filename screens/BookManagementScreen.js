import React, { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Snackbar } from "react-native-paper";
import { searchBook } from "../redux/actions";
import { View, Text, Button, FlatList, ButtonText } from "@gluestack-ui/themed";

const BookManagementScreen = () => {
  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);
  const title = useSelector((state) => state.books.title);
  const author = useSelector((state) => state.books.author);
  const genre = useSelector((state) => state.books.genre);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    dispatch(searchBook("Coronavirus and Christ"));
  }, [dispatch]);

  const navigation = useNavigation();

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
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>{item.author}</Text>
          <Text style={styles.genre}>{item.genre}</Text>
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
      <Button onPress={() => navigation.navigate("Scan QR Code")}>
        <ButtonText>Scan QR Code</ButtonText>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
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
