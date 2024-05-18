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

const BookOption = ({ title, author, borrowedDate, returnDate, onPress }) => {
  const borrowedDateObj = new Date(borrowedDate);
  const returnDateObj = new Date(returnDate);
  const borrowedDuration = Math.ceil(
    (returnDateObj - borrowedDateObj) / (1000 * 3600 * 24)
  );

  const returnDateMs = returnDateObj.getTime();
  const currentDateMs = new Date().getTime();
  const remainingTimeMs = returnDateMs - currentDateMs;
  const remainingDays = Math.ceil(remainingTimeMs / (1000 * 3600 * 24));
  const remainingMonths = Math.floor(remainingDays / 30);

  const totalDurationDays = 2 * 30;
  const progressPercentage =
    ((totalDurationDays - remainingDays) / totalDurationDays) * 100;

  return (
    <TouchableOpacity onPress={onPress} style={styles.bookOption}>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{title}</Text>
        <Text style={styles.bookAuthor}>{author}</Text>
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

const BorrowingDetailsScreen = ({ route, navigation }) => {
  const { memberName, memberSurname, borrowedDate, returnDate } = route.params;

  const options = [
    { title: "Book Title 1", author: "Author 1", borrowedDate, returnDate },
    { title: "Book Title 2", author: "Author 2", borrowedDate, returnDate },
    { title: "Book Title 3", author: "Author 3", borrowedDate, returnDate },
  ];

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
          <Text style={styles.label}>Borrowed Date:</Text>
          <Text style={styles.value}>{borrowedDate}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Return Date:</Text>
          <Text style={styles.value}>{returnDate}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Borrowed Duration:</Text>
          <Text style={styles.value}>days</Text>
        </View>
        <Progress value={50} w={200} size="sm">
          <ProgressFilledTrack />
        </Progress>
      </View>

      <Text style={styles.optionsTitle}>Other Current Reads</Text>
      {options.map((option, index) => (
        <BookOption
          key={index}
          title={option.title}
          author={option.author}
          borrowedDate={option.borrowedDate}
          returnDate={option.returnDate}
          onPress={() =>
            navigation.navigate("Borrowing Details", { ...option })
          }
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
  bookProgress: {
    alignItems: "flex-end",
  },
  progressValue: {
    marginTop: 5,
    fontSize: 14,
  },
});

export default BorrowingDetailsScreen;
