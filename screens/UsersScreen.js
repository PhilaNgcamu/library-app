import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ref, onValue } from "firebase/database";
import { database } from "../services/firebase/config";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

const UsersScreen = () => {
  const [usersWithBooks, setUsersWithBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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
          setError("Failed to load borrowed books. Please try again.");
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Setup error:", error);
      setError("An unexpected error occurred. Please try again.");
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#32a244" />
        <Text style={styles.loadingText}>Loading borrowed books...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={80}
          color="#ff6b6b"
        />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setIsLoading(true);
            setError(null);
            // Implement a retry mechanism here
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {usersWithBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={80}
            color="#32a244"
          />
          <Text style={styles.emptyText}>No borrowed books at the moment</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {usersWithBooks.map((user, index) => (
            <TouchableOpacity
              key={index}
              style={styles.userContainer}
              onPress={() => handleViewBorrowingDetails(user)}
            >
              <View style={styles.userDetails}>
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
              </View>
              <AntDesign name="right" size={24} color="#32a244" />
            </TouchableOpacity>
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

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#333",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  errorText: {
    fontSize: 18,
    color: "#ff6b6b",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 30,
  },
  retryButton: {
    backgroundColor: "#32a244",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
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
    color: "#32a244",
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  dates: {
    fontSize: 12,
    color: "#999",
  },
  anonymousUser: {
    color: "#888",
    fontStyle: "italic",
  },
});

export default UsersScreen;
