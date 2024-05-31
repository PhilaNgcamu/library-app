import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";

const GenreScreen = ({ navigation }) => {
  const allBooks = useSelector((state) => state.books.books);

  const categorizeBooksByGenre = () => {
    const categorizedBooks = {};
    allBooks.forEach((book) => {
      if (!categorizedBooks[book.genre]) {
        categorizedBooks[book.genre] = [];
      }
      categorizedBooks[book.genre].push(book);
    });

    return categorizedBooks;
  };

  const renderGenreItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Book Details", { bookId: item.id })}
      style={styles.bookItem}
    >
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>{item.author}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {Object.entries(categorizeBooksByGenre()).map(([genre, books]) => (
        <View key={genre}>
          <Text style={styles.genreTitle}>{genre}</Text>
          <FlatList
            data={books}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderGenreItem}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  genreTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#32a244",
  },
  listContainer: {
    paddingBottom: 20,
  },
  bookItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  bookAuthor: {
    fontSize: 16,
    color: "#777",
    marginTop: 5,
  },
});

export default GenreScreen;
