import React, { useState } from "react";
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
import { Button, ButtonText } from "@gluestack-ui/themed";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { updateBookAvailability } from "../redux/actions";
import { database } from "../backend/firestoreConfig";

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

  const handleSubmitForm = () => {
    let valid = true;
    if (memberName.trim() === "") {
      setMemberNameError("Member name is required.");
      valid = false;
    } else {
      setMemberNameError("");
    }

    if (memberSurname.trim() === "") {
      setMemberSurnameError("Member surname is required.");
      valid = false;
    } else {
      setMemberSurnameError("");
    }

    if (!borrowedDate) {
      setBorrowedDateError("Borrowed date is required.");
      valid = false;
    } else {
      setBorrowedDateError("");
    }

    if (!returnDate) {
      setReturnDateError("Return date is required.");
      valid = false;
    } else {
      setReturnDateError("");
    }

    if (!valid) return;

    const borrowedBookDetails = {
      memberName: memberName,
      memberSurname: memberSurname,
      book: book,
      borrowedDate: borrowedDate.toISOString().slice(0, 10),
      returnDate: returnDate.toISOString().slice(0, 10),
    };
    console.log(JSON.stringify(borrowedBookDetails, null, 2));
    setBorrowedBooks([...borrowedBooks, borrowedBookDetails]);
    setSnackbarVisible(true);
    const newCount = book.count - 1;
    dispatch(updateBookAvailability(book.id, newCount));

    const borrowedBooksRef = ref(database, "borrowedBooks");
    push(borrowedBooksRef, borrowedBookDetails);
    closeModal();
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

  return (
    <View>
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
          <View style={styles.buttonsContainer}>
            <Button
              bgColor="#32a244"
              onPress={handleBorrow}
              style={[styles.button, !available && styles.disabledButton]}
              disabled={isBorrowing || !available}
            >
              <ButtonText style={!available && styles.disabledText}>
                {isBorrowing ? "Borrowing..." : "Borrow"}
              </ButtonText>
            </Button>
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isScanModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Borrow Book</Text>
              <Text style={styles.modalMessage}>
                Enter Member Details to Borrow:
              </Text>
              <View style={styles.inputContainer}>
                <View>
                  <Text style={styles.inputLabel}>Member's Name:</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter Member's Name"
                    value={memberName}
                    onChangeText={handleMemberNameChange}
                  />
                  {memberNameError ? (
                    <Text style={styles.errorText}>{memberNameError}</Text>
                  ) : null}
                </View>
                <View>
                  <Text style={styles.inputLabel}>Member's Surname:</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter Member's Surname"
                    value={memberSurname}
                    onChangeText={handleMemberSurnameChange}
                  />
                  {memberSurnameError ? (
                    <Text style={styles.errorText}>{memberSurnameError}</Text>
                  ) : null}
                </View>
                <View>
                  <Text style={styles.inputLabel}>Borrowed Date:</Text>
                  <TouchableOpacity
                    onPress={() => setShowBorrowedDatePicker(true)}
                  >
                    <TextInput
                      style={styles.textInput}
                      placeholder="Select Date"
                      value={borrowedDate.toLocaleDateString()}
                      editable={false}
                    />
                  </TouchableOpacity>
                  {borrowedDateError ? (
                    <Text style={styles.errorText}>{borrowedDateError}</Text>
                  ) : null}
                </View>
                <View>
                  <Text style={styles.inputLabel}>Return Date:</Text>
                  <TouchableOpacity
                    onPress={() => setShowReturnDatePicker(true)}
                  >
                    <TextInput
                      style={styles.textInput}
                      placeholder="Select Date"
                      value={returnDate.toLocaleDateString()}
                      editable={false}
                    />
                  </TouchableOpacity>
                  {returnDateError ? (
                    <Text style={styles.errorText}>{returnDateError}</Text>
                  ) : null}
                </View>
                {showBorrowedDatePicker && (
                  <DateTimePicker
                    value={borrowedDate}
                    mode="date"
                    display="spinner"
                    onChange={handleBorrowedDateChange}
                  />
                )}
                {showReturnDatePicker && (
                  <DateTimePicker
                    value={returnDate}
                    mode="date"
                    display="spinner"
                    onChange={handleReturnDateChange}
                  />
                )}
              </View>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  onPress={handleSubmitForm}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
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
        visible={snackbarVisible && !isScanModalVisible}
        style={styles.snackbar}
        onDismiss={() => {
          setIsBorrowing(false);
          setSnackbarVisible(false);
        }}
        duration={2000}
        action={{
          textColor: "white",
        }}
      >
        Book borrowed successfully!
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f7f7f7",
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
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    width: "30%",
  },
  text: {
    fontSize: 16,
    width: "70%",
    marginTop: 2,
    color: "#777",
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
  },
  disabledButton: {
    marginHorizontal: 10,
    opacity: 0.5,
  },
  disabledText: {
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "#32a244",
    padding: 10,
    borderRadius: 5,
    width: "40%",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    width: "40%",
    borderWidth: 1,
    borderColor: "#32a244",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#32a244",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "column",
    width: "100%",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  errorText: {
    color: "red",
    fontSize: 14,
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
    left: 0,
    right: 0,
    backgroundColor: "#32a244",
  },
});

export default ViewBookScreen;
