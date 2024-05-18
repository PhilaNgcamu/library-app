import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Progress, ProgressFilledTrack } from "@gluestack-ui/themed";
import { AntDesign } from "@expo/vector-icons";

const BorrowingDetailsScreen = ({ route }) => {
  const { memberName, memberSurname, borrowedDate, returnDate } = route.params;

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
          <Text style={styles.value}>{borrowedDuration} days</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Return in:</Text>
        <Progress
          value={progressPercentage}
          w={300}
          size="sm"
          colorScheme="green"
        >
          <ProgressFilledTrack />
        </Progress>
        <Text style={styles.progressValue}>
          {remainingMonths} months {remainingDays % 30} days
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  profileContainer: {
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
  progressContainer: {
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  progressValue: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default BorrowingDetailsScreen;
