import React from "react";
import { View, Text, StyleSheet } from "react-native";

const BorrowingDetailsScreen = ({ route }) => {
  const { memberName, memberSurname, borrowedDate, returnDate } = route.params;

  // Calculate the duration of borrowing in days
  const borrowedDateObj = new Date(borrowedDate);
  const returnDateObj = new Date(returnDate);
  const borrowedDuration = Math.ceil(
    (returnDateObj - borrowedDateObj) / (1000 * 3600 * 24)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Borrowing Details</Text>
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
          <Text style={styles.value}>{borrowedDuration} days</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  infoContainer: {
    width: "100%",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
});

export default BorrowingDetailsScreen;
