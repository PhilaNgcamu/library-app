import React, { useEffect, useMemo, useState, useRef } from "react";
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
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Button, ButtonText } from "@gluestack-ui/themed";
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

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(fetchBooks());
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
    return sortedBooks.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
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

  const renderBookItem = ({ item }) => {
    return (
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
  };

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  const fabStyle = { bottom: 16 };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search books..."
          value={searchQuery}
          onChangeText={(search) => {
            dispatch(searchQueryKeyword(search));
          }}
          onSubmitEditing={handleSearch}
        />
        <Button
          style={{
            backgroundColor: "#32a244",
            textAlign: "center",
          }}
          onPress={handleSearch}
        >
          <AntDesign name="search1" size={24} color="white" />
        </Button>
      </View>

      <View style={styles.sortFilterContainer}>
        <View style={styles.sortContainer}>
          <Picker
            selectedValue={sortBy}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue) => handleSort(itemValue)}
          >
            <Picker.Item label="Sort By Title" value="title" />
            <Picker.Item label="Sort By Author" value="author" />
            <Picker.Item label="Sort By Count" value="count" />
            <Picker.Item label="Sort By Date" value="date" />
          </Picker>
        </View>
        <View style={styles.filterContainer}>
          <Picker
            selectedValue={filterBy}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue) => handleFilter(itemValue)}
          >
            <Picker.Item label="Show All Books" value="all" />
            <Picker.Item label="Filter By Availability" value="availability" />
          </Picker>
        </View>
      </View>

      {books.length === 0 ||
      searchedBooks.length === 0 ||
      allBooksUnavailable ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={searchedBooks}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.bookList}
          extraData={books}
          onScroll={onScroll}
        />
      )}

      <Modal
        animationType="slide"
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
                onPress={() => {
                  handleViewDetails(selectedBook.id);
                  dispatch(setDropdownVisible(false));
                }}
              >
                <Text style={styles.dropdownItemText}>View Details</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  handleDeleteBook(selectedBook.id);
                  dispatch(setDropdownVisible(false));
                }}
              >
                <Text style={(styles.dropdownItemText, { color: "red" })}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={noBooksModal}
        onRequestClose={() => dispatch(showNoBooksModal())}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Oops!
            </Text>
            <Text style={styles.modalText}>No books found</Text>
            <Button
              style={styles.modalButton}
              onPress={() => dispatch(showNoBooksModal())}
            >
              <ButtonText>Search Again</ButtonText>
            </Button>
          </View>
        </View>
      </Modal>

      <Snackbar
        visible={snackbarVisible}
        style={{ backgroundColor: "#32a244", zIndex: 1 }}
        onDismiss={() => dispatch(setSnackbarVisible(false))}
        duration={2000}
        action={{
          textColor: "white",
          onPress: () => dispatch(setSnackbarVisible(false)),
        }}
      >
        {snackbarMessage}
      </Snackbar>
      <AnimatedFAB
        style={[styles.fab, fabStyle]}
        label="Add New Book"
        extended={isExtended}
        icon="plus"
        onPress={handleAddVisitor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  bookCover: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    marginRight: 10,
  },
  sortFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sortContainer: {
    flex: 1,
    marginRight: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  filterContainer: {
    flex: 1,
    marginLeft: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  bookList: {
    paddingBottom: 20,
  },
  bookItem: {
    flex: 1,
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  tagContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#32a244",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  tagText: {
    color: "white",
    fontSize: 12,
  },
  bookInfoContainer: {
    padding: 10,
  },
  bookTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  bookAuthor: {
    color: "#666",
    marginBottom: 5,
  },
  bookCount: {
    color: "#666",
    fontSize: 14,
    fontWeight: "bold",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    width: 200,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#32a244",
    padding: 10,
    borderRadius: 5,
  },
  fab: {
    position: "absolute",
    backgroundColor: "#32a244",
    right: 16,
  },
});

export default BookManagementScreen;
