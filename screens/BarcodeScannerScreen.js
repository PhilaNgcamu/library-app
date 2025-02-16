import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Modal,
  Button,
  TouchableOpacity,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  searchBook,
  setScanned,
  resetScanned,
  setHasPermission,
  incrementCameraKey,
  isScanModalVisible,
  setSnackbarMessage,
  setSnackbarVisible,
  fetchBooks,
} from "../redux/actions";
import { ref, push, set } from "firebase/database";
import { database, auth } from "../services/firebase/config";
import { Snackbar } from "react-native-paper";
import { useAuth } from "../contexts/AuthContext";

const { width } = Dimensions.get("window");

const QRCodeScannerScreen = () => {
  const { userRole } = useAuth();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const scanned = useSelector((state) => state.books.scanned);
  const hasPermission = useSelector((state) => state.books.hasPermission);
  const modalVisible = useSelector((state) => state.books.modalVisible);
  const storedIsbns = useSelector((state) => state.books.storedIsbns);
  const books = useSelector((state) => state.books.books);

  const snackbarMessage = useSelector((state) => state.books.snackbarMessage);
  const snackbarVisible = useSelector((state) => state.books.snackbarVisible);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      dispatch(setHasPermission(status === "granted"));
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(resetScanned());
      dispatch(incrementCameraKey());
      return () => {};
    }, [dispatch])
  );

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || isLoading) return;
    try {
      setIsLoading(true);
      dispatch(setScanned());
      console.log("Scanned data:", data);

      const isbn = extractISBN(data);
      if (!isbn) {
        dispatch(setSnackbarMessage("No valid ISBN found in the barcode"));
        dispatch(setSnackbarVisible(true));
        handleScanAgain();
        return;
      }

      console.log("ISBN:", isbn);

      // First search for the book
      const bookId = dispatch(searchBook(isbn));

      // Wait for the books to be fetched
      dispatch(fetchBooks());

      // Now we can safely get the book data
      const bookData = books.find((b) => b.id === isbn);

      // Log the scan to Firebase
      const scanRef = push(ref(database, "books"));
      await set(scanRef, {
        isbn: isbn,
        title: bookData?.title || "Unknown Title",
        author: bookData?.authors?.[0] || "Unknown Author",
        scannedBy: auth.currentUser?.uid || "anonymous",
        scannedAt: new Date().toISOString(),
        scanType: type,
        status: "available", // Adding a status field
        studentData: null, // Initialize student data as null
        scanLocation: "library", // You can make this configurable if needed
      });

      if (bookId) {
        dispatch(isScanModalVisible());
      } else {
        dispatch(setSnackbarMessage("Book not found in Google Books"));
        dispatch(setSnackbarVisible(true));
        handleScanAgain();
      }
    } catch (error) {
      console.error("Error processing scan:", error);
      dispatch(setSnackbarMessage("Error processing scan. Please try again."));
      dispatch(setSnackbarVisible(true));
      handleScanAgain();
    } finally {
      setIsLoading(false);
    }
  };

  const extractISBN = (qrCodeData) => {
    const regex = /\b\d{10,13}\b/;
    const match = qrCodeData.match(regex);
    return match ? match[0] : null;
  };

  const handleScanAgain = () => {
    dispatch(isScanModalVisible());
    dispatch(resetScanned());
  };

  const handleViewBook = () => {
    const latestIsbn = storedIsbns[storedIsbns.length - 1];
    const book = books.find((b) => b.id === latestIsbn);

    if (!book) {
      dispatch(
        setSnackbarMessage("Book data not found. Please try scanning again.")
      );
      dispatch(setSnackbarVisible(true));
      return;
    }

    dispatch(isScanModalVisible());
    navigation.navigate("Book Details", {
      bookId: latestIsbn,
    });
  };

  if (hasPermission === null) {
    return (
      <ActivityIndicator
        size="large"
        color="#32a244"
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      />
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.noPermissionContainer}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={"back"}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer}></View>
          <View style={styles.middleContainer}>
            <View style={styles.unfocusedContainer}></View>
            <View style={styles.focusedContainer}></View>
            <View style={styles.unfocusedContainer}></View>
          </View>
          <View style={styles.unfocusedContainer}></View>
        </View>
      </CameraView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => dispatch(isScanModalVisible())}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Book Scanned</Text>
            <Text style={styles.modalText}>
              The book has been successfully scanned. Do you want to view the
              book details?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={handleScanAgain}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Scan Again
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleViewBook}
              >
                <Text style={styles.buttonText}>View Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => dispatch(setSnackbarVisible(false))}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  middleContainer: {
    flexDirection: "row",
    height: width * 0.65,
  },
  focusedContainer: {
    width: width * 0.65,
    height: width * 0.65,
    borderWidth: 2,
    borderColor: "#32a244",
    backgroundColor: "transparent",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
    backgroundColor: "#32a244",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#32a244",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#32a244",
  },
  noPermissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  noPermissionText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginHorizontal: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  scannerFrame: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: width * 0.7,
    height: width * 0.7,
    transform: [
      { translateX: -(width * 0.7) / 2 },
      { translateY: -(width * 0.7) / 2 },
    ],
    borderWidth: 2,
    borderColor: "#32a244",
    borderRadius: 10,
  },
  scannerLine: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 2,
    backgroundColor: "#32a244",
  },
});

export default QRCodeScannerScreen;
