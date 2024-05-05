import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions, // Import Dimensions from react-native
} from "react-native";
import { Button, ButtonText } from "@gluestack-ui/themed";
import { useDispatch, useSelector } from "react-redux";

const ViewBookScreen = ({ navigation, route }) => {
  const { bookId } = route.params;
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [available, setAvailable] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const book = useSelector((state) =>
    state.books.books.find((book) => book.id === bookId)
  );
  const dispatch = useDispatch();

  const handleBorrow = () => {
    setIsBorrowing(true);
    setTimeout(() => {
      setIsModalVisible(true);
      setIsBorrowing(false);
      setAvailable(false);
    }, 1500);
  };

  const handleScan = () => {
    console.log("Scanning the book:", bookId);
    setAvailable(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
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
          <Button bgColor="#32a244" onPress={handleScan} style={styles.button}>
            <ButtonText>Scan</ButtonText>
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
            <Text style={styles.modalTitle}>Success</Text>
            <Text style={styles.modalMessage}>
              You have borrowed {book.title}
            </Text>
            <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalButton: {
    backgroundColor: "#32a244",
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ViewBookScreen;
