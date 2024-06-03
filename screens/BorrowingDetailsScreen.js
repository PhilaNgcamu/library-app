import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Progress, ProgressFilledTrack } from "@gluestack-ui/themed";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

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
          w={width * 0.4}
          size="sm"
          colorScheme="green"
        >
          <ProgressFilledTrack />
        </Progress>
        <Text style={styles.progressValue}>
          {remainingMonths} months {remainingDays % 30} days remaining
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

  const options = [];

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

  const borrowedDuration = Math.ceil(
    (returnDateObj - borrowedDateObj) / (1000 * 3600 * 24)
  );

  const remainingTimeMs = returnDateObj - new Date();
  const remainingDays = Math.ceil(remainingTimeMs / (1000 * 3600 * 24));
  const totalDurationDays = borrowedDuration;
  const progressPercentage =
    ((borrowedDuration - remainingDays) / totalDurationDays) * 100;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <AntDesign name="user" size={width * 0.25} color="black" />
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
        <Progress value={progressPercentage} w={width * 0.8} size="sm">
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
    paddingHorizontal: width * 0.05,
    backgroundColor: "#fff",
  },
  profileContainer: {
    justifyContent: "center",
    marginTop: height * 0.03,
    height: width * 0.35,
    width: width * 0.35,
    borderRadius: (width * 0.35) / 2,
    backgroundColor: "#f0f0f0",
    alignSelf: "center",
    overflow: "hidden",
    marginBottom: height * 0.05,
    alignItems: "center",
  },
  infoContainer: {
    marginBottom: height * 0.05,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    width: "40%",
  },
  value: {
    fontSize: width * 0.04,
    width: "60%",
  },
  optionsTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginBottom: height * 0.01,
  },
  bookOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.02,
    backgroundColor: "#f0f0f0",
    padding: height * 0.02,
    borderRadius: width * 0.02,
  },
  bookInfo: {
    width: "60%",
  },
  bookTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  bookAuthor: {
    fontSize: width * 0.04,
  },
  bookMember: {
    fontSize: width * 0.035,
    color: "gray",
  },
  bookProgress: {
    alignItems: "flex-end",
    width: "40%",
  },
  progressValue: {
    marginTop: height * 0.01,
    fontSize: width * 0.035,
  },
  icon: {
    position: "absolute",
    left: "90%",
  },
});

export default BorrowingDetailsScreen;
