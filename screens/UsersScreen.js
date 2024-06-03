import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ref, onValue } from "firebase/database";
import { database } from "../backend/firestoreConfig";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const UsersScreen = () => {
  const [usersWithBooks, setUsersWithBooks] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const borrowedBooksRef = ref(database, "borrowedBooks");
    onValue(borrowedBooksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const borrowedBooksArray = Object.values(data);
        setUsersWithBooks(borrowedBooksArray);
      }
    });
  }, []);

  const handleViewBorrowingDetails = (user) => {
    navigation.navigate("Borrowing Details", {
      memberName: user.memberName,
      memberSurname: user.memberSurname,
      borrowedDate: user.borrowedDate,
      returnDate: user.returnDate,
      bookItem: user.book.title,
      author: user.book.author,
    });
  };

  return (
    <View style={styles.container}>
      {usersWithBooks.length === 0 ? (
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
                <Text style={styles.userName}>
                  {user.memberName} {user.memberSurname}
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
});

export default UsersScreen;
