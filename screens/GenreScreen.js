import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Animated,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const GenreScreen = ({ navigation }) => {
  const allBooks = useSelector((state) => state.books.books);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categorizedBooks, setCategorizedBooks] = useState({});
  const [animation] = useState(new Animated.Value(0));
  const [error, setError] = useState(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const categorizeBooksByGenre = () => {
      try {
        const categorizedBooks = {};
        allBooks.forEach((book) => {
          if (!categorizedBooks[book.genre]) {
            categorizedBooks[book.genre] = [];
          }
          categorizedBooks[book.genre].push(book);
        });

        setCategorizedBooks(categorizedBooks);
        setLoading(false);
      } catch (error) {
        console.error("Error categorizing books:", error);
        setError("Failed to load genres. Please try again.");
        setLoading(false);
      }
    };

    categorizeBooksByGenre();
  }, [allBooks]);

  const handleCategoryPress = useCallback(
    (category) => {
      setSelectedCategory(category);
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    },
    [animation]
  );

  const renderCategoryItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        onPress={() => handleCategoryPress(item)}
        style={[
          styles.categoryItem,
          selectedCategory === item && styles.selectedCategoryItem,
        ]}
      >
        <Text style={styles.categoryTitle}>{item}</Text>
      </TouchableOpacity>
    ),
    [selectedCategory, handleCategoryPress]
  );

  const renderBookItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        onPress={() => navigation.navigate("Book Details", { bookId: item.id })}
        style={styles.bookItem}
      >
        <Image
          source={{ uri: item.coverImage || "https://via.placeholder.com/150" }}
          style={styles.bookCover}
        />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {item.author}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [navigation]
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#32a244" />
        <Text style={styles.loadingText}>Loading genres...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={80}
          color="#ff6b6b"
        />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            // Implement a retry mechanism here
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {Object.keys(categorizedBooks).length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <MaterialCommunityIcons name="bookshelf" size={80} color="#32a244" />
          <Text style={styles.emptyStateText}>
            No categories or books available
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.screenTitle}>Book Genres</Text>
          <FlatList
            data={Object.keys(categorizedBooks)}
            keyExtractor={(item) => item}
            renderItem={renderCategoryItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryListContainer}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
          <Animated.View
            style={[styles.bookListContainer, { transform: [{ translateY }] }]}
          >
            {selectedCategory && (
              <>
                <Text style={styles.selectedCategoryTitle}>
                  {selectedCategory}
                </Text>
                <FlatList
                  data={categorizedBooks[selectedCategory]}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderBookItem}
                  numColumns={2}
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={10}
                  contentContainerStyle={styles.booksContainer}
                />
              </>
            )}
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  errorText: {
    fontSize: 18,
    color: "#ff6b6b",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  retryButton: {
    backgroundColor: "#32a244",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  emptyStateText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 30,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#32a244",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  categoryListContainer: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    backgroundColor: "#32a244",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 6,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCategoryItem: {
    backgroundColor: "#1e7f57",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  bookListContainer: {
    flex: 1,
    marginTop: 20,
  },
  selectedCategoryTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  booksContainer: {
    paddingHorizontal: 10,
  },
  bookItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 6,
    width: (width - 60) / 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  bookCover: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  bookInfo: {
    padding: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
  },
});

export default GenreScreen;
