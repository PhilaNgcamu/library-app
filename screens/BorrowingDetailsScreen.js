import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Progress, ProgressFilledTrack } from "@gluestack-ui/themed";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const BookOption = ({ book, memberName, memberSurname, onPress }) => {
  const borrowedDateObj = new Date(book.borrowedDate);
  const returnDateObj = new Date(book.returnDate);
  const currentDateObj = new Date();

  const borrowedDuration = Math.ceil(
    (returnDateObj - borrowedDateObj) / (1000 * 3600 * 24)
  );

  const remainingTimeMs = returnDateObj - currentDateObj;
  const remainingDays = Math.ceil(remainingTimeMs / (1000 * 3600 * 24));
  const remainingMonths = Math.floor(remainingDays / 30);

  const totalDurationDays = borrowedDuration;
  const progressPercentage =
    ((borrowedDuration - remainingDays) / totalDurationDays) * 100;

  const truncateTitle = (title) => {
    return title.length > 20 ? `${title.substring(0, 17)}...` : title;
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.bookOption}>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{truncateTitle(book.title)}</Text>
        <Text style={styles.bookAuthor}>{book.author}</Text>
        <Text style={styles.bookMember}>
          Borrowed by: {memberName} {memberSurname}
        </Text>
      </View>
      <View style={styles.bookProgress}>
        <Progress
          value={progressPercentage}
          w={150}
          size="sm"
          colorScheme="green"
        >
          <ProgressFilledTrack />
        </Progress>
        <Text style={styles.progressValue}>
          {remainingMonths} months {remainingDays % 30} days
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const BorrowingDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { memberName, memberSurname, borrowedDate, bookItem, author } =
    route.params;

  const borrowedDateObj = new Date(borrowedDate);
  const returnDateObj = new Date(borrowedDateObj);
  returnDateObj.setMonth(returnDateObj.getMonth() + 2);

  const currentBook = {
    id: 0,
    title: bookItem,
    author: author,
    borrowedDate: borrowedDateObj.toISOString(),
    returnDate: returnDateObj.toISOString(),
    coverUrl: "https://example.com/currentBook.jpg",
    available: true,
  };

  const options = [
    {
      id: 1,
      title: "Book Title 1",
      author: "Author 1",
      borrowedDate: borrowedDateObj.toISOString(),
      returnDate: returnDateObj.toISOString(),
      coverUrl: "https://example.com/book1.jpg",
      available: true,
    },
    {
      id: 2,
      title: "Book Title 2",
      author: "Author 2",
      borrowedDate: borrowedDateObj.toISOString(),
      returnDate: returnDateObj.toISOString(),
      coverUrl: "https://example.com/book2.jpg",
      available: true,
    },
    {
      id: 3,
      title: "Book Title 3",
      author: "Author 3",
      borrowedDate: borrowedDateObj.toISOString(),
      returnDate: returnDateObj.toISOString(),
      coverUrl: "https://example.com/book3.jpg",
      available: true,
    },
  ];

  const uniqueOptions = [
    currentBook,
    ...options.filter((option) => option.title !== bookItem),
  ];

  const handleViewBookDetails = (book) => {
    navigation.navigate("Borrowing Details", {
      memberName,
      memberSurname,
      borrowedDate: book.borrowedDate,
      returnDate: book.returnDate,
      bookItem: book.title,
      author: book.author,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <AntDesign name="user" size={100} color="black" />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Member Name:</Text>
          <Text style={styles.value}>
            {memberName} {memberSurname}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Current Book:</Text>
          <Text style={styles.value}>{bookItem}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Borrowed Date:</Text>
          <Text style={styles.value}>
            {borrowedDateObj.toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Return Date:</Text>
          <Text style={styles.value}>{returnDateObj.toLocaleDateString()}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Borrowed Duration:</Text>
          <Text style={styles.value}>
            {Math.ceil((returnDateObj - borrowedDateObj) / (1000 * 3600 * 24))}{" "}
            days
          </Text>
        </View>
        <Progress value={50} w={200} size="sm">
          <ProgressFilledTrack />
        </Progress>
      </View>

      <Text style={styles.optionsTitle}>Other Current Reads</Text>
      {uniqueOptions.map((option) => (
        <BookOption
          key={option.id}
          book={option}
          memberName={memberName}
          memberSurname={memberSurname}
          onPress={() => handleViewBookDetails(option)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  profileContainer: {
    justifyContent: "center",
    marginTop: 20,
    height: 150,
    width: 150,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    alignSelf: "center",
    overflow: "hidden",
    marginBottom: 30,
    alignItems: "center",
  },
  infoContainer: {
    marginBottom: 30,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    width: "40%",
  },
  value: {
    fontSize: 16,
    width: "60%",
  },
  optionsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bookOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
  },
  bookInfo: {},
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bookAuthor: {
    fontSize: 16,
  },
  bookMember: {
    fontSize: 14,
    color: "gray",
  },
  bookProgress: {
    alignItems: "flex-end",
  },
  progressValue: {
    marginTop: 5,
    fontSize: 14,
  },
  icon: {
    position: "absolute",
    left: "90%",
  },
});

export default BorrowingDetailsScreen;
