import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Button, ButtonText } from "@gluestack-ui/themed";

const BookManagementScreen = () => {
  const [sortBy, setSortBy] = useState(null);
  const [filterBy, setFilterBy] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const booksPerPage = 10; // Number of books to display per page

  const dispatch = useDispatch();
  const books = useSelector((state) => state.books.books);
  const navigation = useNavigation();

  const handleViewDetails = (bookId) => {
    navigation.navigate("Book Details", { bookId });
  };

  const handleSort = (sortBy) => {
    setSortBy(sortBy);
  };

  const handleFilter = (filterBy) => {
    setFilterBy(filterBy);
    // Perform filtering logic based on filterBy criteria
  };

  const handleSearch = () => {
    // Perform search logic based on searchQuery
  };

  const renderBookItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.bookItem}
        onPress={() => handleViewDetails(item.id)}
      >
        <Image
          source={{ uri: item.coverUrl }}
          style={styles.bookCover}
          resizeMode="cover"
        />
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
        <Text style={styles.emptyStateText}>No books available</Text>
        <Button onPress={() => navigation.navigate("Scan QR Code")}>
          <ButtonText>Add New Book</ButtonText>
        </Button>
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
          }}
          onPress={handleSearch}
        >
          <ButtonText>Search</ButtonText>
        </Button>
      </View>

      <View style={styles.sortContainer}>
        <Button
          style={{
            backgroundColor: "#32a244",
          }}
          onPress={() => handleSort("title")}
        >
          <ButtonText>Sort By Title</ButtonText>
        </Button>
        <Button
          style={{
            backgroundColor: "#32a244",
          }}
          onPress={() => handleSort("author")}
        >
          <ButtonText>Sort By Author</ButtonText>
        </Button>
      </View>

      {books.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={books.slice(0, pageNumber * booksPerPage)}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.bookList}
        />
      )}

      <Button onPress={() => navigation.navigate("Scan QR Code")}>
        <ButtonText>Scan QR Code</ButtonText>
      </Button>
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
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  bookList: {
    paddingBottom: 80,
  },
  bookItem: {
    flex: 1,
    margin: 5,
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
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default BookManagementScreen;
