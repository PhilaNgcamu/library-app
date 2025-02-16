import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import {
  registerForPushNotificationsAsync,
  scheduleBookReminder,
} from "../services/notifications";

const { width, height } = Dimensions.get("window");

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

  const [isLoading, setIsLoading] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // Listen for incoming notifications while app is running
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // Handle received notification
        console.log("Notification received:", notification);
      });

    // Listen for user interaction with notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // Handle user response to notification
        console.log("User interacted with notification:", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const handleBorrow = async () => {
    try {
      setIsLoading(true);

      // Schedule reminders
      const notificationId = await scheduleBookReminder(bookItem, returnDate);

      // Store the notification ID in Firebase for future reference
      const borrowRecord = {
        bookId,
        memberName,
        memberSurname,
        borrowedDate,
        returnDate,
        notificationId,
        expoPushToken,
      };

      // Add to Firebase
      const borrowRef = ref(database, "borrowedBooks");
      await push(borrowRef, borrowRecord);

      // Update Redux store
      dispatch({
        type: actionTypes.BORROW_BOOK,
        payload: borrowRecord,
      });

      Alert.alert(
        "Success",
        "Book borrowed successfully! You will receive reminders before the due date.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to process the borrowing request.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceHold = async () => {
    try {
      setIsLoading(true);

      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please enable notifications to receive reminders"
        );
        return;
      }

      // Schedule a notification for 5 seconds later
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Book Return Reminder",
          body: `Your book "${bookItem}" by ${author} is due on ${new Date(
            returnDate
          ).toLocaleDateString()}`,
          data: { bookId, returnDate },
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Notification error:", error);
      Alert.alert("Error", "Failed to send test notification");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileIconContainer}>
          <AntDesign name="user" size={width * 0.15} color="#32a244" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {memberName} {memberSurname}
          </Text>
          <Text style={styles.borrowStatus}>Currently Borrowing</Text>
        </View>
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
        <View style={styles.progressContainer}>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, { width: `${progressPercentage}%` }]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>
              {Math.round(progressPercentage)}% Complete
            </Text>
            <Text
              style={[
                styles.progressDays,
                { color: remainingDays < 7 ? "#ff6b6b" : "#666" },
              ]}
            >
              {remainingDays} days remaining
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.placeHoldButton, isLoading && styles.disabledButton]}
          onPress={handlePlaceHold}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeHoldButtonText}>Place Hold</Text>
          )}
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileIconContainer: {
    backgroundColor: "#f0f8f1",
    borderRadius: width * 0.1,
    padding: 15,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  borrowStatus: {
    fontSize: width * 0.035,
    color: "#32a244",
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  progressContainer: {
    marginTop: 15,
    marginBottom: 25,
  },
  progressBarContainer: {
    width: "100%",
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#32a244",
    borderRadius: 6,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  progressText: {
    fontSize: width * 0.035,
    color: "#32a244",
    fontWeight: "500",
  },
  progressDays: {
    fontSize: width * 0.035,
    fontWeight: "500",
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
    backgroundColor: "#32a244",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeHoldButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default BorrowingDetailsScreen;
