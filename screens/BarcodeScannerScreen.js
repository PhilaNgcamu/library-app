import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Camera } from "expo-camera";
import { useDispatch } from "react-redux";
import { searchBook } from "../redux/actions";

const QRCodeScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    console.log(data);

    // Extract ISBN from the scanned QR code
    const isbn = extractISBN(data);
    console.log("ISBN:", isbn);

    // Search for the book using the ISBN
    dispatch(searchBook(isbn));

    navigation.navigate("Book Details", { qrCodeData: data });
  };

  const extractISBN = (qrCodeData) => {
    // Assuming the QR code contains the ISBN directly
    const regex = /\b\d{10,13}\b/;
    const match = qrCodeData.match(regex);
    return match ? match[0] : null;
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
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
});

export default QRCodeScannerScreen;
