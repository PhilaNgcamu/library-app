// QRCodeScannerScreen.js
import React, { useCallback, useEffect } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { Camera } from "expo-camera";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import {
  searchBook,
  setScanned,
  resetScanned,
  setHasPermission,
  incrementCameraKey,
} from "../redux/actions";
import { Button, ButtonText } from "@gluestack-ui/themed";

const QRCodeScannerScreen = () => {
  const dispatch = useDispatch();
  const hasPermission = useSelector((state) => state.books.hasPermission);
  const cameraKey = useSelector((state) => state.books.cameraKey);
  const scanned = useSelector((state) => state.books.scanned);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      dispatch(setHasPermission(status === "granted"));
    })();
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      dispatch(resetScanned());
      dispatch(incrementCameraKey());
      return () => {};
    }, [dispatch])
  );

  const handleBarCodeScanned = ({ type, data }) => {
    dispatch(setScanned());
    console.log(data);

    const isbn = extractISBN(data);
    console.log("ISBN:", isbn);

    dispatch(searchBook(isbn));
  };

  const extractISBN = (qrCodeData) => {
    const regex = /\b\d{10,13}\b/;
    const match = qrCodeData.match(regex);
    return match ? match[0] : null;
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
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        key={cameraKey}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      {scanned && (
        <Button
          style={{ backgroundColor: "#32a244" }}
          onPress={() => dispatch(resetScanned())}
        >
          <ButtonText>Tap to Scan Again</ButtonText>
        </Button>
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
