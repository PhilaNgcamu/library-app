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
        <MaterialCommunityIcons
          name="bookmark"
          size={24}
          color={selectedCategory === item ? "#fff" : "#666"}
        />
        <Text
          style={[
            styles.categoryTitle,
            selectedCategory === item && styles.selectedCategoryTitle,
          ]}
        >
          {item}
        </Text>
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
          source={{ uri: item.coverUrl || "https://via.placeholder.com/150" }}
          style={styles.bookCover}
        />
        <View style={styles.overlay} />
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
        <View style={styles.content}>
          <Text style={styles.headerTitle}>Explore Genres</Text>
          <View style={styles.categoriesWrapper}>
            <FlatList
              data={Object.keys(categorizedBooks)}
              keyExtractor={(item) => item}
              renderItem={renderCategoryItem}
              horizontal={false}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.categoryListContainer}
              initialNumToRender={6}
              maxToRenderPerBatch={6}
            />
          </View>

          <Animated.View
            style={[styles.bookListContainer, { transform: [{ translateY }] }]}
          >
            {selectedCategory && (
              <FlatList
                data={categorizedBooks[selectedCategory]}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderBookItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.booksContainer}
                initialNumToRender={4}
                maxToRenderPerBatch={4}
              />
            )}
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 20,
  },
  categoriesWrapper: {
    flex: 1,
    maxHeight: "50%",
  },
  categoryListContainer: {
    paddingVertical: 10,
  },
  categoryItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    margin: 6,
    padding: 15,
    borderRadius: 12,
    minWidth: (width - 60) / 2,
  },
  selectedCategoryItem: {
    backgroundColor: "#32a244",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginLeft: 10,
  },
  selectedCategoryTitle: {
    color: "#fff",
  },
  bookListContainer: {
    marginTop: 20,
    height: 280,
  },
  booksContainer: {
    paddingRight: 25,
    marginBottom: 20,
  },
  bookItem: {
    width: 160,
    marginRight: 15,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  bookCover: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1,
  },
  bookInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    zIndex: 2,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bookAuthor: {
    fontSize: 14,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
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
});

export default GenreScreen;
