import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";

const GenreScreen = ({ navigation }) => {
  const allBooks = useSelector((state) => state.books.books);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categorizedBooks, setCategorizedBooks] = useState({});

  useEffect(() => {
    const categorizeBooksByGenre = () => {
      const categorizedBooks = {};
      allBooks.forEach((book) => {
        if (!categorizedBooks[book.genre]) {
          categorizedBooks[book.genre] = [];
        }
        categorizedBooks[book.genre].push(book);
      });

      setCategorizedBooks(categorizedBooks);
      setLoading(false);
    };

    categorizeBooksByGenre();
  }, [allBooks]);

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedCategory(item)}
      style={[
        styles.categoryItem,
        selectedCategory === item && styles.selectedCategoryItem,
      ]}
    >
      <Text style={styles.categoryTitle}>{item}</Text>
    </TouchableOpacity>
  );

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Book Details", { bookId: item.id })}
      style={styles.bookItem}
    >
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>{item.author}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#32a244" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Object.keys(categorizedBooks).length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            No categories or books available.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={Object.keys(categorizedBooks)}
            keyExtractor={(item) => item}
            renderItem={renderCategoryItem}
            contentContainerStyle={styles.categoryListContainer}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
          {selectedCategory && (
            <View style={styles.bookListContainer}>
              {categorizedBooks[selectedCategory].length === 1 ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Book Details", {
                      bookId: categorizedBooks[selectedCategory][0].id,
                    })
                  }
                  style={styles.singleBookItem}
                >
                  <Text style={styles.singleBookTitle}>
                    {categorizedBooks[selectedCategory][0].title}
                  </Text>
                  <Text style={styles.singleBookAuthor}>
                    {categorizedBooks[selectedCategory][0].author}
                  </Text>
                </TouchableOpacity>
              ) : (
                <FlatList
                  data={categorizedBooks[selectedCategory]}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderBookItem}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                  contentContainerStyle={styles.booksContainer}
                />
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#333",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 18,
    color: "#777",
  },
  categoryListContainer: {
    paddingBottom: 20,
  },
  categoryItem: {
    backgroundColor: "#32a244",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  selectedCategoryItem: {
    backgroundColor: "#1e7f57",
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  bookListContainer: {
    flexGrow: 1,
  },
  booksContainer: {
    paddingVertical: 10,
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
  singleBookItem: {
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
  singleBookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  singleBookAuthor: {
    fontSize: 16,
    color: "#777",
    marginTop: 5,
  },
});

export default GenreScreen;
