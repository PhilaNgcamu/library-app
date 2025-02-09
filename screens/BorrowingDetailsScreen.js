import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
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

  return (
    <TouchableOpacity onPress={onPress} style={styles.bookOption}>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookAuthor}>{book.author}</Text>
        <Text style={styles.bookMember}>
          Borrowed by: {memberName} {memberSurname}
        </Text>
      </View>
      <View style={styles.bookProgress}>
        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBar, { width: `${progressPercentage}%` }]}
          />
        </View>
        <Text style={styles.progressValue}>
          {remainingMonths} months {remainingDays % 30} days remaining
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const BorrowingDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const {
    memberName,
    memberSurname,
    borrowedDate,
    returnDate,
    bookItem,
    author,
    bookId,
  } = route.params;

  const borrowedDateObj = new Date(borrowedDate);
  const returnDateObj = new Date(returnDate);
  const currentDateObj = new Date();

  const borrowedDuration = Math.ceil(
    (returnDateObj - borrowedDateObj) / (1000 * 3600 * 24)
  );

  const remainingTimeMs = returnDateObj - currentDateObj;
  const remainingDays = Math.ceil(remainingTimeMs / (1000 * 3600 * 24));
  const progressPercentage =
    ((borrowedDuration - remainingDays) / borrowedDuration) * 100;

  const handlePlaceHold = async () => {
    try {
      // Add your API call here to place a hold
      // For example:
      // await placeHold(bookId, currentUserId);
      alert(
        "Hold placed successfully! You will be notified when the book becomes available."
      );
    } catch (error) {
      alert("Failed to place hold. Please try again.");
      console.error("Error placing hold:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <AntDesign name="user" size={width * 0.15} color="#666" />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Member:</Text>
          <Text style={styles.value}>
            {memberName} {memberSurname}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Book:</Text>
          <Text style={styles.value}>{bookItem}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Author:</Text>
          <Text style={styles.value}>{author}</Text>
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
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>{borrowedDuration} days</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBar, { width: `${progressPercentage}%` }]}
          />
        </View>
        <TouchableOpacity
          style={styles.placeHoldButton}
          onPress={handlePlaceHold}
        >
          <Text style={styles.placeHoldButtonText}>Place Hold</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: width * 0.05,
    backgroundColor: "#fff",
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.03,
    height: width * 0.35,
    width: width * 0.35,
    borderRadius: width * 0.175,
    backgroundColor: "#f0f0f0",
    alignSelf: "center",
    marginBottom: height * 0.05,
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    width: "40%",
    color: "#333",
  },
  value: {
    fontSize: width * 0.04,
    width: "60%",
    color: "#666",
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#32a244",
  },
  bookOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 10,
  },
  bookInfo: {
    flex: 1,
    marginRight: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
  },
  bookMember: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  bookProgress: {
    width: "40%",
    alignItems: "flex-end",
  },
  progressValue: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    textAlign: "right",
  },
  placeHoldButton: {
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  placeHoldButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BorrowingDetailsScreen;
