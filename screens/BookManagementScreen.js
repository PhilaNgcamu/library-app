import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Snackbar } from "react-native-paper";

const BookManagementScreen = () => {
  const defaultSortBy = "title";
  const defaultFilterBy = "availability";

  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [filterBy, setFilterBy] = useState(defaultFilterBy);
  const [searchQuery, setSearchQuery] = useState("");

  const [showNoBooksModal, setShowNoBooksModal] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);
  const navigation = useNavigation();

  const [filteredBooks, setFilteredBooks] = useState([]);
  const [sortedBooks, setSortedBooks] = useState([]);

  useEffect(() => {
    handleSort(defaultSortBy);
    handleFilter(defaultFilterBy);
  }, []);

  const handleViewDetails = (bookId) => {
    navigation.navigate("Book Details", { bookId });
  };

  const handleSort = (sortBy) => {
    setSortBy(sortBy);
    const sorted = [...books].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "author") {
        return a.author.localeCompare(b.author);
      }
    });
    setSortedBooks(sorted);
  };

  const handleFilter = (filterBy) => {
    setFilterBy(filterBy);
    const filtered = books.filter((book) => {
      if (filterBy === "availability") {
        return book.title;
      }
    });
    setFilteredBooks(filtered);
  };

  const handleSearch = () => {
    const filtered = books.filter((book) => {
      return book.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
    });

    if (filtered.length === 0) {
      setShowNoBooksModal(true);
    } else {
      setFilteredBooks(filtered);
      setSortedBooks([]);
      setSnackbarVisible(true);
    }
  };

  const renderBookItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.bookItem}
        onPress={() => handleViewDetails(item.id)}
        activeOpacity={1}
      >
        <Image
          source={{ uri: item.coverUrl }}
          style={styles.bookCover}
          resizeMode="cover"
        />
        {item.available ? (
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
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyStateContainer}>
        <MaterialIcons name="library-books" size={100} color="black" />
        <Text style={styles.emptyStateText}>No books available</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search books..."
          value={searchQuery}
          onChangeText={setSearchQuery}
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
          </Picker>
        </View>
        <View style={styles.filterContainer}>
          <Picker
            selectedValue={filterBy}
            style={{ height: 50, width: 150 }}
            onValueChange={(itemValue) => handleFilter(itemValue)}
          >
            <Picker.Item label="Filter By Availability" value="availability" />
          </Picker>
        </View>
      </View>

      {books.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={sortedBooks.length > 0 ? sortedBooks : filteredBooks}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.bookList}
        />
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNoBooksModal}
        onRequestClose={() => setShowNoBooksModal(false)}
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
              onPress={() => setShowNoBooksModal(false)}
            >
              <ButtonText>Search Again</ButtonText>
            </Button>
          </View>
        </View>
      </Modal>
      <Snackbar
        visible={snackbarVisible}
        style={{ backgroundColor: "#32a244" }}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        action={{
          textColor: "white",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        Book found!
      </Snackbar>
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
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
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
    paddingBottom: 80,
  },
  bookItem: {
    flex: 1,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  bookCover: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
  },
  tagContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#32a244",
    textAlign: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
  },
  tagText: {
    flex: 1,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#32a244",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
});

export default BookManagementScreen;
