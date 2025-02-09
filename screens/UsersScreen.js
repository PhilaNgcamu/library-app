import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ref, onValue } from "firebase/database";
import { database } from "../services/firebase/config";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const UsersScreen = () => {
  const [usersWithBooks, setUsersWithBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    let unsubscribe;
    try {
      const borrowedBooksRef = ref(database, "borrowedBooks");
      unsubscribe = onValue(
        borrowedBooksRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const borrowedBooksArray = Object.values(data);
            setUsersWithBooks(borrowedBooksArray);
          } else {
            setUsersWithBooks([]);
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("Firebase error:", error);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Setup error:", error);
      setIsLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const formatUserName = (user) => {
    if (!user.memberName && !user.memberSurname) {
      return "Anonymous User";
    }
    return `${user.memberName || ""} ${user.memberSurname || ""}`.trim();
  };

  const handleViewBorrowingDetails = (user) => {
    navigation.navigate("Borrowing Details", {
      memberName: user.memberName || "Anonymous",
      memberSurname: user.memberSurname || "User",
      borrowedDate: user.borrowedDate,
      returnDate: user.returnDate,
      bookItem: user.book.title,
      author: user.book.author,
    });
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : usersWithBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="book-off-outline"
            size={80}
            color="gray"
          />
          <Text style={styles.emptyText}>No borrowed books at the moment</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {usersWithBooks.map((user, index) => (
            <View key={index} style={styles.userContainer}>
              <TouchableOpacity
                style={styles.userDetails}
                onPress={() => handleViewBorrowingDetails(user)}
              >
                <Text
                  style={[
                    styles.userName,
                    !user.memberName &&
                      !user.memberSurname &&
                      styles.anonymousUser,
                  ]}
                >
                  {formatUserName(user)}
                </Text>
                <Text style={styles.bookTitle}>{user.book.title}</Text>
                <Text style={styles.bookAuthor}>by {user.book.author}</Text>
                <Text style={styles.dates}>
                  Borrowed: {user.borrowedDate} - Return: {user.returnDate}
                </Text>
              </TouchableOpacity>
              <AntDesign name="arrowright" size={24} color="gray" />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  scrollContainer: {
    flex: 1,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  bookTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  dates: {
    fontSize: 12,
    color: "#999",
  },
  iconContainer: {
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
    marginTop: 20,
  },
  anonymousUser: {
    color: "#888",
    fontStyle: "italic",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "gray",
    marginTop: 20,
  },
});

export default UsersScreen;
