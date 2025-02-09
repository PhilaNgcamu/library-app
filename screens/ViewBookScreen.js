import React, { useState, useEffect } from "react";
import { ref, push } from "firebase/database";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  TextInput,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  updateBookAvailability,
  setSnackbarVisible,
  setSnackbarMessage,
  borrowBook,
} from "../redux/actions";
import { database } from "../services/firebase/config";

const ViewBookScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { bookId } = route.params;
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [isScanModalVisible, setisScanModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberSurname, setMemberSurname] = useState("");
  const [memberNameError, setMemberNameError] = useState("");
  const [memberSurnameError, setMemberSurnameError] = useState("");
  const [borrowedDateError, setBorrowedDateError] = useState("");
  const [returnDateError, setReturnDateError] = useState("");
  const book = useSelector((state) =>
    state.books.books.find((book) => book.id === bookId)
  );
  const [borrowedDate, setBorrowedDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showBorrowedDatePicker, setShowBorrowedDatePicker] = useState(false);
  const [showReturnDatePicker, setShowReturnDatePicker] = useState(false);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [showMoreUsers, setShowMoreUsers] = useState(false);
  const snackbarMessage = useSelector((state) => state.books.snackbarMessage);

  useEffect(() => {
    if (!book) {
      dispatch(setSnackbarMessage("Book not found"));
      dispatch(setSnackbarVisible(true));
      navigation.goBack();
    }
  }, [book, bookId]);

  if (!book) {
    return null;
  }

  const available = book.count > 0;

  const handleSeeMoreUsers = () => {
    setShowMoreUsers(true);
  };

  const handleMemberNameChange = (name) => {
    setMemberName(name);
  };

  const handleMemberSurnameChange = (surname) => {
    setMemberSurname(surname);
  };

  const handleBorrow = () => {
    setIsBorrowing(true);
    setisScanModalVisible(true);
  };

  const closeModal = () => {
    setisScanModalVisible(false);
    setIsBorrowing(false);
    setMemberNameError("");
    setMemberSurnameError("");
    setBorrowedDateError("");
    setReturnDateError("");
  };

  const calculateReturnDate = () => {
    const borrowDate = new Date();
    const returnDate = new Date(borrowDate);
    returnDate.setDate(borrowDate.getDate() + 28); // 4 weeks
    return returnDate;
  };

  const handleSubmitForm = () => {
    // Add validation for dates
    if (!memberName.trim() || !memberSurname.trim()) {
      if (!memberName.trim()) setMemberNameError("Member name is required");
      if (!memberSurname.trim())
        setMemberSurnameError("Member surname is required");
      return;
    }

    // Clear any previous errors
    setMemberNameError("");
    setMemberSurnameError("");
    setBorrowedDateError("");
    setReturnDateError("");

    try {
      const borrowedBook = {
        book: {
          id: book.id,
          title: book.title,
          author: book.author,
          coverUrl: book.coverUrl, // Add coverUrl for display
        },
        memberName: memberName.trim(),
        memberSurname: memberSurname.trim(),
        borrowedDate: new Date().toISOString(),
        returnDate: calculateReturnDate().toISOString(),
      };

      dispatch(borrowBook(borrowedBook)).then((result) => {
        if (result.success) {
          setSnackbarVisible(true);
          closeModal();
          navigation.goBack();
        } else {
          setSnackbarVisible(true);
        }
      });
    } catch (error) {
      console.error("Error borrowing book:", error);
      setSnackbarVisible(true);
    }
  };

  const handleBorrowedDateChange = (event, selectedDate) => {
    if (selectedDate !== undefined) {
      setBorrowedDate(selectedDate);
    }
    setShowBorrowedDatePicker(false);
  };

  const handleReturnDateChange = (event, selectedDate) => {
    if (selectedDate !== undefined) {
      setReturnDate(selectedDate);
    }
    setShowReturnDatePicker(false);
  };

  const navigateToBorrowingDetails = (borrowedBook) => {
    navigation.navigate("Borrowing Details", {
      memberName: borrowedBook.memberName,
      memberSurname: borrowedBook.memberSurname,
      bookItem: book.title,
      author: book.author,
      borrowedDate: borrowedBook.borrowedDate.toISOString(),
      returnDate: borrowedBook.returnDate.toISOString(),
      bookId: book.id,
      coverUrl: book.coverUrl,
    });
  };

  const onDismissSnackbar = () => {
    dispatch(setSnackbarVisible(false));
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.coverContainer}>
          <Image source={{ uri: book.coverUrl }} style={styles.cover} />
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Title:</Text>
            <Text style={styles.text}>{book.title}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Author:</Text>
            <Text style={styles.text}>{book.author}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Genre:</Text>
            <Text style={styles.text}>{book.genre}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Description:</Text>
            <View
              style={[
                styles.descriptionContainer,
                { maxWidth: Dimensions.get("window").width * 0.7 },
              ]}
            >
              <TouchableOpacity
                onPress={() => setShowFullDescription(!showFullDescription)}
              >
                <Text style={styles.description}>
                  {showFullDescription
                    ? book.description
                    : `${book.description.substring(0, 100)}... See more`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Page Count:</Text>
            <Text style={styles.text}>{book.pageCount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Published Date:</Text>
            <Text style={styles.text}>{book.publishedDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Language:</Text>
            <Text style={styles.text}>{book.language}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Availability:</Text>
            <Text style={[styles.text, { color: available ? "green" : "red" }]}>
              {available ? "Available" : "Not Available"}
            </Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, !available && styles.disabledButton]}
            onPress={handleBorrow}
            disabled={!available}
          >
            <Text
              style={[styles.buttonText, !available && styles.disabledText]}
            >
              {available ? "Borrow Book" : "Not Available"}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isBorrowing}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Borrow Book</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Member Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={memberName}
                  onChangeText={handleMemberNameChange}
                  placeholder="Enter member name"
                />
                {memberNameError ? (
                  <Text style={styles.errorText}>{memberNameError}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Member Surname</Text>
                <TextInput
                  style={styles.textInput}
                  value={memberSurname}
                  onChangeText={handleMemberSurnameChange}
                  placeholder="Enter member surname"
                />
                {memberSurnameError ? (
                  <Text style={styles.errorText}>{memberSurnameError}</Text>
                ) : null}
              </View>

              <View style={styles.dateInfoContainer}>
                <Text style={styles.dateInfoText}>
                  Borrow Date: {new Date().toLocaleDateString()}
                </Text>
                <Text style={styles.dateInfoText}>
                  Return Date: {calculateReturnDate().toLocaleDateString()}
                </Text>
                <Text style={styles.dateInfoNote}>
                  Books must be returned within 4 weeks
                </Text>
              </View>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={closeModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleSubmitForm}
                >
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {borrowedBooks.length > 0 && (
          <View style={styles.borrowedInfoContainer}>
            <Text style={styles.borrowedInfoTitle}>Current Users</Text>
            {borrowedBooks
              .slice(0, showMoreUsers ? borrowedBooks.length : 3)
              .map((borrowedBook, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigateToBorrowingDetails(borrowedBook)}
                >
                  <View style={styles.borrowedInfoItem}>
                    <Text style={styles.borrowedInfoLabel}>Member Name:</Text>
                    <Text style={styles.borrowedInfoText}>
                      {borrowedBook.memberName} {borrowedBook.memberSurname}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            {!showMoreUsers && borrowedBooks.length > 3 && (
              <TouchableOpacity onPress={handleSeeMoreUsers}>
                <Text style={styles.seeMoreButton}>See more</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={onDismissSnackbar}
        duration={3000}
        style={styles.snackbar}
        action={{
          label: "Close",
          onPress: onDismissSnackbar,
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  coverContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  cover: {
    width: 200,
    height: 300,
    borderRadius: 10,
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
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    width: "30%",
    color: "#333",
  },
  text: {
    fontSize: 16,
    width: "70%",
    color: "#666",
  },
  buttonsContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: "#32a244",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    opacity: 0.7,
  },
  disabledText: {
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    width: "90%",
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
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#32a244",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
  descriptionContainer: {
    width: "70%",
    textAlign: "left",
  },
  description: {
    fontSize: 16,
    textAlign: "justify",
    marginTop: 2,
  },
  borrowedInfoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  borrowedInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  borrowedInfoItem: {
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  borrowedInfoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  borrowedInfoText: {
    fontSize: 16,
    color: "#333",
  },
  seeMoreButton: {
    color: "#32a244",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 10,
  },
  snackbar: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#333",
  },
  dateInfoContainer: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginVertical: 15,
  },
  dateInfoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  dateInfoNote: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginTop: 5,
  },
});

export default ViewBookScreen;
