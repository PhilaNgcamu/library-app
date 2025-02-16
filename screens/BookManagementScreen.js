import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AnimatedFAB, Snackbar } from "react-native-paper";
import {
  decreaseBookCount,
  fetchBooks,
  filterByKey,
  searchQueryKeyword,
  setDropdownVisible,
  setSelectedBook,
  setSnackbarMessage,
  setSnackbarVisible,
  showNoBooksModal,
  sortByKey,
} from "../redux/actions";

const BookManagementScreen = () => {
  const sortBy = useSelector((state) => state.books.sortBy);
  const filterBy = useSelector((state) => state.books.filterBy);
  const searchQuery = useSelector((state) => state.books.searchQuery);
  const noBooksModal = useSelector((state) => state.books.showNoBooksModal);
  const snackbarVisible = useSelector((state) => state.books.snackbarVisible);
  const snackbarMessage = useSelector((state) => state.books.snackbarMessage);
  const dropdownVisible = useSelector((state) => state.books.dropdownVisible);
  const selectedBook = useSelector((state) => state.books.selectedBook);
  const books = useSelector((state) => state.books.books);

  const [isExtended, setIsExtended] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBooksData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await dispatch(fetchBooks());
      } catch (err) {
        setError("Failed to load books");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooksData();
  }, [dispatch]);

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyStateContainer}>
        <MaterialIcons name="library-books" size={100} color="black" />
        <Text style={styles.emptyStateText}>No books available</Text>
      </View>
    );
  };

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (filterBy === "availability") {
        return book.count > 0;
      }
      return true;
    });
  }, [books, filterBy]);

  const sortedBooks = useMemo(() => {
    return [...filteredBooks].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "author") {
        return a.author.localeCompare(b.author);
      } else if (sortBy === "count") {
        return b.count - a.count;
      } else if (sortBy === "date") {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });
  }, [filteredBooks, sortBy]);

  const searchedBooks = useMemo(() => {
    return sortedBooks.filter((book) => {
      const bookTitle = book?.title || "";
      const searchTerm = searchQuery?.toLowerCase().trim() || "";
      return bookTitle.toLowerCase().includes(searchTerm);
    });
  }, [sortedBooks, searchQuery]);

  const handleViewDetails = (bookId) => {
    navigation.navigate("Book Details", { bookId });
  };

  const allBooksUnavailable =
    filterBy === "availability" &&
    filteredBooks.every((book) => book.count === 0);

  const handleDeleteBook = (bookId) => {
    const book = books.find((b) => b.id === bookId);
    if (book.count > 1) {
      dispatch(decreaseBookCount(bookId));
      dispatch(setSnackbarMessage(`${book.count - 1} book(s) left`));
    } else if (book.count === 1) {
      dispatch(decreaseBookCount(bookId));
      dispatch(setSnackbarMessage("Book marked as Not Available"));
    } else {
      dispatch(setSnackbarMessage("Book marked as Not Available"));
    }
    dispatch(setDropdownVisible(false));
    dispatch(setSnackbarVisible(true));
  };

  const handleSort = (sortBy) => {
    dispatch(sortByKey(sortBy));
  };

  const handleFilter = (filterBy) => {
    dispatch(filterByKey(filterBy));
  };

  const handleSearch = () => {
    if (searchedBooks.length === 0) {
      dispatch(showNoBooksModal(true));
    } else {
      dispatch(setSnackbarVisible(true));
      dispatch(setSnackbarMessage("Search results updated"));
    }
  };

  const handleLongPress = (book) => {
    dispatch(setSelectedBook(book));
    dispatch(setDropdownVisible(true));
  };

  const handleAddVisitor = () => {
    navigation.navigate("Scan Bookcode");
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => handleViewDetails(item.id)}
      onLongPress={() => handleLongPress(item)}
      activeOpacity={1}
    >
      <Image
        source={{ uri: item.coverUrl }}
        style={styles.bookCover}
        resizeMode="cover"
      />
      {item.count > 0 ? (
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>Available</Text>
        </View>
      ) : (
        <View style={[styles.tagContainer, { backgroundColor: "#ff8080" }]}>
          <Text style={styles.tagText}>Not Available</Text>
        </View>
      )}
      <View style={styles.bookInfoContainer}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>by {item.author}</Text>
        <Text style={styles.bookCount}>Books left: {item.count}</Text>
      </View>
    </TouchableOpacity>
  );

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition = Math.floor(nativeEvent.contentOffset.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      await dispatch(fetchBooks());
      dispatch(setSnackbarMessage("Books refreshed successfully"));
      dispatch(setSnackbarVisible(true));
    } catch (err) {
      setError("Failed to refresh books");
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const fabStyle = { bottom: 16 };

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => dispatch(fetchBooks())}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : isLoading ? (
        <ActivityIndicator size="large" color="#32a244" />
      ) : (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search books..."
              value={searchQuery}
              onChangeText={(text) => dispatch(searchQueryKeyword(text))}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <AntDesign name="search1" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.sortFilterContainer}>
            <View style={styles.sortContainer}>
              <Picker
                selectedValue={sortBy}
                onValueChange={(value) => handleSort(value)}
              >
                <Picker.Item label="Sort by Title" value="title" />
                <Picker.Item label="Sort by Author" value="author" />
                <Picker.Item label="Sort by Count" value="count" />
                <Picker.Item label="Sort by Date" value="date" />
              </Picker>
            </View>
            <View style={styles.filterContainer}>
              <Picker
                selectedValue={filterBy}
                onValueChange={(value) => handleFilter(value)}
              >
                <Picker.Item label="All Books" value="all" />
                <Picker.Item label="Available" value="availability" />
              </Picker>
            </View>
          </View>

          {searchedBooks.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={searchedBooks}
              renderItem={renderBookItem}
              keyExtractor={(item) =>
                item?.id?.toString() || Math.random().toString()
              }
              contentContainerStyle={styles.bookList}
              numColumns={2}
              onScroll={onScroll}
              scrollEventThrottle={200}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          )}

          <Modal
            transparent={true}
            visible={dropdownVisible}
            onRequestClose={() => dispatch(setDropdownVisible(false))}
          >
            <TouchableWithoutFeedback
              onPress={() => dispatch(setDropdownVisible(false))}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.dropdown}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleDeleteBook(selectedBook?.id)}
                  >
                    <Text style={styles.dropdownItemText}>Delete Book</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <Modal
            transparent={true}
            visible={noBooksModal}
            onRequestClose={() => dispatch(showNoBooksModal(false))}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>No books found</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => dispatch(showNoBooksModal(false))}
                >
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Snackbar
            visible={snackbarVisible}
            duration={3000}
            style={styles.snackbar}
            onDismiss={() => dispatch(setSnackbarVisible(false))}
          >
            {snackbarMessage}
          </Snackbar>

          <AnimatedFAB
            style={[styles.fab]}
            label="Add New Book"
            extended={isExtended}
            icon="plus"
            onPress={handleAddVisitor}
            animateFrom="right"
            iconMode="dynamic"
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  searchButton: {
    backgroundColor: "#32a244",
    padding: 8,
    borderRadius: 8,
  },
  sortFilterContainer: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  sortContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  bookList: {
    paddingBottom: 80,
  },
  bookItem: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },
  bookCover: {
    width: "100%",
    aspectRatio: 0.7,
  },
  bookInfoContainer: {
    padding: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  bookCount: {
    fontSize: 12,
    color: "#32a244",
  },
  tagContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#32a244",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    width: "80%",
    elevation: 5,
  },
  dropdownItem: {
    padding: 15,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#32a244",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#32a244",
  },
  snackbar: {
    backgroundColor: "#333",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 18,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#32a244",
    padding: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookManagementScreen;
