import React, { useState } from "react";
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

const ViewBookScreen = ({ navigation, route }) => {
  const { bookId } = route.params;
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [available, setAvailable] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberSurname, setMemberSurname] = useState("");
  const book = useSelector((state) =>
    state.books.books.find((book) => book.id === bookId)
  );
  const [borrowedDate, setBorrowedDate] = useState(new Date(1598051730000));
  const [returnDate, setReturnDate] = useState(new Date(1598051730000));

  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const dispatch = useDispatch();

  const handleMemberNameChange = (name) => {
    setMemberName(name);
  };

  const handleMemberSurnameChange = (surname) => {
    setMemberSurname(surname);
  };

  const handleBorrow = () => {
    setIsBorrowing(true);
    setSnackbarVisible(true);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsBorrowing(false);
  };

  const handleSubmitForm = () => {
    const borrowedBookDetails = {
      memberName: memberName,
      memberSurname: memberSurname,
      book: book,
    };
    setBorrowedBooks([...borrowedBooks, borrowedBookDetails]);
    closeModal();
  };

  const handleBorrowedDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setBorrowedDate(currentDate);
  };

  const handleReturnDate = () => {
    const date = new Date();
    const returnDate = date.toLocaleDateString();
    setReturnDate(returnDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const navigateToBorrowingDetails = (borrowedBook) => {
    navigation.navigate("BorrowingDetails", borrowedBook);
  };

  return (
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
            style={styles.button}
            disabled={isBorrowing}
          >
            <ButtonText>{isBorrowing ? "Borrowing..." : "Borrow"}</ButtonText>
          </Button>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
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
              </View>
              <View>
                <Text style={styles.inputLabel}>Member's Surname:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Member's Surname"
                  value={memberSurname}
                  onChangeText={handleMemberSurnameChange}
                />
              </View>
              <View>
                <Text style={styles.inputLabel}>Borrowed Date:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Date"
                  value={borrowedDate}
                  onPress={handleBorrowedDate}
                />
              </View>
              <View>
                <Text style={styles.inputLabel}>Return Date:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Date"
                  onChangeText={handleReturnDate}
                />
              </View>
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
                style={{
                  padding: 10,
                  borderRadius: 5,
                  width: "40%",
                  borderWidth: 1,
                  marginLeft: 65,
                  borderColor: "#32a244",
                }}
              >
                <Text
                  style={{
                    color: "#32a244",
                    textAlign: "center",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Snackbar
        visible={snackbarVisible && !isModalVisible}
        style={{ backgroundColor: "#32a244", zIndex: 1000 }}
        icon="check-circle"
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
      {borrowedBooks.length > 0 && (
        <View style={styles.borrowedInfoContainer}>
          <Text style={styles.borrowedInfoTitle}>Current Users</Text>
          {borrowedBooks.map((borrowedBook, index) => (
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
        </View>
      )}
    </ScrollView>
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
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
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    marginRight: 130,
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
});

export default ViewBookScreen;
