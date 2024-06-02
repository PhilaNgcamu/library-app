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
      <ScrollView style={styles.scrollContainer}>
        {usersWithBooks.map((user, index) => (
          <TouchableOpacity
            key={index}
            style={styles.userContainer}
            onPress={() => handleViewBorrowingDetails(user)}
          >
            <Text style={styles.userInfo}>
              Member: {user.memberName} {user.memberSurname}
            </Text>
            <Text style={styles.userInfo}>
              Book: {user.book.title} by {user.book.author}
            </Text>
            <Text style={styles.userInfo}>
              Borrowed Date: {user.borrowedDate}
            </Text>
            <Text style={styles.userInfo}>Return Date: {user.returnDate}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  },
  scrollContainer: {
    flex: 1,
  },
  userContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default UsersScreen;
