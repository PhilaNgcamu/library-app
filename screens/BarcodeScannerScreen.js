import React, { useCallback, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Modal,
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
} from "../redux/actions";
import { Button, ButtonText } from "@gluestack-ui/themed";

const { width } = Dimensions.get("window");

const QRCodeScannerScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const scanned = useSelector((state) => state.books.scanned);
  const hasPermission = useSelector((state) => state.books.hasPermission);
  const modalVisible = useSelector((state) => state.books.modalVisible);

  const storedIsbns = useSelector((state) => state.books.storedIsbns);

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

  const handleBarCodeScanned = ({ data }) => {
    if (scanned) return;

    dispatch(setScanned());
    console.log(data);

    const isbn = extractISBN(data);
    console.log("ISBN:", isbn);

    dispatch(searchBook("0310337372"));
    dispatch(isScanModalVisible());
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
    dispatch(isScanModalVisible());
    navigation.navigate("Book Details", {
      bookId: storedIsbns[storedIsbns.length - 1],
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
              <Button style={styles.modalButton} onPress={handleScanAgain}>
                <ButtonText>Scan Again</ButtonText>
              </Button>
              <Button style={styles.modalButton} onPress={handleViewBook}>
                <ButtonText>View Book</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  middleContainer: {
    flexDirection: "row",
  },
  focusedContainer: {
    width: width * 0.65,
    height: width * 0.65,
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 10,
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
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#32a244",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  noPermissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default QRCodeScannerScreen;
