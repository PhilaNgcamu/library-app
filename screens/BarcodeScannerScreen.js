import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
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
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const QRCodeScannerScreen = () => {
  const { userRole } = useAuth();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [scannedIsbn, setScannedIsbn] = useState(null);

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
  }, [dispatch]); // Added dispatch to dependencies

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

      setScannedIsbn(isbn);
      console.log("ISBN stored:", isbn);

      const result = await dispatch(searchBook(isbn));
      await dispatch(fetchBooks());

      if (!result) {
        dispatch(setSnackbarMessage("Book not found in Google Books"));
        dispatch(setSnackbarVisible(true));
        handleScanAgain();
        return;
      }

      dispatch(isScanModalVisible());
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
    console.log("Current books:", books);
    console.log("Looking for ISBN:", scannedIsbn);

    const bookData = books.find((b) => b.id === scannedIsbn);
    console.log("Found book:", bookData);

    if (!bookData) {
      dispatch(
        setSnackbarMessage("Book data not found. Please try scanning again.")
      );
      dispatch(setSnackbarVisible(true));
      return;
    }

    dispatch(isScanModalVisible());
    navigation.navigate("Book Details", {
      bookId: scannedIsbn,
      book: bookData,
    });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#32a244" />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.noPermissionContainer}>
        <MaterialIcons name="no-photography" size={80} color="#ff6b6b" />
        <Text style={styles.noPermissionText}>No access to camera</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => Camera.requestCameraPermissionsAsync()}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CameraView
        style={styles.camera}
        facing={"back"}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer}></View>
          <View style={styles.middleContainer}>
            <View style={styles.unfocusedContainer}></View>
            <View style={styles.focusedContainer}>
              <View style={styles.scannerFrame}>
                <View style={styles.scannerLine} />
              </View>
            </View>
            <View style={styles.unfocusedContainer}></View>
          </View>
          <View style={styles.unfocusedContainer}></View>
        </View>
        <View style={styles.scanInstructionContainer}>
          <Text style={styles.scanInstructionText}>
            Scan book barcode to add
          </Text>
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
            <Ionicons name="checkmark-circle" size={60} color="#32a244" />
            <Text style={styles.modalTitle}>Book Scanned Successfully</Text>
            <Text style={styles.modalText}>
              The book has been added to the database. What would you like to do
              next?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={handleScanAgain}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Scan Another
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleViewBook}
              >
                <Text style={styles.buttonText}>View Book Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => dispatch(setSnackbarVisible(false))}
        duration={3000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    backgroundColor: "#32a244",
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
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
  },
  scannerFrame: {
    ...StyleSheet.absoluteFillObject,
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
  scanInstructionContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  scanInstructionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
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
    marginTop: 20,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: "#32a244",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  snackbar: {
    backgroundColor: "#333",
  },
});

export default QRCodeScannerScreen;
