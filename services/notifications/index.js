import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure notifications behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotificationsAsync = async () => {
  let token;

  // Check if we're running on a device (not simulator)
  if (Platform.OS !== "web") {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If no existing permission, ask for permission
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // If no permission granted, return null
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return null;
    }

    // Get the token
    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  return token;
};

export const scheduleBookReminder = async (
  bookTitle,
  returnDate,
  daysBeforeDue = 3
) => {
  try {
    const dueDate = new Date(returnDate);
    const reminderDate = new Date(returnDate);
    reminderDate.setDate(dueDate.getDate() - daysBeforeDue);

    // Schedule the reminder notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Book Return Reminder",
        body: `Your book "${bookTitle}" is due in ${daysBeforeDue} days. Please return it to the MBC Library.`,
        data: { bookTitle, dueDate: returnDate },
      },
      trigger: {
        date: reminderDate,
      },
    });

    return notificationId;
  } catch (error) {
    console.error("Error scheduling reminder:", error);
    throw error;
  }
};

export const cancelBookReminder = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("Error canceling reminder:", error);
  }
};
